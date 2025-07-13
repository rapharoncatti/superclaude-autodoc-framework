#!/usr/bin/env node

/**
 * Test the fixes to persona switching
 */

const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function testFixes() {
    console.log('🧪 TESTING PERSONA SWITCHING FIXES');
    console.log('=================================');
    
    const session = new ActiveSuperClaudeSession();
    await session.initializeSession('testing fixed persona switching system');
    
    console.log(`\n🎯 Starting persona: ${session.currentPersona}`);
    
    // Test 1: User override should work properly
    console.log('\n1️⃣ Testing user override with --security flag');
    const before1 = session.currentPersona;
    const result1 = await session.executeCommand('design', ['secure-api'], ['--security']);
    const after1 = session.currentPersona;
    
    console.log(`Before: ${before1} → After: ${after1}`);
    console.log(`Result persona: ${result1.persona}`);
    console.log(`✅ User override ${after1 === 'security' && result1.persona === 'security' ? 'WORKS' : 'FAILED'}`);
    
    // Test 2: Context-based switching
    console.log('\n2️⃣ Testing context-based persona switching');
    const before2 = session.currentPersona;
    await session.processRequest('I need to debug this critical performance issue with memory leaks and slow database queries');
    const after2 = session.currentPersona;
    
    console.log(`Before: ${before2} → After: ${after2}`);
    console.log(`✅ Context switching ${after2 !== before2 ? 'WORKS' : 'FAILED'}`);
    
    // Test 3: Command-based switching
    console.log('\n3️⃣ Testing command-based persona switching');
    const before3 = session.currentPersona;
    const result3 = await session.executeCommand('optimize', ['database-queries']);
    const after3 = session.currentPersona;
    
    console.log(`Before: ${before3} → After: ${after3}`);
    console.log(`Result persona: ${result3.persona}`);
    console.log(`✅ Command switching ${after3 === 'performance' && result3.persona === 'performance' ? 'WORKS' : 'FAILED'}`);
    
    // Test 4: Natural language override
    console.log('\n4️⃣ Testing natural language override');
    const before4 = session.currentPersona;
    await session.processRequest('analyze this code for security vulnerabilities --security');
    const after4 = session.currentPersona;
    
    console.log(`Before: ${before4} → After: ${after4}`);
    console.log(`✅ Natural override ${after4 === 'security' ? 'WORKS' : 'FAILED'}`);
    
    // Test 5: Workflow coordination
    console.log('\n5️⃣ Testing workflow persona coordination');
    const workflowResult = await session.executeWorkflow('feature-development', ['user-auth']);
    
    console.log(`Workflow phases: ${workflowResult.completedPhases}`);
    console.log(`Final persona: ${session.currentPersona}`);
    console.log(`✅ Workflow coordination ${workflowResult.success ? 'WORKS' : 'FAILED'}`);
    
    console.log('\n🎯 FIXES VERIFICATION COMPLETE!');
    
    // Show session summary
    const status = session.getSessionStatus();
    const evidence = session.getEvidenceSummary();
    
    console.log('\n📊 Session Summary:');
    console.log(`Final persona: ${status.currentPersona}`);
    console.log(`Total events: ${status.sessionHistory}`);
    console.log(`Evidence collected: ${evidence.totalEvidence}`);
    console.log(`Average confidence: ${(evidence.averageConfidence * 100).toFixed(1)}%`);
    
    process.exit(0);
}

testFixes().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
});