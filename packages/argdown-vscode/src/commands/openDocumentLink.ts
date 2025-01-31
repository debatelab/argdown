import * as vscode from "vscode";

import { Command } from "./Command";
//import { ArgdownEngine } from '../preview/ArgdownEngine';
// import { TableOfContentsProvider } from '../tableOfContentsProvider';
import { isArgdownFile } from "../preview/util/file";
import { Utils } from "vscode-uri";

export interface OpenDocumentLinkArgs {
  path: string;
  fragment: string;
}

export class OpenDocumentLinkCommand implements Command {
  private static readonly id = "_argdown.openDocumentLink";
  public readonly id = OpenDocumentLinkCommand.id;

  public static createCommandUri(path: string, fragment: string): vscode.Uri {
    return vscode.Uri.parse(
      `command:${OpenDocumentLinkCommand.id}?${encodeURIComponent(
        JSON.stringify({ path, fragment })
      )}`
    );
  }

  public constructor() //private readonly engine: ArgdownEngine
  {}

  public execute(args: OpenDocumentLinkArgs) {
    const p = decodeURIComponent(args.path);
    return this.tryOpen(p).catch(() => {
      if (Utils.extname(vscode.Uri.parse(p)) === "") {
        return this.tryOpen(p + ".ad");
      }
      const resource = vscode.Uri.parse(p);
      return Promise.resolve(void 0)
        .then(() => vscode.commands.executeCommand("vscode.open", resource))
        .then(() => void 0);
    });
  }

  private async tryOpen(
    path: string //, args: OpenDocumentLinkArgs)
  ) {
    if (
      vscode.window.activeTextEditor &&
      isArgdownFile(vscode.window.activeTextEditor.document) &&
      vscode.window.activeTextEditor.document.uri.fsPath === path
    ) {
      //return this.tryRevealLine(vscode.window.activeTextEditor, args.fragment);
    } else {
      const resource = vscode.Uri.parse(path);
      return vscode.workspace
        .openTextDocument(resource)
        .then(vscode.window.showTextDocument);
      //.then(editor => this.tryRevealLine(editor, args.fragment));
    }
    return;
  }

  // private async tryRevealLine(editor: vscode.TextEditor, fragment?: string) {
  // 	if (editor && fragment) {
  // 		const toc = new TableOfContentsProvider(this.engine, editor.document);
  // 		const entry = await toc.lookup(fragment);
  // 		if (entry) {
  // 			return editor.revealRange(new vscode.Range(entry.line, 0, entry.line, 0), vscode.TextEditorRevealType.AtTop);
  // 		}
  // 		const lineNumberFragment = fragment.match(/^L(\d+)$/);
  // 		if (lineNumberFragment) {
  // 			const line = +lineNumberFragment[1] - 1;
  // 			if (!isNaN(line)) {
  // 				return editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.AtTop);
  // 			}
  // 		}
  // 	}
  // }
}
