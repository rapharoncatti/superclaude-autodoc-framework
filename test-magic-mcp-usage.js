#!/usr/bin/env node

/**
 * TEST MAGIC MCP SPECIFIC USAGE
 * Verify that Magic MCP is being used for frontend/component building tasks
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function testMagicMCPUsage() {
    console.log('🎯 TESTING MAGIC MCP SPECIFIC USAGE');
    console.log('==================================');
    
    const session = new ActiveSuperClaudeSession();
    await session.initializeSession('testing Magic MCP for component building');
    
    console.log(`✅ Session initialized as ${session.currentPersona} persona`);
    
    // Force frontend persona and test Magic MCP usage
    console.log('\n🎭 Switching to frontend persona for Magic MCP...');
    await session.switchPersona('frontend', 'testing Magic MCP for component development');
    
    console.log(`Frontend MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    // Test request that should use Magic MCP
    console.log('\n🔄 Processing component building request...');
    const componentResult = await session.processRequest('build a React component for user authentication with TypeScript');
    
    console.log(`Request processed by ${componentResult.persona} persona`);
    if (componentResult.mcpResults) {
        console.log('MCP Results:');
        for (const [mcp, mcpResult] of Object.entries(componentResult.mcpResults)) {
            const resultStr = typeof mcpResult === 'object' ? JSON.stringify(mcpResult).substring(0, 100) : mcpResult;
            console.log(`  ${mcp}: ${resultStr}...`);
        }
    }
    
    // Test Magic MCP directly
    console.log('\n⚡ Testing Magic MCP directly...');
    try {
        const magicTools = await session.realMCP.getTools('magic');
        console.log(`Magic tools: ${magicTools.response?.tools?.length || 0} available`);
        
        const magicComponent = await session.realMCP.automateWithMagic('build React component');
        console.log(`Magic automation: ${magicComponent.response ? 'working' : 'attempted'}`);
        
    } catch (error) {
        console.log(`⚠️  Magic MCP direct test error: ${error.message}`);
    }
    
    // Test /build command which should use Magic
    console.log('\n🛠️  Testing /build command with Magic...');
    const buildResult = await session.build(['user-interface'], ['--react']);
    console.log(`Build command: ${buildResult.command} by ${buildResult.persona}`);
    
    // Check MCP statistics
    console.log('\n📊 Final MCP Statistics:');
    const mcpStatus = session.realMCP.getStatus();
    
    for (const [server, info] of Object.entries(mcpStatus)) {
        console.log(`  ${server}: ${info.connected ? '✅ Connected' : '❌ Disconnected'} - ${info.requestCount} requests made`);
        if (server === 'magic') {
            if (info.requestCount > 0) {
                console.log(`    🎉 SUCCESS: Magic MCP actively used!`);
            } else {
                console.log(`    ⚠️  WARNING: Magic MCP still not being used`);
            }
        }
    }
    
    await session.realMCP.shutdown();
    console.log('\n✅ Magic MCP usage test complete!');
    
    process.exit(0);
}

testMagicMCPUsage().catch(error => {
    console.error('❌ Magic MCP test failed:', error.message);
    process.exit(1);
});