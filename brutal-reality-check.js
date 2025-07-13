#!/usr/bin/env node

/**
 * BRUTAL REALITY CHECK - NO BS VERSION
 * Tests every single claim, function, and feature
 * Reports actual reality vs marketing claims
 */

console.log('🔍 BRUTAL REALITY CHECK - NO BS VERSION');
console.log('======================================');

class BrutalRealityChecker {
    constructor() {
        this.results = {
            claims: [],
            functionalityTests: [],
            performanceTests: [],
            integrationTests: [],
            userExperienceTests: []
        };
    }

    async runCompleteCheck() {
        console.log('\n📋 Testing EVERY claim and feature...\n');

        // Test 1: Persona Switching Claims
        await this.testPersonaSwitchingReality();
        
        // Test 2: Command System Reality
        await this.testCommandSystemReality();
        
        // Test 3: Workflow System Reality
        await this.testWorkflowSystemReality();
        
        // Test 4: MCP Integration Reality
        await this.testMCPIntegrationReality();
        
        // Test 5: Performance Claims
        await this.testPerformanceReality();
        
        // Test 6: Auto-Documentation Reality
        await this.testAutoDocumentationReality();
        
        // Test 7: User Override Reality
        await this.testUserOverrideReality();
        
        // Test 8: Error Handling Reality
        await this.testErrorHandlingReality();
        
        // Test 9: Production Readiness Reality
        await this.testProductionReadinessReality();
        
        this.generateBrutalReport();
    }

    async testClaim(claimName, claimDescription, testFunction) {
        console.log(`\n🧪 TESTING CLAIM: ${claimName}`);
        console.log(`📝 Claim: "${claimDescription}"`);
        
        try {
            const startTime = Date.now();
            const result = await testFunction();
            const duration = Date.now() - startTime;
            
            const assessment = {
                claim: claimName,
                description: claimDescription,
                result: result,
                duration: duration,
                verdict: result.passed ? 'VERIFIED' : 'FALSE',
                evidence: result.evidence || 'No evidence provided',
                issues: result.issues || []
            };
            
            console.log(`${result.passed ? '✅' : '❌'} VERDICT: ${assessment.verdict}`);
            if (result.evidence) {
                console.log(`📊 Evidence: ${result.evidence}`);
            }
            if (result.issues && result.issues.length > 0) {
                console.log(`⚠️  Issues found:`);
                result.issues.forEach(issue => console.log(`   • ${issue}`));
            }
            
            this.results.claims.push(assessment);
            return assessment;
            
        } catch (error) {
            const assessment = {
                claim: claimName,
                description: claimDescription,
                result: { passed: false, error: error.message },
                duration: 0,
                verdict: 'FAILED',
                evidence: `Error: ${error.message}`,
                issues: [`Test crashed: ${error.message}`]
            };
            
            console.log(`💥 VERDICT: FAILED - ${error.message}`);
            this.results.claims.push(assessment);
            return assessment;
        }
    }

    async testPersonaSwitchingReality() {
        await this.testClaim(
            'Automatic Persona Switching',
            'System automatically switches personas based on context and commands',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('test context analysis for debugging performance issues');
                
                const initialPersona = session.currentPersona;
                
                // Test context-based switching
                await session.processRequest('I need to debug this performance issue with memory leaks');
                const afterContextSwitch = session.currentPersona;
                
                // Test command-based switching
                await session.executeCommand('secure', ['auth-system'], ['--audit']);
                const afterCommandSwitch = session.currentPersona;
                
                // Test user override
                await session.executeCommand('design', ['api'], ['--security']);
                const afterOverrideSwitch = session.currentPersona;
                
                const contextSwitchWorked = afterContextSwitch !== initialPersona;
                const commandSwitchWorked = afterCommandSwitch !== afterContextSwitch;
                const overrideWorked = afterOverrideSwitch === 'security';
                
                const issues = [];
                if (!contextSwitchWorked) issues.push('Context-based switching failed');
                if (!commandSwitchWorked) issues.push('Command-based switching failed');
                if (!overrideWorked) issues.push('User override switching failed');
                
                return {
                    passed: contextSwitchWorked && commandSwitchWorked && overrideWorked,
                    evidence: `Switches: ${initialPersona} → ${afterContextSwitch} → ${afterCommandSwitch} → ${afterOverrideSwitch}`,
                    issues: issues
                };
            }
        );
    }

    async testCommandSystemReality() {
        await this.testClaim(
            '19 SuperClaude Commands System',
            'All 19 commands from original SuperClaude are implemented and functional',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('test commands');
                
                const commands = session.getAvailableCommands();
                const commandCount = commands.length;
                
                // Test each command category
                const testCommands = ['design', 'build', 'test', 'analyze', 'debug', 'optimize', 'secure', 'refactor'];
                const results = [];
                
                for (const cmd of testCommands) {
                    try {
                        const result = await session.executeCommand(cmd, ['test'], []);
                        results.push({
                            command: cmd,
                            success: !!result && !result.error,
                            persona: result.persona,
                            duration: result.executionTime || 0
                        });
                    } catch (error) {
                        results.push({
                            command: cmd,
                            success: false,
                            error: error.message
                        });
                    }
                }
                
                const successfulCommands = results.filter(r => r.success).length;
                const failedCommands = results.filter(r => !r.success);
                
                const issues = [];
                if (commandCount !== 19) issues.push(`Expected 19 commands, found ${commandCount}`);
                failedCommands.forEach(cmd => issues.push(`Command ${cmd.command} failed: ${cmd.error || 'unknown'}`));
                
                return {
                    passed: commandCount === 19 && successfulCommands === testCommands.length,
                    evidence: `${commandCount} commands available, ${successfulCommands}/${testCommands.length} tested successfully`,
                    issues: issues
                };
            }
        );
    }

    async testWorkflowSystemReality() {
        await this.testClaim(
            'Unified Development Workflows',
            'Multi-phase workflows with automatic persona coordination',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('test workflows');
                
                const workflows = session.getAvailableWorkflows();
                const workflowCount = workflows.length;
                
                // Test a complete workflow
                const workflowResult = await session.executeWorkflow('bug-fix', ['test-bug']);
                
                const issues = [];
                if (workflowCount < 5) issues.push(`Expected multiple workflows, found ${workflowCount}`);
                if (!workflowResult.success) issues.push('Workflow execution failed');
                if (workflowResult.phases.length === 0) issues.push('No workflow phases executed');
                
                // Check persona coordination
                const uniquePersonas = new Set(workflowResult.phases.map(p => p.persona));
                if (uniquePersonas.size < 3) issues.push('Insufficient persona coordination in workflow');
                
                return {
                    passed: workflowCount >= 5 && workflowResult.success && workflowResult.phases.length > 0,
                    evidence: `${workflowCount} workflows, ${workflowResult.phases.length} phases, ${uniquePersonas.size} personas used`,
                    issues: issues
                };
            }
        );
    }

    async testMCPIntegrationReality() {
        await this.testClaim(
            'Real MCP Integration',
            'Context7 and Sequential MCP servers working',
            async () => {
                const RealMCPIntegration = require('./core/real-mcp-integration.js');
                const mcp = new RealMCPIntegration();
                
                let context7Started = false;
                let context7Connected = false;
                let sequentialStarted = false;
                
                const issues = [];
                
                // Test Context7
                try {
                    await mcp.startMCPServer('context7');
                    context7Started = true;
                    
                    const tools = await mcp.getTools('context7');
                    context7Connected = !!tools && !tools.error;
                } catch (error) {
                    issues.push(`Context7 failed: ${error.message}`);
                }
                
                // Test Sequential  
                try {
                    await mcp.startMCPServer('sequential');
                    sequentialStarted = true;
                } catch (error) {
                    issues.push(`Sequential failed: ${error.message}`);
                }
                
                const mcpWorking = context7Started && sequentialStarted;
                
                return {
                    passed: mcpWorking,
                    evidence: `Context7: ${context7Started ? 'started' : 'failed'}, Sequential: ${sequentialStarted ? 'started' : 'failed'}`,
                    issues: issues
                };
            }
        );
    }

    async testPerformanceReality() {
        await this.testClaim(
            'Fast Performance',
            'System initialization and execution is fast (under 5 seconds)',
            async () => {
                const startTime = Date.now();
                
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                
                const initStart = Date.now();
                await session.initializeSession('performance test');
                const initTime = Date.now() - initStart;
                
                const cmdStart = Date.now();
                await session.executeCommand('analyze', ['performance']);
                const cmdTime = Date.now() - cmdStart;
                
                const workflowStart = Date.now();
                await session.executeWorkflow('bug-fix', ['perf-test']);
                const workflowTime = Date.now() - workflowStart;
                
                const totalTime = Date.now() - startTime;
                
                const issues = [];
                if (initTime > 5000) issues.push(`Slow initialization: ${initTime}ms`);
                if (cmdTime > 1000) issues.push(`Slow command execution: ${cmdTime}ms`);
                if (workflowTime > 5000) issues.push(`Slow workflow: ${workflowTime}ms`);
                if (totalTime > 10000) issues.push(`Slow total execution: ${totalTime}ms`);
                
                return {
                    passed: initTime < 5000 && cmdTime < 1000 && workflowTime < 5000,
                    evidence: `Init: ${initTime}ms, Command: ${cmdTime}ms, Workflow: ${workflowTime}ms, Total: ${totalTime}ms`,
                    issues: issues
                };
            }
        );
    }

    async testAutoDocumentationReality() {
        await this.testClaim(
            'Auto-Documentation System',
            'Automatically documents all interactions and maintains evidence',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('documentation test');
                
                // Enable auto-documentation
                session.setAutoDocumentation(true);
                
                // Perform actions that should be documented
                await session.executeCommand('design', ['test-feature']);
                await session.executeCommand('test', ['test-case']);
                
                const evidence = session.getEvidenceSummary();
                const sessionStatus = session.getSessionStatus();
                
                const issues = [];
                if (evidence.totalEvidence === 0) issues.push('No evidence collected');
                if (sessionStatus.evidenceStoreSize === 0) issues.push('Evidence store empty');
                if (!session.autoDocumentationEnabled) issues.push('Auto-documentation not enabled');
                
                return {
                    passed: evidence.totalEvidence > 0 && session.autoDocumentationEnabled,
                    evidence: `${evidence.totalEvidence} evidence items, auto-doc: ${session.autoDocumentationEnabled}`,
                    issues: issues
                };
            }
        );
    }

    async testUserOverrideReality() {
        await this.testClaim(
            'User Override System',
            'Users can override automatic persona selection with flags',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('override test');
                
                // Test command flag override
                await session.executeCommand('design', ['test'], ['--security']);
                const afterCommandOverride = session.currentPersona;
                
                // Test natural language override
                await session.processRequest('analyze this code --performance');
                const afterNaturalOverride = session.currentPersona;
                
                const issues = [];
                if (afterCommandOverride !== 'security') issues.push('Command flag override failed');
                if (afterNaturalOverride !== 'performance') issues.push('Natural language override failed');
                
                return {
                    passed: afterCommandOverride === 'security' && afterNaturalOverride === 'performance',
                    evidence: `Command override: ${afterCommandOverride}, Natural override: ${afterNaturalOverride}`,
                    issues: issues
                };
            }
        );
    }

    async testErrorHandlingReality() {
        await this.testClaim(
            'Error Handling',
            'System gracefully handles errors and provides useful feedback',
            async () => {
                const ActiveSession = require('./core/active-superclaude-session.js');
                const session = new ActiveSession();
                await session.initializeSession('error test');
                
                let errorsHandled = 0;
                const issues = [];
                
                // Test invalid command
                try {
                    await session.executeCommand('nonexistent-command');
                    issues.push('Invalid command not rejected');
                } catch (error) {
                    errorsHandled++;
                }
                
                // Test invalid workflow
                try {
                    await session.executeWorkflow('nonexistent-workflow');
                    issues.push('Invalid workflow not rejected');
                } catch (error) {
                    errorsHandled++;
                }
                
                return {
                    passed: errorsHandled >= 2,
                    evidence: `${errorsHandled} errors properly handled`,
                    issues: issues
                };
            }
        );
    }

    async testProductionReadinessReality() {
        await this.testClaim(
            'Production Ready',
            'System is ready for production use',
            async () => {
                const issues = [];
                
                // Check dependencies
                try {
                    require('./core/active-superclaude-session.js');
                } catch (error) {
                    issues.push(`Core module broken: ${error.message}`);
                }
                
                // Check external dependencies
                const fs = require('fs');
                if (!fs.existsSync('/media/rapharoncatti/Transfer/Repos/clean-superclaude')) {
                    issues.push('Depends on external SuperClaude repo');
                }
                
                // Test session can be created multiple times
                try {
                    const ActiveSession = require('./core/active-superclaude-session.js');
                    const session1 = new ActiveSession();
                    const session2 = new ActiveSession();
                    await session1.initializeSession('test1');
                    await session2.initializeSession('test2');
                } catch (error) {
                    issues.push(`Multiple session creation failed: ${error.message}`);
                }
                
                // Check if process exits cleanly (can't test in same process)
                issues.push('Process may not exit cleanly (requires manual testing)');
                
                return {
                    passed: issues.length <= 1, // Allow the process exit issue
                    evidence: `${issues.length} production readiness issues found`,
                    issues: issues
                };
            }
        );
    }

    generateBrutalReport() {
        console.log('\n\n🎯 BRUTAL REALITY CHECK RESULTS');
        console.log('===============================');
        
        const totalClaims = this.results.claims.length;
        const verifiedClaims = this.results.claims.filter(c => c.verdict === 'VERIFIED').length;
        const falseClaims = this.results.claims.filter(c => c.verdict === 'FALSE').length;
        const failedClaims = this.results.claims.filter(c => c.verdict === 'FAILED').length;
        
        console.log(`\n📊 SUMMARY:`);
        console.log(`   ✅ VERIFIED: ${verifiedClaims}/${totalClaims} claims`);
        console.log(`   ❌ FALSE: ${falseClaims}/${totalClaims} claims`);
        console.log(`   💥 FAILED: ${failedClaims}/${totalClaims} claims`);
        
        const successRate = (verifiedClaims / totalClaims * 100).toFixed(1);
        console.log(`   📈 SUCCESS RATE: ${successRate}%`);
        
        console.log(`\n🔍 DETAILED RESULTS:`);
        this.results.claims.forEach((claim, i) => {
            const icon = claim.verdict === 'VERIFIED' ? '✅' : claim.verdict === 'FALSE' ? '❌' : '💥';
            console.log(`\n${i+1}. ${icon} ${claim.claim}`);
            console.log(`   Claim: "${claim.description}"`);
            console.log(`   Verdict: ${claim.verdict}`);
            console.log(`   Evidence: ${claim.evidence}`);
            if (claim.issues.length > 0) {
                console.log(`   Issues:`);
                claim.issues.forEach(issue => console.log(`     • ${issue}`));
            }
        });
        
        console.log(`\n🎯 BRUTAL HONEST VERDICT:`);
        if (successRate >= 90) {
            console.log('🏆 EXCELLENT: System works as advertised');
        } else if (successRate >= 80) {
            console.log('✅ GOOD: System mostly works with minor issues');
        } else if (successRate >= 60) {
            console.log('⚠️  MIXED: System partially works but has significant issues');
        } else if (successRate >= 40) {
            console.log('❌ POOR: System has major issues, not reliable');
        } else {
            console.log('💥 BROKEN: System fundamentally doesn\'t work');
        }
        
        console.log(`\n💡 REALITY vs MARKETING:`);
        console.log(`Marketing Claims: "Fast, intelligent, production-ready"`);
        console.log(`Actual Reality: See detailed results above`);
        
        // Force exit to prevent hanging
        process.exit(0);
    }
}

// Run the brutal reality check
const checker = new BrutalRealityChecker();
checker.runCompleteCheck().catch(error => {
    console.error('💥 Reality check crashed:', error.message);
    process.exit(1);
});