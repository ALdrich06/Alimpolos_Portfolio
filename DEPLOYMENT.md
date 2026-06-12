# GitHub Deployment Guide

Follow these steps to deploy your ICSA portfolio to GitHub Pages.

## Prerequisites

- Git installed on your computer
- GitHub account created

## Step-by-Step Deployment

### 1. Initialize Git Repository

Open your terminal/command prompt in the portfolio folder and run:

```bash
git init
git add .
git commit -m "Initial commit: ICSA Portfolio"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Name your repository (e.g., `icsa-portfolio` or `Alimpolos_Portfolio`)
5. Keep it **Public** (required for free GitHub Pages)
6. **DO NOT** initialize with README (we already have one)
7. Click **Create repository**

### 3. Connect Local Repository to GitHub

Copy the commands from GitHub (they will look like this):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### 5. Access Your Live Portfolio

After a few minutes, your portfolio will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example: `https://johndoe.github.io/icsa-portfolio/`

## Updating Your Portfolio

Whenever you make changes to your portfolio:

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Your live site will automatically update within a few minutes!

## Custom Domain (Optional)

If you want to use a custom domain:

1. Buy a domain from a domain registrar
2. In your repository, go to Settings > Pages
3. Enter your custom domain
4. Follow GitHub's instructions to configure DNS settings

## Troubleshooting

### Portfolio not showing up?
- Wait 5-10 minutes after enabling Pages
- Check that your repository is Public
- Verify the branch and folder settings in Pages

### Changes not appearing?
- Make sure you pushed your commits: `git push`
- Clear your browser cache
- Wait a few minutes for GitHub to rebuild

### Need help with Git commands?
- Check if Git is installed: `git --version`
- Configure Git (first time only):
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```

## Quick Reference Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

---

**Need more help?** Check out [GitHub Pages Documentation](https://docs.github.com/en/pages)
