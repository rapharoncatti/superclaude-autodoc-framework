#!/usr/bin/env node

/**
 * Universal Auto-Documentation System for SuperClaude Projects
 * Abstracted from Unity-specific implementation to work with any project type
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const yaml = require('js-yaml');

const execAsync = promisify(exec);

class UniversalAutoDocumentationSystem {
    constructor(projectRoot = process.cwd(), configFile = null) {
        this.projectRoot = projectRoot;
        this.claudeMdPath = path.join(projectRoot, 'CLAUDE.md');
        this.lastUpdateFile = path.join(projectRoot, '.superclaude-last-update');
        
        // Load project configuration
        this.projectConfig = this.loadProjectConfig(configFile);
        
        this.config = {
            updateMode: 'moderate', // conservative, moderate, aggressive
            validationLevel: 'semantic', // syntax, semantic, integration
            backupEnabled: true,
            autoCommit: false,
            ...this.projectConfig.autoDoc || {}
        };

        // Dynamic change patterns based on project type
        this.changePatterns = this.buildChangePatterns();
        
        // Dynamic documentation sections based on template
        this.documentationSections = this.projectConfig.documentationSections || this.getDefaultSections();
    }

    // Load project configuration from various sources
    loadProjectConfig(configFile) {
        const configPaths = [
            configFile,
            path.join(this.projectRoot, '.superclaude.yml'),
            path.join(this.projectRoot, '.superclaude.yaml'),
            path.join(this.projectRoot, 'superclaude.config.yml'),
            path.join(this.projectRoot, 'superclaude.config.yaml')
        ].filter(Boolean);

        for (const configPath of configPaths) {
            if (fs.existsSync(configPath)) {
                try {
                    const content = fs.readFileSync(configPath, 'utf8');
                    const config = yaml.load(content);
                    console.log(`✅ Loaded configuration from: ${path.basename(configPath)}`);
                    return config;
                } catch (error) {
                    console.log(`⚠️  Failed to load config ${configPath}: ${error.message}`);
                }
            }
        }

        // Return default configuration
        return this.getDefaultConfig();
    }

    // Get default configuration for unknown project types
    getDefaultConfig() {
        return {
            projectType: 'generic',
            technologies: [],
            patterns: {
                sourceFiles: '\\.(js|ts|py|java|cs|cpp|c|h|php|rb|go|rs)$',
                configFiles: '\\.(json|yml|yaml|toml|ini|conf)$',
                testFiles: '\\.(test|spec)\\.',
                docFiles: '\\.(md|txt|rst|adoc)$'
            },
            documentationSections: [
                { name: 'Project Overview', autoUpdate: true },
                { name: 'Architecture Overview', autoUpdate: true },
                { name: 'Development Setup', autoUpdate: true },
                { name: 'System Status', autoUpdate: true }
            ],
            mcpIntegration: {
                recommendedServers: ['context7', 'sequential'],
                optionalServers: ['magic', 'puppeteer']
            }
        };
    }

    // Build change patterns from project configuration
    buildChangePatterns() {
        const patterns = this.projectConfig.patterns || {};
        
        return {
            sourceFiles: new RegExp(patterns.sourceFiles || '\\.(js|ts|py|java|cs)$'),
            configFiles: new RegExp(patterns.configFiles || '\\.(json|yml|yaml)$'),
            testFiles: new RegExp(patterns.testFiles || '\\.(test|spec)\\.'),
            docFiles: new RegExp(patterns.docFiles || '\\.md$'),
            packageFiles: new RegExp(patterns.packageFiles || 'package\\.json$|requirements\\.txt$|Cargo\\.toml$|pom\\.xml$')
        };
    }

    // Get default documentation sections
    getDefaultSections() {
        return [
            'Project Overview',
            'Architecture Overview',
            'Development Setup',
            'System Status',
            'SuperClaude Integration Status'
        ];
    }

    // Main auto-documentation workflow
    async run() {
        console.log(`🤖 Universal Auto-Documentation System (${this.projectConfig.projectType || 'generic'})`);
        console.log('=' .repeat(70));
        
        try {
            // 1. Detect changes
            const changes = await this.detectChanges();
            if (changes.length === 0) {
                console.log('✅ No changes detected - documentation up to date');
                return;
            }

            console.log(`📊 Detected ${changes.length} change(s):`);
            changes.forEach(change => console.log(`  - ${change.type}: ${change.file}`));
            console.log('');

            // 2. Backup current documentation
            if (this.config.backupEnabled) {
                await this.backupDocumentation();
            }

            // 3. Analyze changes and generate updates
            const updates = await this.analyzeChanges(changes);
            
            // 4. Apply updates to documentation
            await this.applyUpdates(updates);

            // 5. Validate documentation
            const validationResult = await this.validateDocumentation();
            
            if (validationResult.success) {
                console.log('✅ Documentation updated successfully!');
                
                // 6. Auto-commit if enabled
                if (this.config.autoCommit) {
                    await this.commitChanges(updates);
                }
            } else {
                console.log('⚠️  Documentation validation failed - rolling back...');
                await this.rollbackChanges();
            }

        } catch (error) {
            console.error('❌ Auto-documentation failed:', error.message);
            await this.rollbackChanges();
        }
    }

    // Detect changes in the project (abstracted from Unity-specific)
    async detectChanges() {
        const changes = [];
        
        try {
            // Check git status for changes
            const { stdout } = await execAsync('git status --porcelain');
            const gitChanges = stdout.split('\n').filter(line => line.trim());

            for (const line of gitChanges) {
                const status = line.substring(0, 2);
                const file = line.substring(3);
                
                // Categorize changes based on project patterns
                if (this.changePatterns.sourceFiles.test(file)) {
                    changes.push({ type: 'source_file', file, status, language: this.detectLanguage(file) });
                } else if (this.changePatterns.configFiles.test(file)) {
                    changes.push({ type: 'config_file', file, status });
                } else if (this.changePatterns.testFiles.test(file)) {
                    changes.push({ type: 'test_file', file, status });
                } else if (this.changePatterns.packageFiles.test(file)) {
                    changes.push({ type: 'package_file', file, status });
                } else if (this.changePatterns.docFiles.test(file)) {
                    changes.push({ type: 'doc_file', file, status });
                }
            }

            // Check for new files that might need documentation
            const newFiles = await this.findNewFiles();
            changes.push(...newFiles);

        } catch (error) {
            console.log('📝 Note: Git not available or no git repository');
        }

        return changes;
    }

    // Detect programming language from file extension
    detectLanguage(file) {
        const ext = path.extname(file).toLowerCase();
        const languageMap = {
            '.js': 'JavaScript',
            '.ts': 'TypeScript',
            '.py': 'Python',
            '.java': 'Java',
            '.cs': 'C#',
            '.cpp': 'C++',
            '.c': 'C',
            '.h': 'C/C++',
            '.php': 'PHP',
            '.rb': 'Ruby',
            '.go': 'Go',
            '.rs': 'Rust',
            '.vue': 'Vue.js',
            '.jsx': 'React',
            '.tsx': 'React TypeScript'
        };
        
        return languageMap[ext] || 'Unknown';
    }

    // Find new files that need documentation (generic version)
    async findNewFiles() {
        const newFiles = [];
        
        try {
            // Get all source files in the project
            const { stdout } = await execAsync(`find ${this.projectRoot} -type f -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.java" -o -name "*.cs" | head -100`);
            const sourceFiles = stdout.split('\n').filter(file => file.trim());

            // Check if files are documented in CLAUDE.md
            if (fs.existsSync(this.claudeMdPath)) {
                const claudeMdContent = fs.readFileSync(this.claudeMdPath, 'utf8');
                
                for (const file of sourceFiles.slice(0, 20)) { // Limit to prevent overwhelming
                    const fileName = path.basename(file);
                    const fileNameWithoutExt = path.basename(file, path.extname(file));
                    
                    if (!claudeMdContent.includes(fileName) && !claudeMdContent.includes(fileNameWithoutExt)) {
                        newFiles.push({
                            type: 'new_source_file',
                            file: path.relative(this.projectRoot, file),
                            status: 'undocumented',
                            language: this.detectLanguage(file)
                        });
                    }
                }
            }
        } catch (error) {
            console.log('📝 Note: Could not scan for new files:', error.message);
        }

        return newFiles;
    }

    // Analyze changes and determine documentation updates needed (generic version)
    async analyzeChanges(changes) {
        const updates = [];

        for (const change of changes) {
            switch (change.type) {
                case 'source_file':
                case 'new_source_file':
                    updates.push(await this.analyzeSourceFileChange(change));
                    break;
                case 'config_file':
                    updates.push(await this.analyzeConfigFileChange(change));
                    break;
                case 'package_file':
                    updates.push(await this.analyzePackageFileChange(change));
                    break;
                case 'test_file':
                    updates.push(await this.analyzeTestFileChange(change));
                    break;
            }
        }

        return updates.filter(update => update !== null);
    }

    // Analyze source file changes (generic version)
    async analyzeSourceFileChange(change) {
        try {
            const filePath = path.join(this.projectRoot, change.file);
            if (!fs.existsSync(filePath)) return null;

            const content = fs.readFileSync(filePath, 'utf8');
            const analysis = this.analyzeSourceCode(content, change.language);

            return {
                section: 'Architecture Overview',
                type: 'source_file_update',
                file: change.file,
                data: {
                    language: change.language,
                    fileName: path.basename(change.file),
                    ...analysis,
                    description: this.generateSourceDescription(change.file, analysis, change.language)
                }
            };
        } catch (error) {
            console.log(`⚠️  Could not analyze source file ${change.file}:`, error.message);
            return null;
        }
    }

    // Generic source code analysis
    analyzeSourceCode(content, language) {
        const analysis = {
            functions: [],
            classes: [],
            imports: [],
            exports: [],
            complexity: 'low'
        };

        // Language-specific analysis patterns
        switch (language) {
            case 'JavaScript':
            case 'TypeScript':
                analysis.functions = this.extractJSFunctions(content);
                analysis.classes = this.extractJSClasses(content);
                analysis.imports = this.extractJSImports(content);
                break;
            case 'Python':
                analysis.functions = this.extractPythonFunctions(content);
                analysis.classes = this.extractPythonClasses(content);
                analysis.imports = this.extractPythonImports(content);
                break;
            case 'C#':
                analysis.functions = this.extractCSharpMethods(content);
                analysis.classes = this.extractCSharpClasses(content);
                analysis.imports = this.extractCSharpUsings(content);
                break;
            // Add more languages as needed
        }

        // Estimate complexity based on content
        const lines = content.split('\n').length;
        if (lines > 200) analysis.complexity = 'high';
        else if (lines > 50) analysis.complexity = 'medium';

        return analysis;
    }

    // Extract JavaScript/TypeScript functions
    extractJSFunctions(content) {
        const functions = [];
        const patterns = [
            /function\s+(\w+)\s*\(/g,
            /const\s+(\w+)\s*=\s*\(/g,
            /(\w+)\s*:\s*function\s*\(/g,
            /(\w+)\s*=>\s*/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                functions.push(match[1]);
            }
        });

        return functions;
    }

    // Extract JavaScript/TypeScript classes
    extractJSClasses(content) {
        const classes = [];
        const classRegex = /class\s+(\w+)/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            classes.push(match[1]);
        }
        return classes;
    }

    // Extract JavaScript/TypeScript imports
    extractJSImports(content) {
        const imports = [];
        const importRegex = /import.*from\s+['"`]([^'"`]+)['"`]/g;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            imports.push(match[1]);
        }
        return imports;
    }

    // Extract Python functions
    extractPythonFunctions(content) {
        const functions = [];
        const functionRegex = /def\s+(\w+)\s*\(/g;
        let match;
        while ((match = functionRegex.exec(content)) !== null) {
            functions.push(match[1]);
        }
        return functions;
    }

    // Extract Python classes
    extractPythonClasses(content) {
        const classes = [];
        const classRegex = /class\s+(\w+)/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            classes.push(match[1]);
        }
        return classes;
    }

    // Extract Python imports
    extractPythonImports(content) {
        const imports = [];
        const patterns = [
            /import\s+(\w+)/g,
            /from\s+(\w+)\s+import/g
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                imports.push(match[1]);
            }
        });

        return imports;
    }

    // Extract C# methods
    extractCSharpMethods(content) {
        const methods = [];
        const methodRegex = /public\s+\w+\s+(\w+)\s*\(/g;
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push(match[1]);
        }
        return methods;
    }

    // Extract C# classes
    extractCSharpClasses(content) {
        const classes = [];
        const classRegex = /public class\s+(\w+)/g;
        let match;
        while ((match = classRegex.exec(content)) !== null) {
            classes.push(match[1]);
        }
        return classes;
    }

    // Extract C# usings
    extractCSharpUsings(content) {
        const usings = [];
        const usingRegex = /using\s+([^;]+);/g;
        let match;
        while ((match = usingRegex.exec(content)) !== null) {
            usings.push(match[1]);
        }
        return usings;
    }

    // Generate source file description
    generateSourceDescription(filePath, analysis, language) {
        const fileName = path.basename(filePath, path.extname(filePath));
        const classCount = analysis.classes.length;
        const functionCount = analysis.functions.length;

        let description = `${language} source file`;
        
        if (classCount > 0) {
            description += ` with ${classCount} class${classCount > 1 ? 'es' : ''}`;
        }
        
        if (functionCount > 0) {
            description += ` and ${functionCount} function${functionCount > 1 ? 's' : ''}`;
        }

        // Add complexity indicator
        description += ` (${analysis.complexity} complexity)`;

        return description;
    }

    // Analyze config file changes
    async analyzeConfigFileChange(change) {
        return {
            section: 'Development Setup',
            type: 'config_update',
            file: change.file,
            data: {
                configType: this.getConfigType(change.file),
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        };
    }

    // Analyze package file changes
    async analyzePackageFileChange(change) {
        try {
            const filePath = path.join(this.projectRoot, change.file);
            if (!fs.existsSync(filePath)) return null;

            const content = fs.readFileSync(filePath, 'utf8');
            let dependencies = [];
            let devDependencies = [];

            // Parse different package file formats
            if (change.file.includes('package.json')) {
                const packageData = JSON.parse(content);
                dependencies = Object.keys(packageData.dependencies || {});
                devDependencies = Object.keys(packageData.devDependencies || {});
            } else if (change.file.includes('requirements.txt')) {
                dependencies = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
            }

            return {
                section: 'Development Setup',
                type: 'dependencies_update',
                file: change.file,
                data: {
                    dependencies,
                    devDependencies,
                    lastUpdated: new Date().toISOString().split('T')[0]
                }
            };
        } catch (error) {
            console.log(`⚠️  Could not analyze package file ${change.file}:`, error.message);
            return null;
        }
    }

    // Analyze test file changes
    async analyzeTestFileChange(change) {
        return {
            section: 'Testing Strategy',
            type: 'test_update',
            file: change.file,
            data: {
                testType: this.getTestType(change.file),
                lastUpdated: new Date().toISOString().split('T')[0]
            }
        };
    }

    // Get configuration file type
    getConfigType(filePath) {
        const fileName = path.basename(filePath);
        if (fileName.includes('package.json')) return 'NPM Package Configuration';
        if (fileName.includes('tsconfig')) return 'TypeScript Configuration';
        if (fileName.includes('webpack')) return 'Webpack Configuration';
        if (fileName.includes('requirements.txt')) return 'Python Dependencies';
        if (fileName.includes('.env')) return 'Environment Variables';
        return 'Configuration File';
    }

    // Get test file type
    getTestType(filePath) {
        if (filePath.includes('.spec.')) return 'Specification Test';
        if (filePath.includes('.test.')) return 'Unit Test';
        if (filePath.includes('e2e')) return 'End-to-End Test';
        if (filePath.includes('integration')) return 'Integration Test';
        return 'Test File';
    }

    // Apply updates to documentation (reuse from original with modifications)
    async applyUpdates(updates) {
        if (updates.length === 0) {
            console.log('📝 No documentation updates needed');
            return;
        }

        console.log(`📝 Applying ${updates.length} documentation update(s)...\n`);

        for (const update of updates) {
            await this.applyUpdate(update);
        }
    }

    // Apply a single update to CLAUDE.md (generic version)
    async applyUpdate(update) {
        try {
            if (!fs.existsSync(this.claudeMdPath)) {
                console.log('⚠️  CLAUDE.md not found - creating basic structure');
                await this.createBasicClaudeMd();
            }

            let claudeMdContent = fs.readFileSync(this.claudeMdPath, 'utf8');
            
            // Find the section to update
            const sectionRegex = new RegExp(`## ${update.section}`, 'i');
            const match = claudeMdContent.match(sectionRegex);
            
            if (!match) {
                console.log(`⚠️  Section "${update.section}" not found in CLAUDE.md`);
                return;
            }

            // Generate update content based on type
            const updateContent = this.generateUpdateContent(update);
            
            if (updateContent) {
                // Find next section or end of file
                const sectionStart = match.index + match[0].length;
                const nextSectionMatch = claudeMdContent.substring(sectionStart).match(/\n## /);
                const sectionEnd = nextSectionMatch ? 
                    sectionStart + nextSectionMatch.index : 
                    claudeMdContent.length;

                // Extract current section content
                const currentSection = claudeMdContent.substring(sectionStart, sectionEnd);
                
                // Insert or update content
                const updatedSection = this.mergeContent(currentSection, updateContent, update.type);
                
                // Reconstruct CLAUDE.md
                claudeMdContent = 
                    claudeMdContent.substring(0, sectionStart) + 
                    updatedSection + 
                    claudeMdContent.substring(sectionEnd);

                fs.writeFileSync(this.claudeMdPath, claudeMdContent, 'utf8');
                console.log(`✅ Updated section: ${update.section}`);
            }

        } catch (error) {
            console.log(`❌ Failed to update section "${update.section}":`, error.message);
        }
    }

    // Create basic CLAUDE.md structure if it doesn't exist
    async createBasicClaudeMd() {
        const basicStructure = `# CLAUDE.md - Project Documentation

## Project Overview

This project uses the SuperClaude Auto-Documentation Framework.

## Architecture Overview

## Development Setup

## System Status

## SuperClaude Integration Status

Auto-documentation framework active.
`;
        
        fs.writeFileSync(this.claudeMdPath, basicStructure, 'utf8');
        console.log('📝 Created basic CLAUDE.md structure');
    }

    // Generate content for updates (adapted for generic use)
    generateUpdateContent(update) {
        switch (update.type) {
            case 'source_file_update':
                return this.generateSourceFileContent(update.data);
            case 'config_update':
                return this.generateConfigContent(update.data);
            case 'dependencies_update':
                return this.generateDependenciesContent(update.data);
            case 'test_update':
                return this.generateTestContent(update.data);
            default:
                return null;
        }
    }

    // Generate source file documentation content
    generateSourceFileContent(data) {
        let content = `\n\n**${data.fileName}**: ${data.description}`;
        
        if (data.classes.length > 0) {
            content += `\n  - Classes: ${data.classes.join(', ')}`;
        }
        
        if (data.functions.length > 3) {
            content += `\n  - Functions: ${data.functions.slice(0, 3).join(', ')}...`;
        } else if (data.functions.length > 0) {
            content += `\n  - Functions: ${data.functions.join(', ')}`;
        }
        
        return content;
    }

    // Generate config content
    generateConfigContent(data) {
        return `\n\n**${data.configType}** (Updated: ${data.lastUpdated})`;
    }

    // Generate dependencies content
    generateDependenciesContent(data) {
        return `\n\n**Dependencies** (Updated: ${data.lastUpdated}):\n- **Runtime**: ${data.dependencies.length} packages\n- **Development**: ${data.devDependencies.length} packages`;
    }

    // Generate test content
    generateTestContent(data) {
        return `\n\n**${data.testType}** (Updated: ${data.lastUpdated})`;
    }

    // Merge new content with existing content
    mergeContent(currentContent, newContent, updateType) {
        // Simple append for now - can be made more sophisticated
        if (currentContent.includes(newContent.trim())) {
            return currentContent; // Content already exists
        }
        
        return currentContent + newContent;
    }

    // Backup documentation (reuse from original)
    async backupDocumentation() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const backupDir = path.join(this.projectRoot, '.doc-backups', timestamp);
        
        try {
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            // Backup CLAUDE.md
            if (fs.existsSync(this.claudeMdPath)) {
                fs.copyFileSync(this.claudeMdPath, path.join(backupDir, 'CLAUDE.md'));
            }

            console.log(`💾 Documentation backed up to: ${backupDir}\n`);
        } catch (error) {
            console.log('⚠️  Backup failed:', error.message);
        }
    }

    // Validate documentation (simplified)
    async validateDocumentation() {
        try {
            // Basic validation - check if CLAUDE.md is valid markdown
            const content = fs.readFileSync(this.claudeMdPath, 'utf8');
            
            // Check for common issues
            const issues = [];
            
            if (content.length < 500) {
                issues.push('Documentation appears to be too short');
            }
            
            if (!content.includes('## Project Overview')) {
                issues.push('Missing required section: Project Overview');
            }

            if (issues.length > 0) {
                console.log('⚠️  Validation issues found:');
                issues.forEach(issue => console.log(`  - ${issue}`));
                return { success: false, issues };
            }

            console.log('✅ Documentation validation passed\n');
            return { success: true, issues: [] };

        } catch (error) {
            console.log('❌ Validation failed:', error.message);
            return { success: false, issues: [error.message] };
        }
    }

    // Rollback changes (placeholder)
    async rollbackChanges() {
        console.log('🔄 Rolling back documentation changes...');
        console.log('⚠️  Rollback functionality not implemented yet');
    }

    // Commit changes
    async commitChanges(updates) {
        try {
            const message = `Auto-update documentation: ${updates.length} changes applied (${this.projectConfig.projectType})`;
            await execAsync(`git add CLAUDE.md && git commit -m "${message}"`);
            console.log(`✅ Changes committed: ${message}`);
        } catch (error) {
            console.log('⚠️  Auto-commit failed:', error.message);
        }
    }
}

module.exports = UniversalAutoDocumentationSystem;