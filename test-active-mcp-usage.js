#!/usr/bin/env node

/**
 * TEST ACTIVE MCP USAGE
 * Verify that we're actually USING context7, sequential, and magic MCPs
 * Not just connecting to them but actively calling them during operations
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function testActiveMCPUsage() {
    console.log('🎯 TESTING ACTIVE MCP USAGE - 3 CORE MCPs');
    console.log('=========================================');
    
    const session = new ActiveSuperClaudeSession();
    await session.initializeSession('testing active usage of context7, sequential, and magic MCPs');
    
    console.log(`✅ Session initialized as ${session.currentPersona} persona`);
    console.log(`🔌 Connected MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    // Test 1: Security persona with Sequential + Context7
    console.log('\n1️⃣ Testing Security persona - Sequential + Context7 ACTIVE usage');
    await session.switchPersona('security', 'testing security analysis with real MCP calls');
    
    console.log(`Connected MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    // Make a request that should trigger REAL MCP calls
    console.log('🔄 Processing security request with REAL MCP calls...');
    const securityResult = await session.processRequest('analyze this authentication system for security vulnerabilities and threat modeling');
    
    console.log(`Request processed by ${securityResult.persona} persona`);
    console.log('MCP Results (should show REAL calls):');
    for (const [mcp, result] of Object.entries(securityResult.mcpResults || {})) {
        console.log(`  ${mcp}: ${typeof result === 'object' ? JSON.stringify(result).substring(0, 150) : result}...`);
    }
    
    // Test 2: Frontend persona with Magic + Context7
    console.log('\n2️⃣ Testing Frontend persona - Magic + Context7 ACTIVE usage');
    await session.switchPersona('frontend', 'testing frontend development with automation');
    
    console.log(`Connected MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    const frontendResult = await session.processRequest('build a modern React component with automated testing setup');
    
    console.log(`Request processed by ${frontendResult.persona} persona`);
    console.log('MCP Results (should show Magic + Context7 calls):');
    for (const [mcp, result] of Object.entries(frontendResult.mcpResults || {})) {
        console.log(`  ${mcp}: ${typeof result === 'object' ? JSON.stringify(result).substring(0, 150) : result}...`);
    }
    
    // Test 3: Performance persona with Sequential + Context7
    console.log('\n3️⃣ Testing Performance persona - Sequential + Context7 ACTIVE usage');
    await session.switchPersona('performance', 'testing performance optimization analysis');
    
    console.log(`Connected MCPs: ${Array.from(session.mcpConnections.keys()).join(', ')}`);
    
    const perfResult = await session.processRequest('optimize database queries for high-throughput applications');
    
    console.log(`Request processed by ${perfResult.persona} persona`);
    console.log('MCP Results (should show Sequential + Context7 calls):');
    for (const [mcp, result] of Object.entries(perfResult.mcpResults || {})) {
        console.log(`  ${mcp}: ${typeof result === 'object' ? JSON.stringify(result).substring(0, 150) : result}...`);
    }
    
    // Test 4: Commands that should use MCPs
    console.log('\n4️⃣ Testing commands with ACTIVE MCP usage');
    
    console.log('🔍 /analyze command...');
    const analyzeResult = await session.analyze(['performance-bottlenecks'], ['--systematic']);
    console.log(`Analyze by ${analyzeResult.persona} - Success: ${analyzeResult.success}`);
    
    console.log('🔒 /secure command...');
    const secureResult = await session.secure(['authentication'], ['--audit']);
    console.log(`Secure by ${secureResult.persona} - Success: ${secureResult.success}`);
    
    console.log('⚡ /optimize command...');
    const optimizeResult = await session.optimize(['database'], ['--speed']);
    console.log(`Optimize by ${optimizeResult.persona} - Success: ${optimizeResult.success}`);
    
    // Test 5: Check MCP request counts
    console.log('\n5️⃣ Checking MCP request statistics');
    const mcpStatus = session.realMCP.getStatus();
    
    for (const [server, info] of Object.entries(mcpStatus)) {
        console.log(`  ${server}: ${info.connected ? '✅ Connected' : '❌ Disconnected'} - ${info.requestCount} requests made`);
        if (info.requestCount === 0) {
            console.log(`    ⚠️  WARNING: ${server} has 0 requests - not being actively used!`);
        } else {
            console.log(`    ✅ GOOD: ${server} actively used with ${info.requestCount} requests`);
        }
    }
    
    // Test 6: Direct MCP calls to verify they work
    console.log('\n6️⃣ Testing direct MCP calls to verify functionality');
    
    try {
        console.log('📚 Testing Context7 direct call...');
        const context7Result = await session.realMCP.getTools('context7');
        console.log(`Context7 tools: ${context7Result.response?.tools?.length || 0} available`);
        
        console.log('🧠 Testing Sequential direct call...');
        const sequentialResult = await session.realMCP.thinkWithSequential('analyze performance optimization strategies');
        console.log(`Sequential thinking: ${sequentialResult.response ? 'completed' : 'attempted'}`);
        
        console.log('⚡ Testing Magic direct call...');
        const magicResult = await session.realMCP.getTools('magic');
        console.log(`Magic tools: ${magicResult.response?.tools?.length || 0} available`);
        
    } catch (error) {
        console.log(`❌ Direct MCP call error: ${error.message}`);
    }
    
    await session.realMCP.shutdown();
    
    // Final summary
    console.log('\n📊 ACTIVE MCP USAGE SUMMARY:');
    console.log('============================');
    
    const finalMcpStatus = session.realMCP.getStatus();
    let totalRequests = 0;
    let activeMCPs = 0;
    
    for (const [server, info] of Object.entries(finalMcpStatus)) {
        totalRequests += info.requestCount;
        if (info.requestCount > 0) activeMCPs++;
        
        const status = info.requestCount > 0 ? '✅ ACTIVELY USED' : '❌ PASSIVE/UNUSED';
        console.log(`${server}: ${status} (${info.requestCount} requests)`);
    }
    
    console.log(`\nTotal MCP requests made: ${totalRequests}`);
    console.log(`MCPs actively used: ${activeMCPs}/3`);
    
    if (activeMCPs === 3 && totalRequests > 10) {
        console.log('\n🎉 SUCCESS: All 3 core MCPs are being ACTIVELY used!');
    } else {
        console.log('\n⚠️  ISSUE: MCPs are connected but not actively used in requests');
        console.log('Need to ensure MCPs are called during request processing');
    }
    
    process.exit(0);
}

testActiveMCPUsage().catch(error => {
    console.error('❌ Active MCP usage test failed:', error.message);
    process.exit(1);
});