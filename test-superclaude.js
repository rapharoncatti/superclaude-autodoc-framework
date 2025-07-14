// Create a test file: test-superclaude.js
const ActiveSuperClaudeSession = require('./core/active-superclaude-session.js');

async function testSuperClaude() {
    try {
        const session = new ActiveSuperClaudeSession();
        await session.initializeSession('test project context');
        
        console.log('✅ SuperClaude v2.0 initialized successfully');
        console.log('Current persona:', session.currentPersona?.name || 'None');
        
        return session;
    } catch (error) {
        console.error('❌ SuperClaude initialization failed:', error.message);
        return null;
    }
}

// Run test
testSuperClaude().then(session => {
    if (session) {
        console.log('🎉 SuperClaude v2.0 is ready for use!');
    }
});