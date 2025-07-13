#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Project Initializer
 * Sets up auto-documentation for any project type
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');
const { program } = require('commander');

class ProjectInitializer {
    constructor() {
        this.frameworkPath = path.dirname(__dirname);
        this.templatesPath = path.join(this.frameworkPath, 'templates');
        this.availableTemplates = this.getAvailableTemplates();
    }

    // Get list of available project templates
    getAvailableTemplates() {
        try {
            return fs.readdirSync(this.templatesPath)
                .filter(item => fs.statSync(path.join(this.templatesPath, item)).isDirectory());
        } catch (error) {
            console.log('⚠️  Could not read templates directory');
            return ['generic'];
        }
    }

    // Detect project type automatically
    async detectProjectType(projectPath) {
        console.log('🔍 Auto-detecting project type...');
        
        const detectionRules = {
            'unity-gamedev': [
                'Assets/Scripts',
                'ProjectSettings/ProjectVersion.txt',
                'Packages/manifest.json'
            ],
            'web-development': [
                'package.json',
                'src/App.js',
                'src/App.jsx',
                'src/App.tsx',
                'src/App.vue'
            ],
            'data-science': [
                'requirements.txt',
                'notebooks/',
                'data/',
                'models/',
                '*.ipynb'
            ],
            'backend-api': [
                'server.js',
                'app.js',
                'main.py',
                'app.py',
                'src/main.ts'
            ]
        };

        for (const [templateName, indicators] of Object.entries(detectionRules)) {
            let matches = 0;
            for (const indicator of indicators) {
                if (indicator.includes('*')) {
                    // Glob pattern
                    try {
                        const glob = require('glob');
                        const files = glob.sync(indicator, { cwd: projectPath });
                        if (files.length > 0) matches++;
                    } catch (error) {
                        // Fallback without glob
                        continue;
                    }
                } else {
                    // Direct file/directory check
                    if (fs.existsSync(path.join(projectPath, indicator))) {
                        matches++;
                    }
                }
            }
            
            if (matches >= 2) {
                console.log(`✅ Detected project type: ${templateName}`);
                return templateName;
            }
        }

        console.log('🔍 Could not auto-detect project type, using generic template');
        return 'generic';
    }

    // Load template configuration
    loadTemplate(templateName) {
        const templatePath = path.join(this.templatesPath, templateName);
        const configPath = path.join(templatePath, 'config.yml');
        
        if (!fs.existsSync(configPath)) {
            throw new Error(`Template config not found: ${templateName}`);
        }

        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            return yaml.load(configContent);
        } catch (error) {
            throw new Error(`Failed to load template ${templateName}: ${error.message}`);
        }
    }

    // Create SuperClaude configuration file
    createProjectConfig(projectPath, template, customOptions = {}) {
        const config = {
            superclaude_framework: {
                version: "1.0.0",
                template: template.project_type,
                initialized: new Date().toISOString()
            },
            project: {
                type: template.project_type,
                description: template.description,
                technologies: template.technologies || [],
                ...customOptions.project
            },
            patterns: template.patterns,
            documentation_sections: template.documentation_sections,
            mcp_integration: template.mcp_integration,
            personas: template.personas,
            auto_doc: {
                ...template.auto_doc,
                ...customOptions.autoDoc
            }
        };

        const configPath = path.join(projectPath, '.superclaude.yml');
        fs.writeFileSync(configPath, yaml.dump(config, { indent: 2 }));
        console.log(`✅ Created SuperClaude configuration: .superclaude.yml`);
        
        return configPath;
    }

    // Create basic CLAUDE.md structure
    createClaudeMd(projectPath, template) {
        const claudeMdPath = path.join(projectPath, 'CLAUDE.md');
        
        if (fs.existsSync(claudeMdPath)) {
            console.log('📝 CLAUDE.md already exists, backing up...');
            fs.copyFileSync(claudeMdPath, `${claudeMdPath}.backup`);
        }

        const sections = template.documentation_sections;
        let content = `# CLAUDE.md - ${template.description}\n\n`;
        content += `This project uses the SuperClaude Auto-Documentation Framework.\n\n`;
        content += `**Project Type**: ${template.project_type}\n`;
        content += `**Technologies**: ${template.technologies.join(', ')}\n`;
        content += `**Initialized**: ${new Date().toLocaleDateString()}\n\n`;

        // Add sections
        sections.forEach(section => {
            content += `## ${section.name}\n\n`;
            if (section.description) {
                content += `${section.description}\n\n`;
            }
            if (section.auto_update) {
                content += `*This section is automatically maintained by the SuperClaude framework.*\n\n`;
            }
        });

        // Add framework status section
        content += `## SuperClaude Integration Status\n\n`;
        content += `- **Framework Version**: 1.0.0\n`;
        content += `- **Template**: ${template.project_type}\n`;
        content += `- **Auto-Documentation**: Active\n`;
        content += `- **MCP Integration**: ${template.mcp_integration.recommended_servers.join(', ')}\n\n`;

        fs.writeFileSync(claudeMdPath, content);
        console.log(`✅ Created CLAUDE.md with ${sections.length} sections`);
    }

    // Copy core framework files
    copyFrameworkFiles(projectPath) {
        const coreFiles = [
            'core/auto-documentation.js',
            'core/persona-manager.js'
        ];

        const targetDir = path.join(projectPath, '.superclaude');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        coreFiles.forEach(file => {
            const sourcePath = path.join(this.frameworkPath, file);
            const targetPath = path.join(targetDir, path.basename(file));
            
            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`✅ Copied ${path.basename(file)}`);
            }
        });
    }

    // Create maintenance scripts
    createMaintenanceScripts(projectPath) {
        // Create maintenance script
        const maintenanceScript = `#!/bin/bash

# SuperClaude Documentation Maintenance
# Generated by @superclaude/autodoc-framework

PROJECT_ROOT="$(cd "$(dirname "$\{BASH_SOURCE[0]\}")" && pwd)"

case "$1" in
    "update")
        echo "📝 Updating documentation..."
        node "$PROJECT_ROOT/.superclaude/auto-documentation.js"
        ;;
    "validate")
        echo "🔍 Validating documentation..."
        node "$PROJECT_ROOT/.superclaude/auto-documentation.js" --validate
        ;;
    "status")
        echo "📊 SuperClaude status:"
        if [ -f "$PROJECT_ROOT/.superclaude-last-update" ]; then
            echo "Last update: $(cat "$PROJECT_ROOT/.superclaude-last-update")"
        else
            echo "No update history found"
        fi
        ;;
    "backup")
        echo "💾 Creating documentation backup..."
        timestamp=$(date +%Y%m%d_%H%M%S)
        backup_dir="$PROJECT_ROOT/.superclaude-backups/$timestamp"
        mkdir -p "$backup_dir"
        cp CLAUDE.md "$backup_dir/" 2>/dev/null || echo "CLAUDE.md not found"
        echo "Backup created in: $backup_dir"
        ;;
    "help"|*)
        echo "SuperClaude Documentation Maintenance:"
        echo ""
        echo "  update     - Update documentation sections"
        echo "  validate   - Validate documentation structure"
        echo "  status     - Show framework status"
        echo "  backup     - Create manual backup"
        echo "  help       - Show this help"
        ;;
esac
`;

        const scriptPath = path.join(projectPath, 'superclaude-maintain.sh');
        fs.writeFileSync(scriptPath, maintenanceScript);
        fs.chmodSync(scriptPath, '755');
        console.log('✅ Created maintenance script: superclaude-maintain.sh');
    }

    // Setup git hooks
    setupGitHooks(projectPath) {
        const gitHooksDir = path.join(projectPath, '.git', 'hooks');
        
        if (!fs.existsSync(gitHooksDir)) {
            console.log('⚠️  Git not initialized, skipping hooks setup');
            return;
        }

        // Pre-commit hook
        const preCommitHook = `#!/bin/bash
# SuperClaude pre-commit hook

echo "📝 SuperClaude: Updating documentation..."
node .superclaude/auto-documentation.js 2>/dev/null || true
git add CLAUDE.md 2>/dev/null || true
`;

        const preCommitPath = path.join(gitHooksDir, 'pre-commit');
        fs.writeFileSync(preCommitPath, preCommitHook);
        fs.chmodSync(preCommitPath, '755');
        console.log('✅ Installed git pre-commit hook');
    }

    // Main initialization method
    async initialize(projectPath, options = {}) {
        console.log('🚀 SuperClaude Auto-Documentation Framework');
        console.log('==========================================');
        console.log(`Initializing in: ${projectPath}\n`);

        try {
            // Detect or use specified template
            let templateName = options.type;
            if (!templateName) {
                templateName = await this.detectProjectType(projectPath);
            }

            if (!this.availableTemplates.includes(templateName)) {
                throw new Error(`Template not found: ${templateName}. Available: ${this.availableTemplates.join(', ')}`);
            }

            // Load template
            console.log(`📋 Loading template: ${templateName}`);
            const template = this.loadTemplate(templateName);
            
            // Create configuration
            this.createProjectConfig(projectPath, template, options);
            
            // Create CLAUDE.md
            this.createClaudeMd(projectPath, template);
            
            // Copy framework files
            console.log('📦 Installing framework files...');
            this.copyFrameworkFiles(projectPath);
            
            // Create maintenance scripts
            this.createMaintenanceScripts(projectPath);
            
            // Setup git hooks
            this.setupGitHooks(projectPath);
            
            console.log('\n🎉 SuperClaude Auto-Documentation Framework initialized successfully!');
            console.log('\n📝 Available commands:');
            console.log('  ./superclaude-maintain.sh update     - Update documentation');
            console.log('  ./superclaude-maintain.sh status     - Check status');
            console.log('  ./superclaude-maintain.sh help       - Show all commands');
            console.log('\n🤖 Your documentation will now maintain itself!');

        } catch (error) {
            console.error('❌ Initialization failed:', error.message);
            process.exit(1);
        }
    }

    // Show available templates
    listTemplates() {
        console.log('📋 Available SuperClaude Templates:\n');
        
        this.availableTemplates.forEach(templateName => {
            try {
                const template = this.loadTemplate(templateName);
                console.log(`🎯 ${templateName}`);
                console.log(`   ${template.description}`);
                console.log(`   Technologies: ${template.technologies.join(', ')}`);
                console.log('');
            } catch (error) {
                console.log(`⚠️  ${templateName} (config error)`);
            }
        });
    }
}

// CLI setup
program
    .name('superclaude-init')
    .description('Initialize SuperClaude Auto-Documentation Framework in any project')
    .version('1.0.0');

program
    .command('init')
    .description('Initialize SuperClaude in current directory')
    .option('-t, --type <template>', 'Project template type')
    .option('--list-templates', 'Show available templates')
    .action(async (options) => {
        const initializer = new ProjectInitializer();
        
        if (options.listTemplates) {
            initializer.listTemplates();
            return;
        }
        
        const projectPath = process.cwd();
        await initializer.initialize(projectPath, options);
    });

program
    .command('templates')
    .description('List available project templates')
    .action(() => {
        const initializer = new ProjectInitializer();
        initializer.listTemplates();
    });

// Default command
if (process.argv.length === 2) {
    // Run init by default
    const initializer = new ProjectInitializer();
    initializer.initialize(process.cwd()).catch(console.error);
} else {
    program.parse();
}

module.exports = ProjectInitializer;