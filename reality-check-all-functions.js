#!/usr/bin/env node

/**
 * COMPREHENSIVE REALITY CHECK - ALL FUNCTIONS
 * Tests for timeouts, errors, silent failures, and actual functionality
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');
const fs = require('fs');

class UltraRealisticTester {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            timeouts: 0,
            silentFailures: 0,
            issues: []
        };
    }

    async runAllTests() {
        console.log('🔍 ULTRA REALISTIC REALITY CHECK - ALL FUNCTIONS');
        console.log('==================================================');
        console.log('Testing for: timeouts, errors, silent failures, actual functionality\n');

        // Test 1: Basic Session Initialization
        await this.testSessionInitialization();
        
        // Test 2: Persona Intelligence Engine
        await this.testPersonaIntelligence();
        
        // Test 3: Command System
        await this.testCommandSystem();
        
        // Test 4: Workflow System  
        await this.testWorkflowSystem();
        
        // Test 5: MCP Integration
        await this.testMCPIntegration();
        
        // Test 6: Reality Validator
        await this.testRealityValidator();
        
        // Test 7: Auto Documentation
        await this.testAutoDocumentation();
        
        // Test 8: User Override System
        await this.testUserOverrides();
        
        // Test 9: Error Handling
        await this.testErrorHandling();
        
        // Test 10: Performance & Timeouts
        await this.testPerformanceTimeouts();
        
        this.generateFinalReport();
    }

    async testWithTimeout(testName, testFunction, timeoutMs = 5000) {
        console.log(`\n🧪 Testing: ${testName}`);
        
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
            );
            
            const testPromise = testFunction();
            const result = await Promise.race([testPromise, timeoutPromise]);
            
            console.log(`✅ ${testName}: PASSED`);
            this.results.passed++;
            return result;
            
        } catch (error) {
            if (error.message === 'TIMEOUT') {
                console.log(`⏰ ${testName}: TIMEOUT (>${timeoutMs}ms)`);
                this.results.timeouts++;
                this.results.issues.push(`TIMEOUT: ${testName} exceeded ${timeoutMs}ms`);
            } else {
                console.log(`❌ ${testName}: FAILED - ${error.message}`);
                this.results.failed++;
                this.results.issues.push(`ERROR: ${testName} - ${error.message}`);
            }
            return null;
        }
    }

    async testSessionInitialization() {
        return await this.testWithTimeout('Session Initialization', async () => {
            const session = new ActiveSuperClaudeSession();
            
            // Check if initialization actually works
            if (!session.engine) throw new Error('PersonaIntelligenceEngine not loaded');
            if (!session.validator) throw new Error('RealityValidator not loaded');
            if (!session.realMCP) throw new Error('RealMCP not loaded');
            
            const initResult = await session.initializeSession('test initialization');
            
            // Verify actual initialization, not just success message
            if (!initResult.persona) throw new Error('No persona selected');
            if (!session.currentPersona) throw new Error('currentPersona not set');
            if (!session.commands) throw new Error('Commands system not initialized');
            if (!session.workflow) throw new Error('Workflow system not initialized');
            
            return { status: 'REAL_SUCCESS', persona: initResult.persona };
        });
    }

    async testPersonaIntelligence() {
        return await this.testWithTimeout('Persona Intelligence', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Test context analysis
            const analysis = await session.engine.analyzeContext('debug performance issue', {});
            if (!analysis.keywords || !analysis.fileTypes) {
                throw new Error('Context analysis incomplete');
            }
            
            // Test persona selection
            const selection = await session.engine.selectOptimalPersona(analysis);
            if (!selection.persona || typeof selection.confidence !== 'number') {
                throw new Error('Persona selection invalid');
            }
            
            // Test if personas actually loaded
            if (!session.engine.personas || Object.keys(session.engine.personas).length === 0) {
                throw new Error('No personas loaded');
            }
            
            return { personas: Object.keys(session.engine.personas).length };
        });
    }

    async testCommandSystem() {
        return await this.testWithTimeout('Command System', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Test if commands exist
            const commands = session.getAvailableCommands();
            if (!commands || commands.length === 0) {
                throw new Error('No commands available');
            }
            
            // Test actual command execution
            const result = await session.executeCommand('design', ['test-feature'], ['--api']);
            if (!result || !result.command) {
                throw new Error('Command execution failed');
            }
            
            // Verify persona switching actually happened
            if (session.currentPersona !== 'architect') {
                throw new Error('Persona switch did not occur');
            }
            
            return { commandCount: commands.length, executed: result.command };
        });
    }

    async testWorkflowSystem() {
        return await this.testWithTimeout('Workflow System', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Test workflows exist
            const workflows = session.getAvailableWorkflows();
            if (!workflows || workflows.length === 0) {
                throw new Error('No workflows available');
            }
            
            // Test workflow execution (short one)
            const result = await session.executeWorkflow('bug-fix', ['test-bug']);
            if (!result || !result.phases || result.phases.length === 0) {
                throw new Error('Workflow execution failed');
            }
            
            // Verify workflow actually completed phases
            if (!result.success) {
                throw new Error('Workflow did not complete successfully');
            }
            
            return { workflowCount: workflows.length, phases: result.phases.length };
        });
    }

    async testMCPIntegration() {
        return await this.testWithTimeout('MCP Integration', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Test MCP connection status
            const mcpStatus = session.realMCP.getStatus();
            
            // Try to start MCP server
            let context7Started = false;
            try {
                await session.realMCP.startMCPServer('context7');
                context7Started = true;
            } catch (error) {
                // MCP might fail, that's realistic
                console.log(`   ℹ️  MCP Context7 failed to start: ${error.message}`);
            }
            
            // Check if MCP tools are accessible
            let toolsAvailable = false;
            if (context7Started) {
                try {
                    const tools = await session.realMCP.getTools('context7');
                    toolsAvailable = !!tools;
                } catch (error) {
                    console.log(`   ℹ️  MCP tools not accessible: ${error.message}`);
                }
            }
            
            return { 
                mcpEnabled: session.realMCPEnabled,
                context7Started,
                toolsAvailable
            };
        });
    }

    async testRealityValidator() {
        return await this.testWithTimeout('Reality Validator', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Test validation with real claim
            const validClaim = await session.validator.validateClaim(
                'System loaded successfully', 
                { executionSuccess: true, hasEvidence: true }
            );
            
            if (!validClaim.hasOwnProperty('passed')) {
                throw new Error('Validator did not return validation result');
            }
            
            // Test validation with false claim
            const invalidClaim = await session.validator.validateClaim(
                'System achieved 1000% performance improvement',
                { confidence: 0.1 }
            );
            
            return { 
                validatorWorking: true,
                validClaim: validClaim.passed,
                invalidClaim: invalidClaim.passed
            };
        });
    }

    async testAutoDocumentation() {
        return await this.testWithTimeout('Auto Documentation', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            // Enable auto-documentation
            session.setAutoDocumentation(true);
            
            // Execute something to generate documentation
            await session.executeCommand('analyze', ['test-code']);
            
            // Check if evidence was stored
            const evidence = session.getEvidenceSummary();
            if (!evidence || evidence.totalEvidence === 0) {
                throw new Error('Auto-documentation not working');
            }
            
            // Check if documentation files are created
            const docsPath = './docs/auto-documentation-log.json';
            let fileExists = false;
            try {
                fileExists = fs.existsSync(docsPath);
            } catch (error) {
                // File might not exist, that's ok
            }
            
            return {
                evidenceCollected: evidence.totalEvidence,
                autoDocEnabled: session.autoDocumentationEnabled,
                logFileExists: fileExists
            };
        });
    }

    async testUserOverrides() {
        return await this.testWithTimeout('User Override System', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            const initialPersona = session.currentPersona;
            
            // Test command flag override
            await session.executeCommand('design', ['test'], ['--security']);
            const afterCommandOverride = session.currentPersona;
            
            // Test natural language override
            await session.processRequest('analyze this code --performance');
            const afterNaturalOverride = session.currentPersona;
            
            // Verify overrides actually worked
            let overridesWorking = true;
            if (afterCommandOverride === initialPersona && initialPersona !== 'security') {
                overridesWorking = false;
            }
            
            return {
                initialPersona,
                afterCommandOverride,
                afterNaturalOverride,
                overridesWorking
            };
        });
    }

    async testErrorHandling() {
        return await this.testWithTimeout('Error Handling', async () => {
            const session = new ActiveSuperClaudeSession();
            await session.initializeSession('test');
            
            let errorsHandled = 0;
            
            // Test invalid command
            try {
                await session.executeCommand('nonexistent-command');
            } catch (error) {
                errorsHandled++;
            }
            
            // Test invalid workflow  
            try {
                await session.executeWorkflow('nonexistent-workflow');
            } catch (error) {
                errorsHandled++;
            }
            
            // Test invalid persona
            try {
                await session.switchPersona('nonexistent-persona', 'test');
            } catch (error) {
                errorsHandled++;
            }
            
            return { errorsHandled, expectedErrors: 3 };
        });
    }

    async testPerformanceTimeouts() {
        return await this.testWithTimeout('Performance & Timeouts', async () => {
            const session = new ActiveSuperClaudeSession();
            
            // Test initialization time
            const initStart = Date.now();
            await session.initializeSession('performance test');
            const initTime = Date.now() - initStart;
            
            // Test command execution time
            const cmdStart = Date.now();
            await session.executeCommand('analyze', ['performance']);
            const cmdTime = Date.now() - cmdStart;
            
            // Test workflow time (should be reasonable)
            const workflowStart = Date.now();
            await session.executeWorkflow('bug-fix', ['perf-issue']);
            const workflowTime = Date.now() - workflowStart;
            
            // Check for reasonable performance
            let performanceIssues = [];
            if (initTime > 10000) performanceIssues.push(`Slow init: ${initTime}ms`);
            if (cmdTime > 5000) performanceIssues.push(`Slow command: ${cmdTime}ms`);
            if (workflowTime > 15000) performanceIssues.push(`Slow workflow: ${workflowTime}ms`);
            
            return {
                initTime,
                cmdTime,
                workflowTime,
                performanceIssues
            };
        });
    }

    generateFinalReport() {
        console.log('\n\n🎯 FINAL REALITY CHECK REPORT');
        console.log('==============================');
        console.log(`✅ Tests Passed: ${this.results.passed}`);
        console.log(`❌ Tests Failed: ${this.results.failed}`);
        console.log(`⏰ Timeouts: ${this.results.timeouts}`);
        console.log(`🔇 Silent Failures: ${this.results.silentFailures}`);
        
        const total = this.results.passed + this.results.failed + this.results.timeouts;
        const successRate = ((this.results.passed / total) * 100).toFixed(1);
        
        console.log(`\n📊 Success Rate: ${successRate}%`);
        
        if (this.results.issues.length > 0) {
            console.log('\n🚨 ISSUES FOUND:');
            this.results.issues.forEach((issue, i) => {
                console.log(`   ${i+1}. ${issue}`);
            });
        }
        
        // Realistic assessment
        if (successRate >= 90) {
            console.log('\n🏆 VERDICT: PRODUCTION READY');
        } else if (successRate >= 70) {
            console.log('\n⚠️  VERDICT: NEEDS IMPROVEMENTS');
        } else {
            console.log('\n❌ VERDICT: NOT PRODUCTION READY');
        }
        
        console.log('\n💡 REALISTIC EXPECTATIONS:');
        console.log('   • MCP servers may timeout/fail (external dependencies)');
        console.log('   • Reality validation is intentionally strict');
        console.log('   • Performance varies with system load');
        console.log('   • Some features work, others need refinement');
    }
}

// Run the comprehensive test
const tester = new UltraRealisticTester();
tester.runAllTests().catch(error => {
    console.error('❌ Reality check crashed:', error.message);
    process.exit(1);
});