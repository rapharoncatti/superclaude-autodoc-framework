// Workflow Chaining System - Intelligent /sc: Command Sequences
// Automatically chains SuperClaude commands for complex workflows

const { globalAutoDoc } = require('./enhanced-superclaude-autodoc.js');
const { globalPersonaSystem } = require('./intelligent-persona-system.js');

class WorkflowChainingSystem {
    constructor() {
        this.activeWorkflows = new Map();
        this.workflowHistory = [];
        
        // 6 Complete Workflows that chain /sc: commands
        this.workflows = {
            'feature-development': {
                name: 'Feature Development',
                description: 'End-to-end feature implementation workflow',
                commands: [
                    { command: '/sc:analyze', args: ['requirements'], reason: 'Understand requirements and existing code' },
                    { command: '/sc:design', args: ['architecture'], reason: 'Design system architecture and interfaces' },
                    { command: '/sc:implement', args: ['--with-tests'], reason: 'Implement feature with comprehensive testing' },
                    { command: '/sc:test', args: ['--comprehensive'], reason: 'Run comprehensive test suite' },
                    { command: '/sc:improve', args: ['--quality'], reason: 'Optimize code quality and performance' },
                    { command: '/sc:document', args: ['--user-guide'], reason: 'Create user documentation' }
                ],
                estimatedTime: '2-4 hours',
                personas: ['architect', 'frontend', 'backend', 'qa', 'performance'],
                triggers: ['implement feature', 'build feature', 'new feature', 'feature development']
            },

            'bug-investigation': {
                name: 'Bug Investigation & Fix',
                description: 'Systematic debugging and resolution workflow',
                commands: [
                    { command: '/sc:analyze', args: ['--focus', 'problem'], reason: 'Investigate issue and gather evidence' },
                    { command: '/sc:troubleshoot', args: ['--systematic'], reason: 'Systematic debugging approach' },
                    { command: '/sc:implement', args: ['--type', 'fix'], reason: 'Implement the fix' },
                    { command: '/sc:test', args: ['--regression'], reason: 'Validate fix and prevent regressions' },
                    { command: '/sc:document', args: ['--post-mortem'], reason: 'Document fix and lessons learned' }
                ],
                estimatedTime: '1-3 hours',
                personas: ['analyzer', 'qa', 'frontend', 'backend'],
                triggers: ['fix bug', 'debug', 'investigate issue', 'bug fixing', 'resolve error']
            },

            'security-audit': {
                name: 'Security Audit & Hardening',
                description: 'Comprehensive security assessment and hardening',
                commands: [
                    { command: '/sc:analyze', args: ['--focus', 'security'], reason: 'Security-focused system analysis' },
                    { command: '/sc:troubleshoot', args: ['--security-scan'], reason: 'Identify vulnerabilities and threats' },
                    { command: '/sc:implement', args: ['--type', 'security-fix'], reason: 'Implement security improvements' },
                    { command: '/sc:test', args: ['--security'], reason: 'Security testing and validation' },
                    { command: '/sc:document', args: ['--security-report'], reason: 'Generate security assessment report' }
                ],
                estimatedTime: '3-6 hours',
                personas: ['security', 'analyzer', 'qa'],
                triggers: ['security audit', 'security review', 'vulnerability assessment', 'security hardening']
            },

            'performance-optimization': {
                name: 'Performance Optimization',
                description: 'Comprehensive performance analysis and optimization',
                commands: [
                    { command: '/sc:analyze', args: ['--focus', 'performance'], reason: 'Performance profiling and bottleneck identification' },
                    { command: '/sc:improve', args: ['--performance'], reason: 'Implement performance optimizations' },
                    { command: '/sc:test', args: ['--performance'], reason: 'Performance testing and validation' },
                    { command: '/sc:document', args: ['--performance-report'], reason: 'Document optimization results' }
                ],
                estimatedTime: '2-4 hours',
                personas: ['performance', 'analyzer', 'qa'],
                triggers: ['optimize performance', 'performance tuning', 'speed up', 'performance issues']
            },

            'code-quality': {
                name: 'Code Quality Improvement',
                description: 'Systematic code quality enhancement',
                commands: [
                    { command: '/sc:analyze', args: ['--focus', 'quality'], reason: 'Code quality assessment' },
                    { command: '/sc:improve', args: ['--quality'], reason: 'Code quality improvements' },
                    { command: '/sc:cleanup', args: ['--comprehensive'], reason: 'Code cleanup and refactoring' },
                    { command: '/sc:test', args: ['--quality-gates'], reason: 'Quality validation testing' },
                    { command: '/sc:document', args: ['--quality-report'], reason: 'Quality improvement documentation' }
                ],
                estimatedTime: '1-3 hours',
                personas: ['analyzer', 'qa', 'architect'],
                triggers: ['improve code', 'code quality', 'refactor', 'cleanup code', 'technical debt']
            },

            'deployment-pipeline': {
                name: 'Production Deployment',
                description: 'Safe production deployment workflow',
                commands: [
                    { command: '/sc:analyze', args: ['--deployment-ready'], reason: 'Pre-deployment readiness check' },
                    { command: '/sc:test', args: ['--production-ready'], reason: 'Production readiness testing' },
                    { command: '/sc:build', args: ['--production'], reason: 'Production build creation' },
                    { command: '/sc:deploy', args: ['--safe'], reason: 'Safe deployment execution' },
                    { command: '/sc:test', args: ['--post-deployment'], reason: 'Post-deployment validation' }
                ],
                estimatedTime: '1-2 hours',
                personas: ['qa', 'backend', 'security'],
                triggers: ['deploy to production', 'production deployment', 'go live', 'release deployment']
            }
        };
    }

    // Detect if user input should trigger a workflow
    detectWorkflow(userInput, context = {}) {
        const input = userInput.toLowerCase();
        const detections = [];

        for (const [workflowId, workflow] of Object.entries(this.workflows)) {
            let score = 0;
            let matchedTriggers = [];

            // Check trigger phrases
            for (const trigger of workflow.triggers) {
                if (input.includes(trigger)) {
                    score += 0.8;
                    matchedTriggers.push(trigger);
                }
            }

            // Check for workflow-related keywords
            const workflowKeywords = workflow.commands.flatMap(cmd => 
                cmd.args.filter(arg => !arg.startsWith('--'))
            );
            
            for (const keyword of workflowKeywords) {
                if (input.includes(keyword)) {
                    score += 0.2;
                }
            }

            // Context-based scoring
            if (context.complexity && context.complexity > 0.7) {
                score += 0.3;
            }

            if (score >= 0.8) {
                detections.push({
                    workflowId,
                    workflow: workflow.name,
                    confidence: Math.min(score, 1.0),
                    matchedTriggers,
                    reason: `Detected ${workflow.name} workflow with ${Math.round(score * 100)}% confidence`
                });
            }
        }

        return detections.sort((a, b) => b.confidence - a.confidence);
    }

    // Execute a workflow by chaining /sc: commands
    async executeWorkflow(workflowId, context = {}) {
        const workflow = this.workflows[workflowId];
        if (!workflow) {
            throw new Error(`Unknown workflow: ${workflowId}`);
        }

        const execution = {
            workflowId,
            workflow: workflow.name,
            description: workflow.description,
            startTime: Date.now(),
            commands: [],
            currentStep: 0,
            status: 'running',
            context,
            personas: [],
            mcpCalls: []
        };

        this.activeWorkflows.set(workflowId, execution);

        try {
            console.log(`🔄 Starting workflow: ${workflow.name}`);
            console.log(`📋 Steps: ${workflow.commands.length}`);

            // Execute each command in sequence
            for (let i = 0; i < workflow.commands.length; i++) {
                const step = workflow.commands[i];
                execution.currentStep = i + 1;

                console.log(`\n⚡ Step ${i + 1}/${workflow.commands.length}: ${step.command}`);
                console.log(`💡 Reason: ${step.reason}`);

                // Auto-switch persona based on command
                const personaResult = globalPersonaSystem.autoSwitchPersona(
                    `${step.command} ${step.args.join(' ')}`,
                    { command: step.command, ...context }
                );

                if (personaResult.switched) {
                    execution.personas.push({
                        step: i + 1,
                        switched: true,
                        from: personaResult.from,
                        to: personaResult.to,
                        reason: personaResult.reason
                    });
                }

                // Simulate command execution (in real implementation, this would trigger actual /sc: commands)
                const commandResult = await this.simulateScCommand(step, context);
                
                execution.commands.push({
                    step: i + 1,
                    command: step.command,
                    args: step.args,
                    reason: step.reason,
                    result: commandResult,
                    persona: globalPersonaSystem.currentPersona,
                    timestamp: new Date().toISOString()
                });

                // Collect MCP calls from command
                if (commandResult.mcpCalls) {
                    execution.mcpCalls.push(...commandResult.mcpCalls);
                }

                // Brief pause between steps (simulating processing time)
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            execution.status = 'completed';
            execution.endTime = Date.now();
            execution.duration = execution.endTime - execution.startTime;

            // Move to completed workflows
            this.activeWorkflows.delete(workflowId);
            this.workflowHistory.push(execution);

            // Notify auto-doc system
            globalAutoDoc.interceptSuperClaudeResponse('', {
                workflow: workflowId,
                workflowSteps: execution.commands,
                duration: execution.duration
            });

            console.log(`✅ Workflow completed: ${workflow.name} (${execution.duration}ms)`);
            return execution;

        } catch (error) {
            execution.status = 'failed';
            execution.error = error.message;
            execution.endTime = Date.now();

            this.activeWorkflows.delete(workflowId);
            this.workflowHistory.push(execution);

            console.log(`❌ Workflow failed: ${workflow.name} - ${error.message}`);
            throw error;
        }
    }

    // Simulate /sc: command execution (placeholder for real implementation)
    async simulateScCommand(step, context) {
        const { command, args } = step;
        
        // Determine MCP servers to use based on current persona
        const personaContext = globalPersonaSystem.getPersonaContext();
        const mcpServers = personaContext.mcpPreference || [];

        return {
            command,
            args,
            success: true,
            output: `Executed ${command} with args: ${args.join(', ')}`,
            persona: globalPersonaSystem.currentPersona,
            mcpCalls: mcpServers.map(server => ({
                server,
                action: `${command}-${server}`,
                status: 'success',
                timestamp: new Date().toISOString()
            })),
            evidence: [`Command ${command} executed successfully`],
            timestamp: new Date().toISOString()
        };
    }

    // Auto-recommend and execute workflows
    async autoExecuteWorkflow(userInput, context = {}) {
        const detections = this.detectWorkflow(userInput, context);
        
        if (detections.length === 0) {
            return null;
        }

        const topDetection = detections[0];
        
        if (topDetection.confidence >= 0.9) {
            // High confidence - auto-execute
            console.log(`🚀 Auto-executing workflow: ${topDetection.workflow}`);
            return await this.executeWorkflow(topDetection.workflowId, context);
        } else if (topDetection.confidence >= 0.8) {
            // Medium confidence - recommend
            return {
                recommended: true,
                workflow: topDetection,
                message: `Recommend ${topDetection.workflow} workflow (${Math.round(topDetection.confidence * 100)}% confidence)`
            };
        }

        return null;
    }

    // Get workflow status
    getWorkflowStatus() {
        return {
            active: Array.from(this.activeWorkflows.values()),
            completed: this.workflowHistory.filter(w => w.status === 'completed').length,
            failed: this.workflowHistory.filter(w => w.status === 'failed').length,
            totalExecutions: this.workflowHistory.length,
            availableWorkflows: Object.keys(this.workflows)
        };
    }

    // Get workflow recommendations for user input
    getWorkflowRecommendations(userInput, context = {}) {
        const detections = this.detectWorkflow(userInput, context);
        return detections.map(detection => ({
            ...detection,
            workflow: this.workflows[detection.workflowId]
        }));
    }
}

// Global workflow system
const globalWorkflowSystem = new WorkflowChainingSystem();

module.exports = {
    WorkflowChainingSystem,
    globalWorkflowSystem,
    detectWorkflow: (input, context) => globalWorkflowSystem.detectWorkflow(input, context),
    autoExecuteWorkflow: (input, context) => globalWorkflowSystem.autoExecuteWorkflow(input, context),
    getWorkflowRecommendations: (input, context) => globalWorkflowSystem.getWorkflowRecommendations(input, context)
};

// Test if run directly
if (require.main === module) {
    console.log('🔄 Workflow Chaining System Active');
    console.log(`📋 Available workflows: ${Object.keys(globalWorkflowSystem.workflows).length}`);
    
    // Test workflow detection
    const testInputs = [
        'implement a new user authentication feature',
        'debug the payment processing issue',
        'security audit of our API endpoints',
        'optimize the database performance'
    ];
    
    testInputs.forEach(input => {
        const recommendations = globalWorkflowSystem.getWorkflowRecommendations(input);
        console.log(`\nInput: "${input}"`);
        if (recommendations.length > 0) {
            recommendations.forEach(rec => {
                console.log(`  → ${rec.workflow} (${Math.round(rec.confidence * 100)}%): ${rec.reason}`);
            });
        } else {
            console.log('  → No workflow recommendations');
        }
    });
}