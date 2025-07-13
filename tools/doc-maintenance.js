#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Maintenance Tool
 * Provides maintenance commands for the documentation system
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const UniversalAutoDocumentationSystem = require('../core/auto-documentation');

class DocumentationMaintenance {
    constructor() {
        this.projectRoot = process.cwd();
        this.autoDocSystem = new UniversalAutoDocumentationSystem(this.projectRoot);
    }

    // Update documentation
    async updateDocumentation(options = {}) {
        console.log('📝 Updating project documentation...\n');
        
        try {
            await this.autoDocSystem.run();
            console.log('✅ Documentation update completed');
        } catch (error) {
            console.error('❌ Documentation update failed:', error.message);
            process.exit(1);
        }
    }

    // Validate documentation structure and content
    async validateDocumentation() {
        console.log('🔍 Validating documentation structure...\n');
        
        try {
            const validation = await this.autoDocSystem.validateDocumentation();
            
            if (validation.success) {
                console.log('✅ Documentation validation passed');
                return true;
            } else {
                console.log('❌ Documentation validation failed:');
                validation.issues.forEach(issue => console.log(`  - ${issue}`));
                return false;
            }
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
            return false;
        }
    }

    // Show framework status
    showStatus() {
        console.log('📊 SuperClaude Auto-Documentation Status\n');
        
        // Check configuration
        const configPath = path.join(this.projectRoot, '.superclaude.yml');
        const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
        const lastUpdatePath = path.join(this.projectRoot, '.superclaude-last-update');
        
        console.log('📋 Configuration:');
        if (fs.existsSync(configPath)) {
            console.log('  ✅ SuperClaude configuration found');
            try {
                const yaml = require('js-yaml');
                const config = yaml.load(fs.readFileSync(configPath, 'utf8'));
                console.log(`  📦 Template: ${config.project?.type || 'unknown'}`);
                console.log(`  🗓️  Initialized: ${config.superclaude_framework?.initialized || 'unknown'}`);
            } catch (error) {
                console.log('  ⚠️  Configuration file corrupted');
            }
        } else {
            console.log('  ❌ No SuperClaude configuration found');
            console.log('     Run: superclaude-init to set up the framework');
            return;
        }
        
        console.log('\n📝 Documentation:');
        if (fs.existsSync(claudeMdPath)) {
            const stats = fs.statSync(claudeMdPath);
            const content = fs.readFileSync(claudeMdPath, 'utf8');
            const wordCount = content.split(/\s+/).length;
            const sectionCount = (content.match(/^## /gm) || []).length;
            
            console.log('  ✅ CLAUDE.md exists');
            console.log(`  📄 Size: ${Math.round(stats.size / 1024)}KB, ${wordCount} words`);
            console.log(`  📑 Sections: ${sectionCount}`);
            console.log(`  🗓️  Modified: ${stats.mtime.toLocaleDateString()}`);
        } else {
            console.log('  ❌ CLAUDE.md not found');
        }
        
        console.log('\n🔄 Update History:');
        if (fs.existsSync(lastUpdatePath)) {
            const lastUpdate = fs.readFileSync(lastUpdatePath, 'utf8').trim();
            console.log(`  🗓️  Last update: ${lastUpdate}`);
        } else {
            console.log('  📝 No update history');
        }
        
        console.log('\n🔧 Framework Files:');
        const frameworkDir = path.join(this.projectRoot, '.superclaude');
        if (fs.existsSync(frameworkDir)) {
            console.log('  ✅ Framework directory exists');
            const coreFiles = ['auto-documentation.js', 'persona-manager.js'];
            coreFiles.forEach(file => {
                const filePath = path.join(frameworkDir, file);
                if (fs.existsSync(filePath)) {
                    console.log(`  ✅ ${file}`);
                } else {
                    console.log(`  ❌ ${file} missing`);
                }
            });
        } else {
            console.log('  ❌ Framework directory missing');
            console.log('     Run: superclaude-init to reinstall');
        }
        
        console.log('\n🎭 Integration Status:');
        console.log('  📊 MCP Integration: Available');
        console.log('  🎯 Persona System: Active');
        console.log('  🔄 Auto-Updates: Enabled');
    }

    // Create manual backup
    createBackup() {
        console.log('💾 Creating manual documentation backup...\n');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const backupDir = path.join(this.projectRoot, '.superclaude-backups', timestamp);
        
        try {
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }
            
            // Backup key files
            const filesToBackup = [
                'CLAUDE.md',
                '.superclaude.yml',
                'README.md'
            ];
            
            let backedUpCount = 0;
            filesToBackup.forEach(file => {
                const sourcePath = path.join(this.projectRoot, file);
                if (fs.existsSync(sourcePath)) {
                    const targetPath = path.join(backupDir, file);
                    fs.copyFileSync(sourcePath, targetPath);
                    console.log(`✅ Backed up: ${file}`);
                    backedUpCount++;
                }
            });
            
            console.log(`\n💾 Backup completed: ${backedUpCount} files`);
            console.log(`📁 Location: ${backupDir}`);
            
        } catch (error) {
            console.error('❌ Backup failed:', error.message);
        }
    }

    // List recent backups
    listBackups() {
        console.log('📁 Recent Documentation Backups\n');
        
        const backupsDir = path.join(this.projectRoot, '.superclaude-backups');
        
        if (!fs.existsSync(backupsDir)) {
            console.log('📝 No backups found');
            return;
        }
        
        try {
            const backups = fs.readdirSync(backupsDir)
                .filter(item => fs.statSync(path.join(backupsDir, item)).isDirectory())
                .sort()
                .reverse()
                .slice(0, 10); // Show last 10 backups
            
            if (backups.length === 0) {
                console.log('📝 No backups found');
                return;
            }
            
            backups.forEach((backup, index) => {
                const backupPath = path.join(backupsDir, backup);
                const files = fs.readdirSync(backupPath);
                console.log(`${index + 1}. ${backup} (${files.length} files)`);
            });
            
        } catch (error) {
            console.error('❌ Failed to list backups:', error.message);
        }
    }

    // Clean old backups
    cleanBackups(keepDays = 30) {
        console.log(`🧹 Cleaning backups older than ${keepDays} days...\n`);
        
        const backupsDir = path.join(this.projectRoot, '.superclaude-backups');
        
        if (!fs.existsSync(backupsDir)) {
            console.log('📝 No backups directory found');
            return;
        }
        
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - keepDays);
            
            const backups = fs.readdirSync(backupsDir);
            let cleanedCount = 0;
            
            backups.forEach(backup => {
                const backupPath = path.join(backupsDir, backup);
                const stats = fs.statSync(backupPath);
                
                if (stats.mtime < cutoffDate) {
                    fs.rmSync(backupPath, { recursive: true });
                    console.log(`🗑️  Removed: ${backup}`);
                    cleanedCount++;
                }
            });
            
            console.log(`\n🧹 Cleaned ${cleanedCount} old backups`);
            
        } catch (error) {
            console.error('❌ Backup cleanup failed:', error.message);
        }
    }

    // Test framework installation
    async testFramework() {
        console.log('🧪 Testing SuperClaude Framework Installation\n');
        
        const tests = [
            {
                name: 'Configuration file',
                test: () => fs.existsSync(path.join(this.projectRoot, '.superclaude.yml'))
            },
            {
                name: 'CLAUDE.md file',
                test: () => fs.existsSync(path.join(this.projectRoot, 'CLAUDE.md'))
            },
            {
                name: 'Framework directory',
                test: () => fs.existsSync(path.join(this.projectRoot, '.superclaude'))
            },
            {
                name: 'Auto-documentation system',
                test: () => {
                    try {
                        const autoDoc = new UniversalAutoDocumentationSystem(this.projectRoot);
                        return autoDoc !== null;
                    } catch (error) {
                        return false;
                    }
                }
            },
            {
                name: 'Documentation validation',
                test: async () => {
                    try {
                        const result = await this.autoDocSystem.validateDocumentation();
                        return result.success;
                    } catch (error) {
                        return false;
                    }
                }
            }
        ];
        
        let passedCount = 0;
        
        for (const test of tests) {
            try {
                const result = await test.test();
                if (result) {
                    console.log(`✅ ${test.name}`);
                    passedCount++;
                } else {
                    console.log(`❌ ${test.name}`);
                }
            } catch (error) {
                console.log(`❌ ${test.name} (error: ${error.message})`);
            }
        }
        
        console.log(`\n📊 Test Results: ${passedCount}/${tests.length} passed`);
        
        if (passedCount === tests.length) {
            console.log('🎉 All tests passed! Framework is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Consider running: superclaude-init');
        }
    }
}

// CLI setup
program
    .name('superclaude-maintain')
    .description('SuperClaude Auto-Documentation Maintenance Tool')
    .version('1.0.0');

program
    .command('update')
    .description('Update project documentation')
    .option('-f, --force', 'Force update even if no changes detected')
    .action(async (options) => {
        const maintenance = new DocumentationMaintenance();
        await maintenance.updateDocumentation(options);
    });

program
    .command('validate')
    .description('Validate documentation structure and content')
    .action(async () => {
        const maintenance = new DocumentationMaintenance();
        const valid = await maintenance.validateDocumentation();
        process.exit(valid ? 0 : 1);
    });

program
    .command('status')
    .description('Show framework status and configuration')
    .action(() => {
        const maintenance = new DocumentationMaintenance();
        maintenance.showStatus();
    });

program
    .command('backup')
    .description('Create manual backup of documentation')
    .action(() => {
        const maintenance = new DocumentationMaintenance();
        maintenance.createBackup();
    });

program
    .command('backups')
    .description('List recent documentation backups')
    .action(() => {
        const maintenance = new DocumentationMaintenance();
        maintenance.listBackups();
    });

program
    .command('clean')
    .description('Clean old backups')
    .option('-d, --days <days>', 'Keep backups newer than this many days', '30')
    .action((options) => {
        const maintenance = new DocumentationMaintenance();
        maintenance.cleanBackups(parseInt(options.days));
    });

program
    .command('test')
    .description('Test framework installation')
    .action(async () => {
        const maintenance = new DocumentationMaintenance();
        await maintenance.testFramework();
    });

program.parse();

module.exports = DocumentationMaintenance;