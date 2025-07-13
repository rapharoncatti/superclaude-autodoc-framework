#!/usr/bin/env node

/**
 * Reality Check Validator
 * Prevents false claims and ensures actual functionality before marking tasks complete
 * Forces honest assessment of what actually works vs what's claimed
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class RealityCheckValidator {
    constructor() {
        this.validationLog = [];
        this.failedChecks = [];
        this.passedChecks = [];
        
        console.log('🔍 Reality Check Validator initialized');
        console.log('❌ NO TASK COMPLETION WITHOUT VALIDATION');
    }

    // Main validation entry point
    async validateClaim(claim, evidence = {}) {
        console.log(`\n🔍 REALITY CHECK: "${claim}"`);
        
        const validation = {
            claim,
            timestamp: new Date().toISOString(),
            passed: false,
            evidence: evidence,
            errors: [],
            warnings: [],
            actualResult: null,
            recommendation: 'REJECT'
        };

        try {
            // Perform specific validations based on claim type
            if (claim.toLowerCase().includes('working') || claim.toLowerCase().includes('success')) {
                validation.actualResult = await this.validateWorkingClaim(claim, evidence);
            } else if (claim.toLowerCase().includes('integration')) {
                validation.actualResult = await this.validateIntegrationClaim(claim, evidence);
            } else if (claim.toLowerCase().includes('performance')) {
                validation.actualResult = await this.validatePerformanceClaim(claim, evidence);
            } else if (claim.toLowerCase().includes('dependency') || claim.toLowerCase().includes('install')) {
                validation.actualResult = await this.validateDependencyClaim(claim, evidence);
            } else {
                validation.actualResult = await this.validateGenericClaim(claim, evidence);
            }

            // Determine if validation passed
            validation.passed = validation.errors.length === 0 && validation.actualResult.success;
            validation.recommendation = validation.passed ? 'ACCEPT' : 'REJECT';

        } catch (error) {
            validation.errors.push(`Validation failed: ${error.message}`);
            validation.actualResult = { success: false, error: error.message };
        }

        // Log validation result
        this.logValidation(validation);
        
        // Print results
        this.printValidationResult(validation);
        
        return validation;
    }

    // Validate claims about things "working"
    async validateWorkingClaim(claim, evidence) {
        const result = { success: false, details: [], errors: [] };

        // If claiming something works, we need to actually test it
        if (evidence.filePath) {
            result.details.push(`Testing file: ${evidence.filePath}`);
            
            // Check if file exists
            if (!fs.existsSync(evidence.filePath)) {
                result.errors.push(`File does not exist: ${evidence.filePath}`);
                return result;
            }

            // If it's a JavaScript file, try to run it
            if (evidence.filePath.endsWith('.js')) {
                try {
                    const testResult = await this.runJavaScriptFile(evidence.filePath, evidence.testArgs);
                    result.details.push(`Execution result: ${testResult.success ? 'SUCCESS' : 'FAILED'}`);
                    if (!testResult.success) {
                        result.errors.push(`Execution failed: ${testResult.error}`);
                    } else {
                        result.success = true;
                    }
                } catch (error) {
                    result.errors.push(`Could not test file: ${error.message}`);
                }
            } else {
                // For non-JS files, just check they exist and are readable
                try {
                    fs.readFileSync(evidence.filePath, 'utf8');
                    result.success = true;
                    result.details.push('File exists and is readable');
                } catch (error) {
                    result.errors.push(`File not readable: ${error.message}`);
                }
            }
        } else {
            result.errors.push('No file path provided for testing');
        }

        return result;
    }

    // Validate integration claims
    async validateIntegrationClaim(claim, evidence) {
        const result = { success: false, details: [], errors: [] };

        // Check if integration points actually exist
        if (evidence.sourceSystem && evidence.targetSystem) {
            result.details.push(`Checking integration: ${evidence.sourceSystem} -> ${evidence.targetSystem}`);
            
            // Check if both systems exist
            if (fs.existsSync(evidence.sourceSystem)) {
                result.details.push(`Source system exists: ${evidence.sourceSystem}`);
            } else {
                result.errors.push(`Source system not found: ${evidence.sourceSystem}`);
            }

            if (fs.existsSync(evidence.targetSystem)) {
                result.details.push(`Target system exists: ${evidence.targetSystem}`);
            } else {
                result.errors.push(`Target system not found: ${evidence.targetSystem}`);
            }

            // If bridge file claimed, test it
            if (evidence.bridgeFile) {
                if (fs.existsSync(evidence.bridgeFile)) {
                    const testResult = await this.runJavaScriptFile(evidence.bridgeFile, ['--test']);
                    if (testResult.success) {
                        result.success = true;
                        result.details.push('Bridge file executes successfully');
                    } else {
                        result.errors.push(`Bridge file fails: ${testResult.error}`);
                    }
                } else {
                    result.errors.push(`Bridge file not found: ${evidence.bridgeFile}`);
                }
            }
        } else {
            result.errors.push('Integration claim missing source/target system paths');
        }

        return result;
    }

    // Validate performance claims
    async validatePerformanceClaim(claim, evidence) {
        const result = { success: false, details: [], errors: [] };

        if (evidence.benchmarkFile) {
            result.details.push(`Running performance benchmark: ${evidence.benchmarkFile}`);
            
            if (fs.existsSync(evidence.benchmarkFile)) {
                const testResult = await this.runJavaScriptFile(evidence.benchmarkFile);
                if (testResult.success) {
                    // Parse performance metrics from output
                    const metrics = this.parsePerformanceMetrics(testResult.output);
                    result.details.push(`Performance metrics: ${JSON.stringify(metrics)}`);
                    
                    // Validate claimed improvements
                    if (evidence.claimedImprovement) {
                        const actualImprovement = metrics.improvement || 0;
                        if (actualImprovement >= evidence.claimedImprovement * 0.9) { // Allow 10% tolerance
                            result.success = true;
                            result.details.push(`Performance claim validated: ${actualImprovement}% vs claimed ${evidence.claimedImprovement}%`);
                        } else {
                            result.errors.push(`Performance claim not met: ${actualImprovement}% vs claimed ${evidence.claimedImprovement}%`);
                        }
                    } else {
                        result.success = true; // Just running successfully is enough if no specific claim
                    }
                } else {
                    result.errors.push(`Benchmark failed: ${testResult.error}`);
                }
            } else {
                result.errors.push(`Benchmark file not found: ${evidence.benchmarkFile}`);
            }
        } else {
            result.errors.push('Performance claim missing benchmark file');
        }

        return result;
    }

    // Validate dependency claims
    async validateDependencyClaim(claim, evidence) {
        const result = { success: false, details: [], errors: [] };

        if (evidence.dependency) {
            result.details.push(`Checking dependency: ${evidence.dependency}`);
            
            // Try to require the dependency
            try {
                require(evidence.dependency);
                result.success = true;
                result.details.push(`Dependency available: ${evidence.dependency}`);
            } catch (error) {
                result.errors.push(`Dependency not available: ${evidence.dependency} - ${error.message}`);
                
                // If package.json path provided, check if it's listed there
                if (evidence.packageJsonPath && fs.existsSync(evidence.packageJsonPath)) {
                    const packageJson = JSON.parse(fs.readFileSync(evidence.packageJsonPath, 'utf8'));
                    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                    if (deps[evidence.dependency]) {
                        result.details.push(`Dependency listed in package.json but not installed`);
                    } else {
                        result.errors.push(`Dependency not in package.json`);
                    }
                }
            }
        } else {
            result.errors.push('Dependency claim missing dependency name');
        }

        return result;
    }

    // Validate generic claims
    async validateGenericClaim(claim, evidence) {
        const result = { success: false, details: [], errors: [] };

        // For generic claims, check if evidence files exist
        if (evidence.files && Array.isArray(evidence.files)) {
            let allFilesExist = true;
            
            for (const file of evidence.files) {
                if (fs.existsSync(file)) {
                    result.details.push(`File exists: ${file}`);
                } else {
                    result.errors.push(`File missing: ${file}`);
                    allFilesExist = false;
                }
            }
            
            result.success = allFilesExist;
        } else {
            result.warnings = ['Generic claim with no testable evidence'];
            result.success = false;
        }

        return result;
    }

    // Run JavaScript file and capture result
    async runJavaScriptFile(filePath, args = []) {
        return new Promise((resolve) => {
            const process = spawn('node', [filePath, ...args], {
                cwd: path.dirname(filePath),
                timeout: 30000 // 30 second timeout
            });

            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                resolve({
                    success: code === 0,
                    output,
                    error: error || (code !== 0 ? `Process exited with code ${code}` : ''),
                    exitCode: code
                });
            });

            process.on('error', (err) => {
                resolve({
                    success: false,
                    output,
                    error: err.message,
                    exitCode: -1
                });
            });
        });
    }

    // Parse performance metrics from output
    parsePerformanceMetrics(output) {
        const metrics = {};
        
        // Look for common performance indicators
        const improvementMatch = output.match(/improvement[:\s]+(\d+(?:\.\d+)?)%/i);
        if (improvementMatch) {
            metrics.improvement = parseFloat(improvementMatch[1]);
        }

        const speedMatch = output.match(/speed[:\s]+(\d+(?:\.\d+)?)x/i);
        if (speedMatch) {
            metrics.speedMultiplier = parseFloat(speedMatch[1]);
        }

        const timeMatch = output.match(/time[:\s]+(\d+(?:\.\d+)?)\s*(ms|s)/i);
        if (timeMatch) {
            metrics.executionTime = parseFloat(timeMatch[1]);
            metrics.timeUnit = timeMatch[2];
        }

        return metrics;
    }

    // Log validation for audit trail
    logValidation(validation) {
        this.validationLog.push(validation);
        
        if (validation.passed) {
            this.passedChecks.push(validation.claim);
        } else {
            this.failedChecks.push(validation.claim);
        }
    }

    // Print validation result
    printValidationResult(validation) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🔍 REALITY CHECK RESULT: ${validation.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`📝 Claim: "${validation.claim}"`);
        
        if (validation.actualResult) {
            console.log(`📊 Result: ${validation.actualResult.success ? 'SUCCESS' : 'FAILURE'}`);
            
            if (validation.actualResult.details.length > 0) {
                console.log(`📋 Details:`);
                validation.actualResult.details.forEach(detail => console.log(`   ✓ ${detail}`));
            }
        }

        if (validation.errors.length > 0) {
            console.log(`❌ Errors:`);
            validation.errors.forEach(error => console.log(`   ✗ ${error}`));
        }

        if (validation.warnings.length > 0) {
            console.log(`⚠️  Warnings:`);
            validation.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
        }

        console.log(`🎯 Recommendation: ${validation.recommendation}`);
        console.log(`${'='.repeat(60)}\n`);
    }

    // Get validation summary
    getValidationSummary() {
        return {
            totalValidations: this.validationLog.length,
            passedCount: this.passedChecks.length,
            failedCount: this.failedChecks.length,
            passRate: this.validationLog.length > 0 ? (this.passedChecks.length / this.validationLog.length * 100).toFixed(1) : 0,
            recentValidations: this.validationLog.slice(-5),
            failedClaims: this.failedChecks
        };
    }

    // Force validation before task completion
    async enforceValidationBeforeCompletion(taskDescription, evidence = {}) {
        console.log(`\n🚫 TASK COMPLETION BLOCKED: "${taskDescription}"`);
        console.log(`🔍 Validation required before marking complete`);
        
        const validation = await this.validateClaim(taskDescription, evidence);
        
        if (!validation.passed) {
            console.log(`❌ TASK CANNOT BE MARKED COMPLETE`);
            console.log(`🔧 Fix these issues first:`);
            validation.errors.forEach(error => console.log(`   ❌ ${error}`));
            return false;
        }

        console.log(`✅ VALIDATION PASSED - Task can be marked complete`);
        return true;
    }
}

// CLI interface for manual validation
if (require.main === module) {
    const validator = new RealityCheckValidator();
    
    const claim = process.argv.slice(2).join(' ') || 'test claim';
    
    validator.validateClaim(claim, {
        filePath: process.argv[3],
        testArgs: process.argv.slice(4)
    }).then(result => {
        console.log('\n📊 Validation Summary:');
        console.log(JSON.stringify(validator.getValidationSummary(), null, 2));
    });
}

module.exports = RealityCheckValidator;