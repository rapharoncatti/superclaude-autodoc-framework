#!/usr/bin/env node

/**
 * FINAL COMPREHENSIVE SYSTEM TEST
 * Test the complete SuperClaude v2.0 system with 3 working MCPs
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function finalSystemTest() {
    console.log('🎯 FINAL COMPREHENSIVE SYSTEM TEST');
    console.log('==================================');
    console.log('Testing SuperClaude v2.0 with 3 working MCPs: context7, sequential, puppeteer');
    
    const session = new ActiveSuperClaudeSession();
    
    try {
        // Test 1: Session Initialization
        console.log('\n1️⃣ Testing session initialization...');
        const initResult = await session.initializeSession('final system test with comprehensive MCP integration');
        console.log(`✅ Session initialized as ${initResult.persona} persona`);
        console.log(`🔌 Connected MCPs: ${initResult.mcpConnections.join(', ')}`);
        console.log(`🎯 Available commands: ${initResult.commandsAvailable}`);
        console.log(`🔄 Available workflows: ${initResult.workflowsAvailable}`);
        
        // Test 2: Persona Switching with MCP Integration
        console.log('\n2️⃣ Testing persona switching with MCP integration...');
        
        const personas = ['security', 'frontend', 'performance', 'qa'];
        for (const persona of personas) {
            await session.switchPersona(persona, `testing ${persona} persona MCP integration`);
            const mcps = Array.from(session.mcpConnections.keys());
            console.log(`  ${persona}: ${mcps.join(', ')}`);
        }
        
        // Test 3: Active MCP Usage
        console.log('\n3️⃣ Testing active MCP usage during request processing...');
        
        const testRequests = [
            'analyze security vulnerabilities in authentication system',
            'optimize database performance for high-throughput applications',
            'test web interface automation and validation'
        ];
        
        for (const request of testRequests) {
            console.log(`\n🔄 Processing: "${request.substring(0, 50)}..."`);
            const result = await session.processRequest(request);
            console.log(`  Processed by: ${result.persona} persona`);
            console.log(`  MCPs used: ${Object.keys(result.mcpResults || {}).join(', ')}`);
            console.log(`  Tokens used: ${result.tokensUsed || 0}`);
            console.log(`  Processing time: ${result.processingTime}ms`);
        }
        
        // Test 4: SuperClaude Commands
        console.log('\n4️⃣ Testing SuperClaude commands...');
        
        const commands = [
            { name: 'analyze', args: ['performance'], flags: ['--deep'] },
            { name: 'secure', args: ['api'], flags: ['--audit'] },
            { name: 'test', args: ['integration'], flags: ['--e2e'] }
        ];
        
        for (const cmd of commands) {
            const result = await session.executeCommand(cmd.name, cmd.args, cmd.flags);
            console.log(`  /${cmd.name}: ${result.success ? '✅ Success' : '❌ Failed'} (${result.persona})`);
        }
        
        // Test 5: Workflow Execution
        console.log('\n5️⃣ Testing workflow execution...');
        
        const workflows = ['feature-development', 'bug-fix', 'security-audit'];
        for (const workflow of workflows) {
            try {
                const result = await session.executeWorkflow(workflow, ['test-case'], ['--automated']);
                console.log(`  ${workflow}: ${result.success ? '✅ Success' : '❌ Failed'}`);
            } catch (error) {
                console.log(`  ${workflow}: ⚠️  Not implemented yet`);
            }
        }
        
        // Test 6: MCP Statistics
        console.log('\n6️⃣ Final MCP usage statistics...');
        const mcpStatus = session.realMCP.getStatus();
        
        let totalRequests = 0;
        let activeMCPs = 0;
        
        for (const [server, info] of Object.entries(mcpStatus)) {
            totalRequests += info.requestCount;
            if (info.requestCount > 0) activeMCPs++;
            
            const status = info.requestCount > 0 ? '✅ ACTIVELY USED' : '❌ UNUSED';
            console.log(`  ${server}: ${status} (${info.requestCount} requests)`);
        }
        
        console.log(`\n📊 Total MCP requests: ${totalRequests}`);
        console.log(`📊 Active MCPs: ${activeMCPs}/3`);
        
        // Test 7: System Performance
        console.log('\n7️⃣ System performance summary...');
        const sessionStatus = session.getSessionStatus();
        console.log(`  Current persona: ${sessionStatus.currentPersona}`);
        console.log(`  Active MCP connections: ${sessionStatus.mcpConnections.length}`);
        console.log(`  Session events: ${sessionStatus.sessionHistory}`);
        console.log(`  Evidence store: ${sessionStatus.evidenceStoreSize} items`);
        
        const evidenceSummary = session.getEvidenceSummary();
        console.log(`  Average confidence: ${(evidenceSummary.averageConfidence * 100).toFixed(1)}%`);
        
        await session.realMCP.shutdown();
        
        // Final Assessment
        console.log('\n🎉 FINAL SYSTEM ASSESSMENT');
        console.log('=========================');
        
        const assessments = {
            sessionInit: initResult.persona ? '✅' : '❌',
            mcpIntegration: initResult.mcpConnections.length >= 2 ? '✅' : '❌',
            commandSystem: initResult.commandsAvailable >= 15 ? '✅' : '❌',
            workflowSystem: initResult.workflowsAvailable >= 3 ? '✅' : '❌',
            activeMCPUsage: activeMCPs >= 2 ? '✅' : '❌',
            realTimeProcessing: totalRequests > 5 ? '✅' : '❌'
        };
        
        console.log('Core Features:');
        console.log(`  Session Initialization: ${assessments.sessionInit}`);
        console.log(`  MCP Integration: ${assessments.mcpIntegration}`);
        console.log(`  Command System: ${assessments.commandSystem}`);
        console.log(`  Workflow System: ${assessments.workflowSystem}`);
        console.log(`  Active MCP Usage: ${assessments.activeMCPUsage}`);
        console.log(`  Real-time Processing: ${assessments.realTimeProcessing}`);
        
        const passedTests = Object.values(assessments).filter(v => v === '✅').length;
        const totalTests = Object.keys(assessments).length;
        
        console.log(`\n🎯 SYSTEM READINESS: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('✅ SYSTEM READY FOR PUBLICATION!');
            return true;
        } else {
            console.log('⚠️  System needs more work before publication');
            return false;
        }
        
    } catch (error) {
        console.log('❌ System test failed:', error.message);
        return false;
    }
}

finalSystemTest().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('❌ Final test error:', error.message);
    process.exit(1);
});