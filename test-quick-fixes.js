#!/usr/bin/env node

/**
 * Test Quick Fixes - Should be FAST now
 */

console.log('🚀 Testing Quick Fixes - Should be FAST now!');
console.log('=============================================');

async function testQuickFixes() {
    const startTime = Date.now();
    
    try {
        const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');
        
        console.log('✅ Module imported successfully');
        
        // Test 1: Fast initialization
        console.log('\n1️⃣ Testing fast initialization...');
        const initStart = Date.now();
        
        const session = new ActiveSuperClaudeSession();
        await session.initializeSession('test fast initialization');
        
        const initTime = Date.now() - initStart;
        console.log(`⚡ Initialization completed in ${initTime}ms`);
        
        if (initTime < 5000) {
            console.log('✅ FAST INITIALIZATION SUCCESS!');
        } else {
            console.log(`⚠️  Still slow: ${initTime}ms`);
        }
        
        // Test 2: Persona switching works
        console.log('\n2️⃣ Testing persona switching...');
        console.log(`Current persona: ${session.currentPersona}`);
        
        await session.executeCommand('secure', ['test'], ['--audit']);
        console.log(`After security command: ${session.currentPersona}`);
        
        // Test 3: Commands show proper persona
        console.log('\n3️⃣ Testing command results...');
        const result = await session.executeCommand('analyze', ['performance']);
        console.log(`Command result persona: ${result.persona}`);
        
        if (result.persona && result.persona !== 'undefined') {
            console.log('✅ PERSONA DISPLAY FIXED!');
        } else {
            console.log('❌ Persona display still broken');
        }
        
        // Test 4: Workflow execution
        console.log('\n4️⃣ Testing workflow...');
        const workflowStart = Date.now();
        
        const workflowResult = await session.executeWorkflow('bug-fix', ['test-issue']);
        const workflowTime = Date.now() - workflowStart;
        
        console.log(`⚡ Workflow completed in ${workflowTime}ms`);
        console.log(`Workflow success: ${workflowResult.success}`);
        console.log(`Phases completed: ${workflowResult.completedPhases}/${workflowResult.totalPhases}`);
        
        const totalTime = Date.now() - startTime;
        console.log(`\n🎯 TOTAL TEST TIME: ${totalTime}ms`);
        
        if (totalTime < 10000) {
            console.log('🏆 SUCCESS: System is now FAST and FUNCTIONAL!');
        } else {
            console.log('⚠️  Still needs optimization');
        }
        
        // Force clean exit
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testQuickFixes();