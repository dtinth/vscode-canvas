import * as vscode from 'vscode'

let currentPanel: vscode.WebviewPanel | undefined = undefined

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('canvasrenderer3.openPreview', () => {
      const panel = vscode.window.createWebviewPanel(
        'canvasrenderer3',
        'canvasrenderer3',
        {
          viewColumn: vscode.ViewColumn.Beside,
          preserveFocus: true,
        },
        {
          enableScripts: true,
        },
      )
      currentPanel = panel
      panel.onDidDispose(() => {
        currentPanel = undefined
      })
      panel.webview.html = getWebviewContent(context, panel.webview)
    }),
  )
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(
      'canvasrenderer3',
      new CanvasRendererWebViewPanelSerializer(context),
    ),
  )
}

export function deactivate() {}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta
		http-equiv="Content-Security-Policy"
		content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${
    webview.cspSource
  }; style-src ${webview.cspSource}; connect-src ${
    webview.cspSource
  }; worker-src blob:;"
	/>
	<title>hey</title>
</head>
<body>
	<div id="main"></div>
	<script
		id="script"
		src="${webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'viewer/index.js'),
    )}"
		data-worker-url="${webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'viewer/worker.js'),
    )}"
	></script>
</body>
</html>`
}

class CanvasRendererWebViewPanelSerializer
  implements vscode.WebviewPanelSerializer
{
  constructor(private context: vscode.ExtensionContext) {}
  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
    webviewPanel.webview.html = getWebviewContent(
      this.context,
      webviewPanel.webview,
    )
  }
}
