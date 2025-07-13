#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Update Tool
 * Handles framework self-updates and version management
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { program } = require('commander');

class FrameworkUpdater {
    constructor() {
        this.frameworkPath = path.dirname(__dirname);
        this.packagePath = path.join(this.frameworkPath, 'package.json');
    }

    // Get current version
    getCurrentVersion() {
        const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
        return packageJson.version;
    }

    // Check for updates
    async checkForUpdates() {
        try {
            console.log('🔍 Checking for framework updates...');
            
            const currentVersion = this.getCurrentVersion();
            console.log(`Current version: ${currentVersion}`);
            
            // Check npm registry for latest version
            const latestVersion = execSync('npm view @superclaude/autodoc-framework version', { 
                encoding: 'utf8' 
            }).trim();
            
            console.log(`Latest version: ${latestVersion}`);
            
            if (currentVersion === latestVersion) {
                console.log('✅ Framework is up to date');
                return false;
            } else {
                console.log('🆕 Update available!');
                return latestVersion;
            }
        } catch (error) {
            console.log('⚠️  Could not check for updates:', error.message);
            return false;
        }
    }

    // Update framework
    async updateFramework() {
        try {
            console.log('🚀 Updating SuperClaude Auto-Documentation Framework...');
            
            execSync('npm update -g @superclaude/autodoc-framework', { 
                stdio: 'inherit' 
            });
            
            console.log('✅ Framework updated successfully!');
        } catch (error) {
            console.error('❌ Update failed:', error.message);
            process.exit(1);
        }
    }

    // Show version info
    showVersion() {
        const packageJson = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
        console.log(`SuperClaude Auto-Documentation Framework v${packageJson.version}`);
        console.log(`Published: ${packageJson.publishConfig?.publishedDate || 'Unknown'}`);
        console.log(`License: ${packageJson.license}`);
        console.log(`Repository: ${packageJson.repository?.url || 'Not specified'}`);
    }

    // Show changelog
    showChangelog() {
        const changelogPath = path.join(this.frameworkPath, 'CHANGELOG.md');
        if (fs.existsSync(changelogPath)) {
            console.log(fs.readFileSync(changelogPath, 'utf8'));
        } else {
            console.log('📝 No changelog available');
        }
    }
}

// CLI setup
program
    .name('superclaude-update')
    .description('SuperClaude Auto-Documentation Framework Update Tool')
    .version('1.0.0');

program
    .command('check')
    .description('Check for framework updates')
    .action(async () => {
        const updater = new FrameworkUpdater();
        await updater.checkForUpdates();
    });

program
    .command('update')
    .description('Update framework to latest version')
    .action(async () => {
        const updater = new FrameworkUpdater();
        await updater.updateFramework();
    });

program
    .command('version')
    .description('Show framework version information')
    .action(() => {
        const updater = new FrameworkUpdater();
        updater.showVersion();
    });

program
    .command('changelog')
    .description('Show framework changelog')
    .action(() => {
        const updater = new FrameworkUpdater();
        updater.showChangelog();
    });

// Default action
if (process.argv.length === 2) {
    const updater = new FrameworkUpdater();
    updater.checkForUpdates().then(updateAvailable => {
        if (updateAvailable) {
            console.log('\nRun `superclaude-update update` to install the latest version.');
        }
    });
} else {
    program.parse();
}

module.exports = FrameworkUpdater;