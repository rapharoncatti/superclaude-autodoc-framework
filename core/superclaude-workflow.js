#!/usr/bin/env node

/**
 * SuperClaude Unified Development Workflow
 * Implements complete development lifecycle with persona coordination
 */

const fs = require('fs');
const path = require('path');

class SuperClaudeWorkflow {
    constructor(session) {
        this.session = session;
        this.workflows = this.initializeWorkflows();
        this.currentWorkflow = null;
        this.workflowHistory = [];
        
        console.log('🔄 SuperClaude Unified Development Workflow initialized');
    }

    // Initialize predefined workflows
    initializeWorkflows() {
        return {
            // Complete feature development
            'feature-development': {
                name: 'Feature Development',
                description: 'End-to-end feature implementation',
                phases: [
                    { command: 'plan', args: [], flags: ['--feature'], persona: 'architect' },
                    { command: 'design', args: [], flags: ['--api'], persona: 'architect' },
                    { command: 'build', args: [], flags: ['--tdd'], persona: 'frontend' },
                    { command: 'test', args: [], flags: ['--coverage', '--unit'], persona: 'qa' },
                    { command: 'review', args: [], flags: ['--code'], persona: 'qa' },
                    { command: 'secure', args: [], flags: ['--audit'], persona: 'security' },
                    { command: 'optimize', args: [], flags: ['--speed'], persona: 'performance' },
                    { command: 'document', args: [], flags: ['--api'], persona: 'mentor' }
                ]
            },

            // Bug investigation and fix
            'bug-fix': {
                name: 'Bug Investigation & Fix',
                description: 'Systematic debugging and resolution',
                phases: [
                    { command: 'analyze', args: [], flags: ['--dependencies'], persona: 'analyzer' },
                    { command: 'debug', args: [], flags: ['--systematic', '--logs'], persona: 'analyzer' },
                    { command: 'test', args: [], flags: ['--unit'], persona: 'qa' },
                    { command: 'refactor', args: [], flags: ['--clean'], persona: 'refactorer' },
                    { command: 'review', args: [], flags: ['--code'], persona: 'qa' },
                    { command: 'document', args: [], flags: ['--fix'], persona: 'mentor' }
                ]
            },

            // Security audit and hardening
            'security-audit': {
                name: 'Security Audit & Hardening',
                description: 'Comprehensive security assessment',
                phases: [
                    { command: 'analyze', args: [], flags: ['--security'], persona: 'security' },
                    { command: 'secure', args: [], flags: ['--audit', '--vulnerabilities'], persona: 'security' },
                    { command: 'test', args: [], flags: ['--integration'], persona: 'qa' },
                    { command: 'review', args: [], flags: ['--security'], persona: 'security' },
                    { command: 'document', args: [], flags: ['--security'], persona: 'mentor' }
                ]
            },

            // Performance optimization
            'performance-optimization': {
                name: 'Performance Optimization',
                description: 'Comprehensive performance improvement',
                phases: [
                    { command: 'analyze', args: [], flags: ['--performance'], persona: 'performance' },
                    { command: 'optimize', args: [], flags: ['--memory', '--speed'], persona: 'performance' },
                    { command: 'test', args: [], flags: ['--performance'], persona: 'qa' },
                    { command: 'monitor', args: [], flags: ['--metrics'], persona: 'performance' },
                    { command: 'document', args: [], flags: ['--performance'], persona: 'mentor' }
                ]
            },

            // Production deployment
            'production-deployment': {
                name: 'Production Deployment',
                description: 'Safe production deployment workflow',
                phases: [
                    { command: 'test', args: [], flags: ['--e2e', '--coverage'], persona: 'qa' },
                    { command: 'secure', args: [], flags: ['--compliance'], persona: 'security' },
                    { command: 'backup', args: [], flags: ['--full'], persona: 'architect' },
                    { command: 'deploy', args: [], flags: ['--production', '--plan'], persona: 'architect' },
                    { command: 'monitor', args: [], flags: ['--alerts'], persona: 'performance' },
                    { command: 'document', args: [], flags: ['--deployment'], persona: 'mentor' }
                ]
            },

            // Code refactoring
            'refactoring': {
                name: 'Code Refactoring',
                description: 'Systematic code improvement',
                phases: [
                    { command: 'analyze', args: [], flags: ['--dependencies'], persona: 'analyzer' },
                    { command: 'refactor', args: [], flags: ['--patterns', '--debt'], persona: 'refactorer' },
                    { command: 'test', args: [], flags: ['--coverage'], persona: 'qa' },
                    { command: 'review', args: [], flags: ['--architecture'], persona: 'architect' },
                    { command: 'document', args: [], flags: ['--refactoring'], persona: 'mentor' }
                ]
            }
        };
    }

    // Execute complete workflow
    async executeWorkflow(workflowName, args = [], flags = []) {
        const workflow = this.workflows[workflowName];
        if (!workflow) {
            throw new Error(`Unknown workflow: ${workflowName}`);
        }

        console.log(`\n🔄 Starting workflow: ${workflow.name}`);
        console.log(`📋 Description: ${workflow.description}`);
        console.log(`📊 Phases: ${workflow.phases.length}`);

        this.currentWorkflow = {
            name: workflowName,
            workflow,
            startTime: Date.now(),
            phases: [],
            currentPhase: 0,
            args,
            flags
        };

        const results = [];

        try {
            for (let i = 0; i < workflow.phases.length; i++) {
                const phase = workflow.phases[i];
                console.log(`\n📍 Phase ${i + 1}/${workflow.phases.length}: ${phase.command}`);
                console.log(`🎭 Persona: ${phase.persona}`);

                this.currentWorkflow.currentPhase = i;

                // Merge workflow args/flags with phase-specific ones
                const phaseArgs = [...args, ...phase.args];
                const phaseFlags = [...flags, ...phase.flags];

                // Execute command
                const startTime = Date.now();
                const result = await this.session.executeCommand(phase.command, phaseArgs, phaseFlags);
                const duration = Date.now() - startTime;

                const phaseResult = {
                    phase: i + 1,
                    command: phase.command,
                    persona: result.persona || phase.persona,
                    args: phaseArgs,
                    flags: phaseFlags,
                    duration,
                    result,
                    success: !result.error
                };

                results.push(phaseResult);
                this.currentWorkflow.phases.push(phaseResult);

                console.log(`✅ Phase ${i + 1} completed in ${duration}ms`);

                // Stop workflow if phase failed
                if (result.error) {
                    console.log(`❌ Workflow stopped due to error in phase ${i + 1}`);
                    break;
                }
            }

            const workflowDuration = Date.now() - this.currentWorkflow.startTime;
            const success = results.every(r => r.success);

            const workflowResult = {
                workflow: workflowName,
                name: workflow.name,
                description: workflow.description,
                duration: workflowDuration,
                phases: results,
                success,
                completedPhases: results.length,
                totalPhases: workflow.phases.length,
                timestamp: new Date().toISOString()
            };

            // Record workflow completion
            this.workflowHistory.push(workflowResult);
            this.currentWorkflow = null;

            console.log(`\n🎯 Workflow "${workflow.name}" completed!`);
            console.log(`⏱️  Total duration: ${workflowDuration}ms`);
            console.log(`📊 Phases completed: ${results.length}/${workflow.phases.length}`);
            console.log(`✅ Success: ${success ? 'YES' : 'NO'}`);

            return workflowResult;

        } catch (error) {
            console.log(`❌ Workflow failed: ${error.message}`);
            this.currentWorkflow = null;
            throw error;
        }
    }

    // Get available workflows
    getWorkflows() {
        return Object.keys(this.workflows).map(name => ({
            name,
            title: this.workflows[name].name,
            description: this.workflows[name].description,
            phases: this.workflows[name].phases.length,
            commands: this.workflows[name].phases.map(p => p.command)
        }));
    }

    // Get workflow status
    getWorkflowStatus() {
        if (!this.currentWorkflow) {
            return {
                active: false,
                totalWorkflows: this.workflowHistory.length
            };
        }

        return {
            active: true,
            workflow: this.currentWorkflow.name,
            currentPhase: this.currentWorkflow.currentPhase + 1,
            totalPhases: this.currentWorkflow.workflow.phases.length,
            progress: ((this.currentWorkflow.currentPhase + 1) / this.currentWorkflow.workflow.phases.length * 100).toFixed(1),
            duration: Date.now() - this.currentWorkflow.startTime,
            phases: this.currentWorkflow.phases
        };
    }

    // Get workflow history
    getWorkflowHistory(limit = 10) {
        return this.workflowHistory.slice(-limit).map(w => ({
            workflow: w.workflow,
            name: w.name,
            duration: w.duration,
            success: w.success,
            phases: w.completedPhases + '/' + w.totalPhases,
            timestamp: w.timestamp
        }));
    }

    // Smart workflow recommendation
    async recommendWorkflow(context) {
        console.log(`🤔 Analyzing context for workflow recommendation...`);
        
        const contextLower = context.toLowerCase();
        const recommendations = [];

        // Keyword-based recommendations
        if (contextLower.includes('bug') || contextLower.includes('error') || contextLower.includes('issue')) {
            recommendations.push({
                workflow: 'bug-fix',
                confidence: 0.9,
                reason: 'Bug/error keywords detected'
            });
        }

        if (contextLower.includes('security') || contextLower.includes('vulnerability') || contextLower.includes('auth')) {
            recommendations.push({
                workflow: 'security-audit',
                confidence: 0.8,
                reason: 'Security-related keywords detected'
            });
        }

        if (contextLower.includes('performance') || contextLower.includes('slow') || contextLower.includes('optimize')) {
            recommendations.push({
                workflow: 'performance-optimization',
                confidence: 0.8,
                reason: 'Performance-related keywords detected'
            });
        }

        if (contextLower.includes('feature') || contextLower.includes('implement') || contextLower.includes('develop')) {
            recommendations.push({
                workflow: 'feature-development',
                confidence: 0.7,
                reason: 'Feature development keywords detected'
            });
        }

        if (contextLower.includes('deploy') || contextLower.includes('production') || contextLower.includes('release')) {
            recommendations.push({
                workflow: 'production-deployment',
                confidence: 0.9,
                reason: 'Deployment keywords detected'
            });
        }

        if (contextLower.includes('refactor') || contextLower.includes('clean') || contextLower.includes('improve')) {
            recommendations.push({
                workflow: 'refactoring',
                confidence: 0.7,
                reason: 'Refactoring keywords detected'
            });
        }

        // Sort by confidence
        recommendations.sort((a, b) => b.confidence - a.confidence);

        if (recommendations.length === 0) {
            recommendations.push({
                workflow: 'feature-development',
                confidence: 0.5,
                reason: 'Default workflow for general development'
            });
        }

        console.log(`💡 Recommended workflow: ${recommendations[0].workflow} (${(recommendations[0].confidence * 100).toFixed(0)}% confidence)`);
        console.log(`🎯 Reason: ${recommendations[0].reason}`);

        return recommendations;
    }

    // Export workflow results
    async exportWorkflowReport(format = 'json') {
        const report = {
            summary: {
                totalWorkflows: this.workflowHistory.length,
                successRate: this.workflowHistory.length > 0 ? 
                    (this.workflowHistory.filter(w => w.success).length / this.workflowHistory.length * 100).toFixed(1) + '%' : '0%',
                averageDuration: this.workflowHistory.length > 0 ?
                    Math.round(this.workflowHistory.reduce((sum, w) => sum + w.duration, 0) / this.workflowHistory.length) + 'ms' : '0ms'
            },
            workflows: this.workflowHistory,
            timestamp: new Date().toISOString()
        };

        const filename = `superclaude-workflow-report-${Date.now()}.${format}`;
        const filepath = path.join(__dirname, '../reports', filename);

        // Create reports directory if it doesn't exist
        const reportsDir = path.dirname(filepath);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        if (format === 'json') {
            fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
        } else if (format === 'md') {
            const markdown = this.generateMarkdownReport(report);
            fs.writeFileSync(filepath.replace('.md', '.md'), markdown);
        }

        console.log(`📄 Workflow report exported: ${filepath}`);
        return filepath;
    }

    // Generate markdown report
    generateMarkdownReport(report) {
        let md = `# SuperClaude Workflow Report\n\n`;
        md += `Generated: ${report.timestamp}\n\n`;
        md += `## Summary\n\n`;
        md += `- Total Workflows: ${report.summary.totalWorkflows}\n`;
        md += `- Success Rate: ${report.summary.successRate}\n`;
        md += `- Average Duration: ${report.summary.averageDuration}\n\n`;
        
        md += `## Workflow History\n\n`;
        report.workflows.forEach((workflow, i) => {
            md += `### ${i + 1}. ${workflow.name}\n\n`;
            md += `- **Workflow**: ${workflow.workflow}\n`;
            md += `- **Duration**: ${workflow.duration}ms\n`;
            md += `- **Success**: ${workflow.success ? '✅' : '❌'}\n`;
            md += `- **Phases**: ${workflow.phases.length}\n`;
            md += `- **Timestamp**: ${workflow.timestamp}\n\n`;
        });

        return md;
    }
}

module.exports = SuperClaudeWorkflow;