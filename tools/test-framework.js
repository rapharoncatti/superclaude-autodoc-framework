#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Test Suite
 * Comprehensive testing for framework functionality
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FrameworkTester {
    constructor() {
        this.testResults = [];
        this.frameworkPath = path.dirname(__dirname);
    }

    // Run a test and record results
    async runTest(testName, testFunction) {
        console.log(`🧪 Testing: ${testName}`);
        
        try {
            const result = await testFunction();
            if (result === true || result === undefined) {
                console.log(`✅ ${testName} - PASSED`);
                this.testResults.push({ name: testName, status: 'PASSED' });
                return true;
            } else {
                console.log(`❌ ${testName} - FAILED: ${result}`);
                this.testResults.push({ name: testName, status: 'FAILED', error: result });
                return false;
            }
        } catch (error) {
            console.log(`❌ ${testName} - ERROR: ${error.message}`);
            this.testResults.push({ name: testName, status: 'ERROR', error: error.message });
            return false;
        }
    }

    // Test framework structure
    testFrameworkStructure() {
        const requiredFiles = [
            'package.json',
            'README.md',
            'LICENSE',
            'core/auto-documentation.js',
            'core/index.js',
            'setup/project-initializer.js',
            'tools/doc-maintenance.js'
        ];

        const requiredDirs = [
            'core',
            'templates',
            'setup', 
            'tools'
        ];

        // Check files
        for (const file of requiredFiles) {
            const filePath = path.join(this.frameworkPath, file);
            if (!fs.existsSync(filePath)) {
                return `Missing required file: ${file}`;
            }
        }

        // Check directories
        for (const dir of requiredDirs) {
            const dirPath = path.join(this.frameworkPath, dir);
            if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
                return `Missing required directory: ${dir}`;
            }
        }

        return true;
    }

    // Test package.json validity
    testPackageJson() {
        try {
            const packagePath = path.join(this.frameworkPath, 'package.json');
            const packageContent = fs.readFileSync(packagePath, 'utf8');
            const packageJson = JSON.parse(packageContent);

            // Check required fields
            const requiredFields = ['name', 'version', 'description', 'main', 'bin'];
            for (const field of requiredFields) {
                if (!packageJson[field]) {
                    return `Missing required package.json field: ${field}`;
                }
            }

            // Check bin commands
            if (!packageJson.bin['superclaude-init'] || !packageJson.bin['superclaude-maintain']) {
                return 'Missing required bin commands in package.json';
            }

            return true;
        } catch (error) {
            return `Invalid package.json: ${error.message}`;
        }
    }

    // Test template configurations
    testTemplateConfigs() {
        const templatesDir = path.join(this.frameworkPath, 'templates');
        const templates = fs.readdirSync(templatesDir);

        for (const template of templates) {
            const templateDir = path.join(templatesDir, template);
            if (!fs.statSync(templateDir).isDirectory()) continue;

            const configPath = path.join(templateDir, 'config.yml');
            if (!fs.existsSync(configPath)) {
                return `Template ${template} missing config.yml`;
            }

            try {
                const yaml = require('js-yaml');
                const configContent = fs.readFileSync(configPath, 'utf8');
                const config = yaml.load(configContent);

                // Check required config fields
                const requiredFields = ['project_type', 'description', 'technologies', 'patterns'];
                for (const field of requiredFields) {
                    if (!config[field]) {
                        return `Template ${template} missing required field: ${field}`;
                    }
                }
            } catch (error) {
                return `Template ${template} invalid config: ${error.message}`;
            }
        }

        return true;
    }

    // Test CLI commands functionality
    testCliCommands() {
        try {
            // Test project initializer
            const initPath = path.join(this.frameworkPath, 'setup/project-initializer.js');
            if (!fs.existsSync(initPath)) {
                return 'Project initializer not found';
            }

            // Test maintenance tool
            const maintPath = path.join(this.frameworkPath, 'tools/doc-maintenance.js');
            if (!fs.existsSync(maintPath)) {
                return 'Maintenance tool not found';
            }

            // Test if files are executable
            const initStats = fs.statSync(initPath);
            const maintStats = fs.statSync(maintPath);
            
            if (!(initStats.mode & parseInt('111', 8))) {
                return 'Project initializer not executable';
            }
            
            if (!(maintStats.mode & parseInt('111', 8))) {
                return 'Maintenance tool not executable';
            }

            return true;
        } catch (error) {
            return `CLI command test failed: ${error.message}`;
        }
    }

    // Test template listing
    testTemplateListing() {
        try {
            const initPath = path.join(this.frameworkPath, 'setup/project-initializer.js');
            const output = execSync(`node "${initPath}" templates`, { 
                encoding: 'utf8',
                cwd: this.frameworkPath
            });

            // Check if output contains expected templates
            const expectedTemplates = ['web-development', 'unity-gamedev', 'backend-api', 'data-science', 'generic'];
            for (const template of expectedTemplates) {
                if (!output.includes(template)) {
                    return `Template listing missing: ${template}`;
                }
            }

            return true;
        } catch (error) {
            return `Template listing failed: ${error.message}`;
        }
    }

    // Test auto-documentation core
    testAutoDocumentationCore() {
        try {
            const autoDocPath = path.join(this.frameworkPath, 'core/auto-documentation.js');
            const AutoDoc = require(autoDocPath);
            
            // Test instantiation
            const autoDoc = new AutoDoc(this.frameworkPath);
            
            if (!autoDoc) {
                return 'Failed to instantiate auto-documentation system';
            }

            // Test basic methods exist
            const requiredMethods = ['run', 'detectChanges', 'validateDocumentation'];
            for (const method of requiredMethods) {
                if (typeof autoDoc[method] !== 'function') {
                    return `Missing required method: ${method}`;
                }
            }

            return true;
        } catch (error) {
            return `Auto-documentation core test failed: ${error.message}`;
        }
    }

    // Test dependencies
    testDependencies() {
        try {
            const packagePath = path.join(this.frameworkPath, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            // Test that all dependencies can be required
            const dependencies = Object.keys(packageJson.dependencies || {});
            for (const dep of dependencies) {
                try {
                    require(dep);
                } catch (error) {
                    return `Failed to require dependency: ${dep}`;
                }
            }

            return true;
        } catch (error) {
            return `Dependency test failed: ${error.message}`;
        }
    }

    // Run all tests
    async runAllTests() {
        console.log('🚀 SuperClaude Auto-Documentation Framework - Test Suite');
        console.log('========================================================\n');

        const tests = [
            ['Framework Structure', () => this.testFrameworkStructure()],
            ['Package.json Validity', () => this.testPackageJson()],
            ['Template Configurations', () => this.testTemplateConfigs()],
            ['CLI Commands', () => this.testCliCommands()],
            ['Template Listing', () => this.testTemplateListing()],
            ['Auto-Documentation Core', () => this.testAutoDocumentationCore()],
            ['Dependencies', () => this.testDependencies()]
        ];

        let passedCount = 0;
        let totalCount = tests.length;

        for (const [testName, testFunction] of tests) {
            const passed = await this.runTest(testName, testFunction);
            if (passed) passedCount++;
            console.log(''); // Empty line for readability
        }

        // Summary
        console.log('📊 Test Results Summary');
        console.log('======================');
        console.log(`Total Tests: ${totalCount}`);
        console.log(`Passed: ${passedCount}`);
        console.log(`Failed: ${totalCount - passedCount}`);
        console.log(`Success Rate: ${Math.round((passedCount / totalCount) * 100)}%\n`);

        if (passedCount === totalCount) {
            console.log('🎉 All tests passed! Framework is ready for publication.');
            process.exit(0);
        } else {
            console.log('❌ Some tests failed. Please fix issues before publishing.');
            
            // Show failed tests
            const failedTests = this.testResults.filter(t => t.status !== 'PASSED');
            if (failedTests.length > 0) {
                console.log('\n🔍 Failed Tests:');
                failedTests.forEach(test => {
                    console.log(`  - ${test.name}: ${test.error || test.status}`);
                });
            }
            
            process.exit(1);
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    const tester = new FrameworkTester();
    tester.runAllTests().catch(console.error);
}

module.exports = FrameworkTester;