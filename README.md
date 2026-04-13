# Snake Break 🐍

A fast, nostalgic Snake game inside the editor as a lightweight micro-break tool. Take a moment to fix some bugs (🐛) and relax your brain!

## Features
- **Instant Launch**: Starts instantly with no loading delays using zero external dependencies.
- **Micro-Break Focus**: Built purely for momentary distraction; uses an underlying `<canvas>` for extremely fast, responsive gameplay.
- **Score Persistence**: Automatically stores your High Score locally inside VS Code's global state!

---

## 🚀 How to Publish to the VS Code Marketplace

Making your extension available to the world so anyone can search for "Snake Break" inside VS Code and install it is straightforward. 

### Step 1: Create an Azure DevOps Organization
VS Code Extensions are authenticated via Microsoft Azure.
1. Go to [Azure DevOps](https://dev.azure.com/) and sign in.
2. Create a new Organization (if you don’t have one).
3. Once logged in, generate a **Personal Access Token (PAT)** from your User settings (top right corner). 
   - Under **Scopes**, scroll down and select **Marketplace: Acquire, Manage**.
   - Copy this Token and keep it safe!

### Step 2: Create a Publisher on the VS Code Marketplace
1. Go to the [VS Code Marketplace Management page](https://marketplace.visualstudio.com/manage) and sign in.
2. Create a Publisher. 
3. *Important:* The "ID" you choose for your Publisher must match the `"publisher": "pranavvetkar"` property in your `package.json` file. If you use a different name, make sure to update `package.json`!

### Step 3: Install Publisher Tools and Publish
1. Open your terminal and install the official VS Code CLI publishing tool:
   ```bash
   npm install -g @vscode/vsce
   ```
2. Log in using the Personal Access Token you generated in Step 1:
   ```bash
   vsce login pranavvetkar
   ```
3. Bundle and publish the extension from the root folder:
   ```bash
   vsce publish
   ```
*(Note: If you only want to generate a local `.vsix` file to share directly with friends, you can just run `vsce package` instead).*

---

## 📈 Monitoring Metrics (Downloads & Ratings)

The best part about the VS Code Marketplace is that metrics are tracked automatically for free!

Once published, navigate to your extension's management portal at **[marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)**:
- **Downloads/Installs**: Instantly tracked. You can see how many users have installed your extension vs uninstalled.
- **Ratings & Reviews**: Users can leave 1 to 5-star ratings from directly within VS Code or the web page. You will see these metrics on your manage tab and optionally reply to them directly.
- **Analytics**: VSC provides an integrated dashboard charting your traffic over the past 30 days!
