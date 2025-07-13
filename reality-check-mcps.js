#!/usr/bin/env node

/**
 * BRUTAL REALITY CHECK: What MCPs Actually Work?
 * No assumptions, test everything directly
 */

const { spawn } = require('child_process');

async function realityCheckMCPs() {
    console.log('🔍 BRUTAL REALITY CHECK: What MCPs Actually Work?');
    console.log('=================================================');
    
    const results = {
        context7: { working: false, error: null },
        sequential: { working: false, error: null },
        magic: { working: false, error: null },
        puppeteer: { working: false, error: null }
    };
    
    // Test 1: Context7 MCP
    console.log('\n1️⃣ Testing Context7 MCP...');
    try {
        const context7Process = spawn('npx', ['-y', '@upstash/context7-mcp'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        const timeout = setTimeout(() => {
            context7Process.kill();
            results.context7.error = 'Timeout';
        }, 5000);
        
        context7Process.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test', version: '1.0.0' }
            }
        }) + '\n');
        
        context7Process.stdout.once('data', (data) => {
            clearTimeout(timeout);
            try {
                const response = JSON.parse(data.toString());
                if (response.id === 1 && !response.error) {
                    results.context7.working = true;
                    console.log('✅ Context7 MCP: WORKING');
                } else {
                    results.context7.error = response.error?.message || 'Invalid response';
                    console.log('❌ Context7 MCP: Failed -', results.context7.error);
                }
            } catch (e) {
                results.context7.error = 'Parse error: ' + e.message;
                console.log('❌ Context7 MCP: Parse error -', e.message);
            }
            context7Process.kill();
        });
        
    } catch (error) {
        results.context7.error = error.message;
        console.log('❌ Context7 MCP: Exception -', error.message);
    }
    
    // Test 2: Sequential MCP
    console.log('\n2️⃣ Testing Sequential MCP...');
    try {
        const sequentialPath = '/home/rapharoncatti/.nvm/versions/node/v22.17.0/lib/node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js';
        const sequentialProcess = spawn('node', [sequentialPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        const timeout2 = setTimeout(() => {
            sequentialProcess.kill();
            results.sequential.error = 'Timeout';
        }, 5000);
        
        sequentialProcess.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test', version: '1.0.0' }
            }
        }) + '\n');
        
        sequentialProcess.stdout.once('data', (data) => {
            clearTimeout(timeout2);
            try {
                const response = JSON.parse(data.toString());
                if (response.id === 1 && !response.error) {
                    results.sequential.working = true;
                    console.log('✅ Sequential MCP: WORKING');
                } else {
                    results.sequential.error = response.error?.message || 'Invalid response';
                    console.log('❌ Sequential MCP: Failed -', results.sequential.error);
                }
            } catch (e) {
                results.sequential.error = 'Parse error: ' + e.message;
                console.log('❌ Sequential MCP: Parse error -', e.message);
            }
            sequentialProcess.kill();
        });
        
    } catch (error) {
        results.sequential.error = error.message;
        console.log('❌ Sequential MCP: Exception -', error.message);
    }
    
    // Test 3: Magic MCP
    console.log('\n3️⃣ Testing Magic MCP...');
    try {
        const magicProcess = spawn('npx', ['@21st-dev/magic'], {
            stdio: ['pipe', 'pipe', 'pipe']
        });
        
        const timeout3 = setTimeout(() => {
            magicProcess.kill();
            results.magic.error = 'Timeout';
        }, 10000); // Magic might take longer
        
        magicProcess.stdin.write(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test', version: '1.0.0' }
            }
        }) + '\n');
        
        magicProcess.stdout.once('data', (data) => {
            clearTimeout(timeout3);
            try {
                const response = JSON.parse(data.toString());
                if (response.id === 1 && !response.error) {
                    results.magic.working = true;
                    console.log('✅ Magic MCP: WORKING');
                } else {
                    results.magic.error = response.error?.message || 'Invalid response';
                    console.log('❌ Magic MCP: Failed -', results.magic.error);
                }
            } catch (e) {
                results.magic.error = 'Parse error: ' + e.message;
                console.log('❌ Magic MCP: Parse error -', e.message);
            }
            magicProcess.kill();
        });
        
    } catch (error) {
        results.magic.error = error.message;
        console.log('❌ Magic MCP: Exception -', error.message);
    }
    
    // Test 4: Our Puppeteer wrapper
    console.log('\n4️⃣ Testing Puppeteer MCP Wrapper...');
    try {
        const PuppeteerWrapper = require('./core/puppeteer-mcp-wrapper.js');
        const wrapper = new PuppeteerWrapper(8444);
        
        await wrapper.start();
        
        // Test HTTP endpoint
        const response = await fetch('http://localhost:8444/api/tools');
        if (response.ok) {
            const data = await response.json();
            if (data.tools && data.tools.length > 0) {
                results.puppeteer.working = true;
                console.log('✅ Puppeteer MCP Wrapper: WORKING');
            } else {
                results.puppeteer.error = 'No tools available';
                console.log('❌ Puppeteer MCP Wrapper: No tools');
            }
        } else {
            results.puppeteer.error = `HTTP ${response.status}`;
            console.log('❌ Puppeteer MCP Wrapper: HTTP error -', response.status);
        }
        
        await wrapper.stop();
        
    } catch (error) {
        results.puppeteer.error = error.message;
        console.log('❌ Puppeteer MCP Wrapper: Exception -', error.message);
    }
    
    // Wait for all tests to complete
    await new Promise(resolve => setTimeout(resolve, 12000));
    
    // Final results
    console.log('\n📊 BRUTAL REALITY CHECK RESULTS:');
    console.log('================================');
    
    const workingMCPs = [];
    const brokenMCPs = [];
    
    for (const [name, result] of Object.entries(results)) {
        if (result.working) {
            workingMCPs.push(name);
            console.log(`✅ ${name}: ACTUALLY WORKING`);
        } else {
            brokenMCPs.push(name);
            console.log(`❌ ${name}: BROKEN - ${result.error || 'Unknown error'}`);
        }
    }
    
    console.log(`\n🎯 TRUTH: ${workingMCPs.length}/4 MCPs actually work`);
    console.log(`✅ Working: ${workingMCPs.join(', ') || 'NONE'}`);
    console.log(`❌ Broken: ${brokenMCPs.join(', ') || 'NONE'}`);
    
    if (workingMCPs.length === 0) {
        console.log('\n🚨 CRITICAL: NO MCPs ARE ACTUALLY WORKING!');
    } else if (workingMCPs.length < 4) {
        console.log(`\n⚠️  WARNING: Only ${workingMCPs.length} out of 4 MCPs work`);
    } else {
        console.log('\n🎉 SUCCESS: All 4 MCPs are working!');
    }
    
    process.exit(0);
}

realityCheckMCPs().catch(error => {
    console.error('❌ Reality check failed:', error.message);
    process.exit(1);
});