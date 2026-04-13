import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('snake.play', () => {
        const panel = vscode.window.createWebviewPanel(
            'snakeBreak',
            'Snake Break',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
            }
        );

        // Retrieve saved high score
        const highScore = context.globalState.get<number>('snakeHighScore', 0);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'saveHighScore':
                        context.globalState.update('snakeHighScore', message.score);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );

        panel.webview.html = getWebviewContent(panel.webview, context.extensionPath, highScore);
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent(webview: vscode.Webview, extensionPath: string, highScore: number) {
    const scriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'media', 'game.js'));
    const stylePathOnDisk = vscode.Uri.file(path.join(extensionPath, 'media', 'style.css'));

    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    const styleUri = webview.asWebviewUri(stylePathOnDisk);

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!--
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
    -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Snake Break</title>
</head>
<body>
    <div id="game-container">
        <div id="score-board">
            <span>Bugs Fixed: <span id="score">0</span></span>
            <span id="high-score-container">High Score: <span id="high-score">${highScore}</span></span>
        </div>
        <canvas id="game-canvas" width="400" height="400"></canvas>
        <div id="game-over" class="hidden">
            <h2>GAME OVER</h2>
            <p>Score: <span id="final-score">0</span></p>
            <p>High Score: <span id="final-high-score">${highScore}</span></p>
            <p>Press SPACE to restart</p>
        </div>
    </div>
    
    <!-- Pass initial high score gracefully without inline event handlers -->
    <script nonce="${nonce}">
        window.INITIAL_HIGH_SCORE = ${highScore};
    </script>
    <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export function deactivate() {}
