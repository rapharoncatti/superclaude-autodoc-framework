#!/usr/bin/env node

/**
 * Demo: Automatic Persona Switching with User Override
 * Shows how the system automatically switches personas and allows user control
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function demoPersonaSwitching() {
    console.log('🎭 DEMO: AUTOMATIC PERSONA SWITCHING WITH USER OVERRIDE');
    console.log('======================================================');
    
    try {
        // Initialize session
        const session = new ActiveSuperClaudeSession();
        await session.initializeSession('testing automatic persona switching capabilities');
        
        console.log(`\n🎯 Starting persona: ${session.currentPersona.toUpperCase()}`);
        
        // Demo 1: Automatic switching based on context
        console.log('\n1️⃣ AUTOMATIC CONTEXT-BASED SWITCHING:');
        console.log('📝 User says: "I need to debug this performance issue"');
        
        await session.processRequest('I need to debug this performance issue with memory leaks');
        console.log(`   🎭 Auto-switched to: ${session.currentPersona.toUpperCase()}`);
        
        // Demo 2: Automatic switching based on command
        console.log('\n2️⃣ AUTOMATIC COMMAND-BASED SWITCHING:');
        console.log('📝 User runs: /secure --audit');
        
        await session.executeCommand('secure', [], ['--audit']);
        console.log(`   🎭 Auto-switched to: ${session.currentPersona.toUpperCase()}`);
        
        // Demo 3: User override via flag
        console.log('\n3️⃣ USER OVERRIDE VIA FLAG:');
        console.log('📝 User runs: /test --coverage --qa (normally uses qa persona)');
        console.log('📝 But user wants: /test --coverage --frontend (force frontend persona)');
        
        await session.executeCommand('test', [], ['--coverage', '--frontend']);
        console.log(`   👤 User overrode to: ${session.currentPersona.toUpperCase()}`);
        
        // Demo 4: User override in natural language
        console.log('\n4️⃣ USER OVERRIDE IN NATURAL LANGUAGE:');
        console.log('📝 User says: "optimize this code --performance"');
        
        await session.processRequest('optimize this code for better algorithms --performance');
        console.log(`   👤 User overrode to: ${session.currentPersona.toUpperCase()}`);
        
        // Demo 5: Workflow with automatic persona coordination
        console.log('\n5️⃣ WORKFLOW WITH AUTOMATIC PERSONA COORDINATION:');
        console.log('📝 User runs: security-audit workflow');
        
        const workflowResult = await session.executeWorkflow('security-audit', ['auth-system']);
        console.log(`   🔄 Workflow completed with ${workflowResult.phases.length} persona switches`);
        workflowResult.phases.forEach((phase, i) => {
            console.log(`      Phase ${i+1}: /${phase.command} → ${phase.persona} persona`);
        });
        
        // Demo 6: Show all available persona flags
        console.log('\n6️⃣ AVAILABLE USER OVERRIDE FLAGS:');
        console.log('   📋 Long form: --persona-architect, --persona-frontend, --persona-security, etc.');
        console.log('   📋 Short form: --architect, --frontend, --security, etc.');
        console.log('   📋 Usage examples:');
        console.log('      • /design api-spec --security (force security persona for design)');
        console.log('      • /test auth-flow --frontend (force frontend persona for testing)');
        console.log('      • "debug this issue --analyzer" (force analyzer persona)');
        
        // Demo 7: Smart recommendations
        console.log('\n7️⃣ SMART WORKFLOW RECOMMENDATIONS:');
        const contexts = [
            'We have a critical security vulnerability',
            'The app is running slowly and users are complaining',
            'I need to implement a new user authentication feature',
            'There are bugs in the payment processing system'
        ];
        
        for (const context of contexts) {
            console.log(`\n   Context: "${context}"`);
            const recommendations = await session.recommendWorkflow(context);
            console.log(`   🎯 Recommended: ${recommendations[0].workflow} (${(recommendations[0].confidence * 100).toFixed(0)}%)`);
            console.log(`   💡 Reason: ${recommendations[0].reason}`);
        }
        
        console.log('\n✅ PERSONA SWITCHING DEMO COMPLETED!');
        console.log('\n🎯 KEY FEATURES DEMONSTRATED:');
        console.log('   ✅ Automatic context-based persona switching');
        console.log('   ✅ Automatic command-based persona switching');
        console.log('   ✅ User override via command flags');
        console.log('   ✅ User override via natural language');
        console.log('   ✅ Workflow-based persona coordination');
        console.log('   ✅ Smart workflow recommendations');
        console.log('   ✅ Flexible flag system (long/short forms)');
        
        console.log('\n🎭 PERSONA SWITCHING HIERARCHY:');
        console.log('   1. 👤 USER OVERRIDE (highest priority)');
        console.log('   2. 🎯 COMMAND DEFAULT (medium priority)');
        console.log('   3. 🤖 CONTEXT ANALYSIS (automatic fallback)');
        console.log('   4. 📋 WORKFLOW COORDINATION (multi-phase)');
        
        console.log('\n🏆 SYSTEM IS FULLY USER-CONTROLLABLE + AUTO-INTELLIGENT!');
        
    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }
}

// Run the demo
demoPersonaSwitching();