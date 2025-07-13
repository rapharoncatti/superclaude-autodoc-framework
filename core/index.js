#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Core Entry Point
 * Universal auto-documentation system for any project type
 */

const UniversalAutoDocumentationSystem = require('./auto-documentation');
const fs = require('fs');
const path = require('path');

class SuperClaudeFramework {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.version = '1.0.0';
    }

    // Initialize framework in a project
    async init(options = {}) {
        const ProjectInitializer = require('../setup/project-initializer');
        const initializer = new ProjectInitializer();
        
        return await initializer.initialize(this.projectRoot, options);
    }

    // Run auto-documentation
    async update(options = {}) {
        const autoDoc = new UniversalAutoDocumentationSystem(this.projectRoot);
        return await autoDoc.run();
    }

    // Validate documentation
    async validate() {
        const autoDoc = new UniversalAutoDocumentationSystem(this.projectRoot);
        return await autoDoc.validateDocumentation();
    }

    // Get framework status
    getStatus() {
        const configPath = path.join(this.projectRoot, '.superclaude.yml');
        const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
        
        return {
            version: this.version,
            project_root: this.projectRoot,
            initialized: fs.existsSync(configPath),
            has_documentation: fs.existsSync(claudeMdPath),
            config_path: configPath,
            documentation_path: claudeMdPath
        };
    }

    // Export framework components
    static get components() {
        return {
            UniversalAutoDocumentationSystem,
            ProjectInitializer: require('../setup/project-initializer'),
            DocumentationMaintenance: require('../tools/doc-maintenance')
        };
    }
}

// CLI interface
if (require.main === module) {
    const framework = new SuperClaudeFramework();
    
    const command = process.argv[2];
    
    switch (command) {
        case 'init':
            framework.init().catch(console.error);
            break;
        case 'update':
            framework.update().catch(console.error);
            break;
        case 'validate':
            framework.validate().then(result => {
                console.log(result.success ? '✅ Valid' : '❌ Invalid');
                process.exit(result.success ? 0 : 1);
            }).catch(console.error);
            break;
        case 'status':
            console.log(JSON.stringify(framework.getStatus(), null, 2));
            break;
        default:
            console.log('SuperClaude Auto-Documentation Framework v' + framework.version);
            console.log('');
            console.log('Commands:');
            console.log('  init      Initialize framework in project');
            console.log('  update    Update project documentation');
            console.log('  validate  Validate documentation');
            console.log('  status    Show framework status');
            console.log('');
            console.log('Use superclaude-init and superclaude-maintain for full CLI experience');
    }
}

module.exports = SuperClaudeFramework;