import * as ts from "typescript";
import { assert, globalEval } from "./util";
import { readFileSync } from "./fs";

export function compile(cwd: string, inputFn: string): void {
  const options: ts.CompilerOptions = {
    "allowJs": true,
    "outFile": "out.js",
  };
  const host = new CompilerHost(cwd);

  let program = ts.createProgram([inputFn], options, host);
  //let sourceFiles = program.getSourceFiles();
  //console.log("rootFileNames", program.getRootFileNames());

  let emitResult = program.emit();
  assert(!emitResult.emitSkipped);
  //console.log("emitResult", emitResult);
}

export class CompilerHost {
  constructor(public cwd: string) {}

  getSourceFile(
    fileName: string,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    //console.log("getSourceFile", fileName);
    let sourceText: string;
    if (fileName === "lib.d.ts") {
      // TODO this should be compiled into the bindata.
      sourceText = readFileSync("node_modules/typescript/lib/lib.d.ts");
    } else {
      sourceText = readFileSync(fileName);
    }
    if (sourceText) {
      return ts.createSourceFile(fileName, sourceText, languageVersion);
    } else {
      return undefined;
    }
  }

  getSourceFileByPath?(
    fileName: string,
    path: ts.Path,
    languageVersion: ts.ScriptTarget,
    onError?: (message: string) => void,
    shouldCreateNewSourceFile?: boolean
  ): ts.SourceFile | undefined {
    console.log("getSourceFileByPath", fileName);
    return undefined;
  }

  // getCancellationToken?(): CancellationToken;
  getDefaultLibFileName(options: ts.CompilerOptions): string {
    return ts.getDefaultLibFileName(options);
  }

  getDefaultLibLocation(): string {
    return "/blah/";
  }

  outFileSource: string;
  writeFile(
    fileName: string,
    data: string,
    writeByteOrderMark: boolean,
    onError: ((message: string) => void) | undefined,
    sourceFiles: ReadonlyArray<ts.SourceFile>
  ): void {
    //console.log("writeFile", fileName);
    //console.log("writeFile source", data);
    globalEval(data);
    //this.outFileSource = data;
  }

  getCurrentDirectory(): string {
    return this.cwd;
  }

  getDirectories(path: string): string[] {
    console.log("getDirectories", path);
    return [];
  }

  getCanonicalFileName(fileName: string): string {
    return fileName;
  }

  useCaseSensitiveFileNames(): boolean {
    return true;
  }

  getNewLine(): string {
    return "\n";
  }

  resolveModuleNames(
    moduleNames: string[],
    containingFile: string,
    reusedNames?: string[]
  ): (ts.ResolvedModule | undefined)[] {
    console.log("resolveModuleNames", moduleNames);
    return [];
  }

  fileExists(fileName: string): boolean {
    console.log("fileExists", fileName);
    return false;
  }

  readFile(fileName: string): string | undefined {
    console.log("readFile", fileName);
    return undefined;
  }

  /**
   * This method is a companion for 'resolveModuleNames' and is used to resolve
   * 'types' references to actual type declaration files
   */
  // resolveTypeReferenceDirectives?(typeReferenceDirectiveNames: string[],
  // containingFile: string): (ResolvedTypeReferenceDirective | undefined)[];

  // getEnvironmentVariable?(name: string): string
  // createHash?(data: string): string;
}