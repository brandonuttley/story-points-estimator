# Story Points Estimator - Setup and Maintenance Guide

## Overview
The Story Points Estimator is a Next.js application that helps development teams estimate task complexity using animal-based analogies. This guide explains how to run, deploy, and maintain the application.

## Running Locally

### Prerequisites
- Node.js installed on your computer
- Git installed on your computer
- VS Code or another code editor
- A terminal/command prompt

### Local Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/brandonuttley/story-points-estimator.git
   cd story-points-estimator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

The application should now be running locally. Any changes you make to the code will automatically refresh in the browser.

## Accessing the Online Version

The application is deployed on GitHub Pages and can be accessed at:
```
https://brandonuttley.github.io/story-points-estimator
```

## Making and Deploying Changes

### Local Development
1. Open the project in VS Code:
   ```bash
   code .
   ```

2. Make your desired changes to the code
   - Main component: `/components/StoryPointEstimator.tsx`
   - Page layout: `/app/page.tsx`
   - Configuration: `next.config.js`

3. Test your changes locally using `npm run dev`

### Deploying to GitHub Pages

After making changes:

1. Save all modified files

2. Stage your changes:
   ```bash
   git add .
   ```

3. Commit your changes:
   ```bash
   git commit -m "Description of your changes"
   ```

4. Push to GitHub:
   ```bash
   git push origin main
   ```

The GitHub Actions workflow will automatically:
- Build the application
- Deploy to GitHub Pages
- Make your changes live at the GitHub Pages URL

You can monitor the deployment progress in the "Actions" tab of your GitHub repository.

## Running Local and Online Versions

The Story Points Estimator can run both locally and online simultaneously. Here's how each version works:

### Local Version (Development)
- Requires Terminal to be running with `npm run dev` active
- Only accessible when your development server is running
- Available at `localhost:3000`
- Shows real-time updates as you make code changes
- Great for development and testing
- Will stop when you close Terminal or stop the development server

### GitHub Pages Version (Production)
- Always available at https://brandonuttley.github.io/story-points-estimator
- Runs independently of your local environment
- Doesn't require your Terminal or local machine
- Updates only when you push new changes to GitHub
- Perfect for sharing with your team

You can use both versions for different purposes:
1. Use the local version for developing and testing new features
2. Have team members use the stable GitHub Pages version
3. Push your changes to GitHub when ready
4. Both versions can run at the same time without conflict

## Project Structure

Key files and their purposes:

- `/components/StoryPointEstimator.tsx`: Main application component
- `/app/page.tsx`: Next.js page component
- `next.config.js`: Next.js configuration
- `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment

## Troubleshooting

### Common Local Development Issues

1. **Module Not Found Errors**
   - Solution: Run `npm install` to ensure all dependencies are installed

2. **Port Already in Use**
   - Solution: Kill the process using the port or use a different port:
     ```bash
     npm run dev -- -p 3001
     ```

### Deployment Issues

1. **Failed GitHub Actions**
   - Check the Actions tab for specific error messages
   - Verify your changes compile locally before pushing
   - Ensure all files are properly committed and pushed

2. **Page Not Updating**
   - Clear your browser cache
   - Wait a few minutes for the deployment to complete
   - Check the Actions tab for deployment status

## Reconnecting to GitHub

If you need to reconnect to GitHub after closing and reopening Terminal:

1. Navigate to your project directory:
   ```bash
   cd story-points-new
   ```

2. Check if you're already connected:
   ```bash
   git remote -v
   ```

3. If needed, reconnect to your repository:
   ```bash
   git remote add origin https://github.com/brandonuttley/story-points-estimator.git
   ```

4. Set the main branch:
   ```bash
   git branch -M main
   ```

5. Verify connection by pulling latest changes:
   ```bash
   git pull origin main
   ```

Note: If prompted for credentials, use your GitHub username and Personal Access Token (PAT) as the password.

## Support and Updates

For questions or issues:
1. Check the [GitHub repository issues](https://github.com/brandonuttley/story-points-estimator/issues)
2. Create a new issue if needed
3. Include as much detail as possible about the problem

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)