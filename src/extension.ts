import * as vscode from 'vscode';
import generateJsdoc from './generateJsdoc';
import parseCode from './parseCode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "strigi" is now active!');

	let disposable = vscode.commands.registerCommand('strigi.addJSDoc', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor');
			return;
		}

		const document = editor.document;
		const code = document.getText();

		try {
			vscode.window.showInformationMessage('Generating JSDoc...');

			const nodes = await parseCode(code);

			for (let node of nodes) {
				const jsdoc = await generateJsdoc(node.code);

				editor.edit((editBuilder) => {
					const position = new vscode.Position(node.start?.line ?? 0, node.start?.column ?? 0);

					const comment = jsdoc;
					editBuilder.insert(position, comment);
				});
			}

			vscode.window.showInformationMessage('JSDoc generated successfully.');
		} catch (error) {
			vscode.window.showErrorMessage('Failed to generate JSDoc: ' + error);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
