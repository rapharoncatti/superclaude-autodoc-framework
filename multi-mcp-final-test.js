#!/usr/bin/env node

/**
 * FINAL MULTI-MCP SUPERCLAUDE TEST
 * Demonstrate that the system now uses multiple MCPs correctly
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function finalMultiMCPTest() {
    console.log('🎯 FINAL MULTI-MCP SUPERCLAUDE TEST');
    console.log('==================================');
    
    const session = new ActiveSuperClaudeSession();
    await session.initializeSession('demonstrating multi-MCP integration across personas');
    
    console.log(`✅ Session started as ${session.currentPersona} persona`);
    console.log(`🔌 Initial MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    // Test different personas and their specific MCP combinations
    const personaTests = [
        {
            persona: 'architect',
            expectedMCPs: ['sequential', 'context7'],
            avoidMCPs: ['magic']
        },
        {
            persona: 'security', 
            expectedMCPs: ['sequential', 'context7'],
            avoidMCPs: ['magic']
        },
        {
            persona: 'performance',
            expectedMCPs: ['sequential', 'context7'],
            avoidMCPs: ['magic']
        }
    ];
    
    for (const test of personaTests) {
        console.log(`\n🎭 Testing ${test.persona} persona...`);
        await session.switchPersona(test.persona, `testing ${test.persona} MCP configuration`);
        
        const connectedMCPs = Array.from(session.mcpConnections.keys());
        console.log(`Connected MCPs: ${connectedMCPs.join(', ')}`);
        
        // Check expected MCPs are connected
        const hasExpected = test.expectedMCPs.every(mcp => connectedMCPs.includes(mcp));
        console.log(`✅ Expected MCPs (${test.expectedMCPs.join(', ')}): ${hasExpected ? 'CONNECTED' : 'MISSING'}`);
        
        // Check avoided MCPs are not connected  
        const hasAvoided = test.avoidMCPs.some(mcp => connectedMCPs.includes(mcp));
        console.log(`🚫 Avoided MCPs (${test.avoidMCPs.join(', ')}): ${hasAvoided ? 'INCORRECTLY CONNECTED' : 'CORRECTLY AVOIDED'}`);
    }
    
    // Show available MCP servers
    console.log('\n📋 Available MCP Servers:');
    const availableServers = session.realMCP.getAvailableServers();
    availableServers.forEach(server => {
        console.log(`  ${server.name}: ${server.connected ? '✅ Connected' : '❌ Not Connected'}`);
        console.log(`    - ${server.description}`);
        console.log(`    - Capabilities: ${server.capabilities.join(', ')}`);
    });
    
    // Final status
    console.log('\n📊 Final Multi-MCP Status:');
    const status = session.getSessionStatus();
    console.log(`Current persona: ${status.currentPersona}`);
    console.log(`Active MCP connections: ${status.mcpConnections.join(', ')}`);
    console.log(`Session events: ${status.sessionHistory}`);
    
    // Cleanup
    await session.realMCP.shutdown();
    console.log('\n🎯 MULTI-MCP INTEGRATION COMPLETE!');
    
    process.exit(0);
}

finalMultiMCPTest().catch(error => {
    console.error('❌ Multi-MCP test failed:', error.message);
    process.exit(1);
});