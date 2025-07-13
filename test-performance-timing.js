#!/usr/bin/env node

// Test performance timing to identify bottlenecks
console.log('🔍 Testing persona engine performance...');

const startTime = Date.now();

async function testPerformance() {
    try {
        console.log('⏱️  Loading PersonaIntelligenceEngine module...');
        const loadStart = Date.now();
        const PersonaIntelligenceEngine = require('./core/persona-intelligence-engine.js');
        console.log(`✅ Module loaded in ${Date.now() - loadStart}ms`);
        
        console.log('⏱️  Creating engine instance...');
        const initStart = Date.now();
        const engine = new PersonaIntelligenceEngine({
            superClaudePath: '/media/rapharoncatti/Transfer/Repos/clean-superclaude',
            frameworkPath: '/media/rapharoncatti/Transfer/Repos/superclaude-autodoc-framework'
        });
        console.log(`✅ Engine initialized in ${Date.now() - initStart}ms`);
        
        console.log('⏱️  Testing context analysis...');
        const contextStart = Date.now();
        const context = await engine.analyzeContext("test performance", {});
        console.log(`✅ Context analysis completed in ${Date.now() - contextStart}ms`);
        
        console.log('⏱️  Testing persona selection...');
        const selectionStart = Date.now();
        const selection = await engine.selectOptimalPersona(context);
        console.log(`✅ Persona selection completed in ${Date.now() - selectionStart}ms`);
        
        console.log('⏱️  Testing full process...');
        const processStart = Date.now();
        const result = await engine.process("quick test");
        console.log(`✅ Full process completed in ${Date.now() - processStart}ms`);
        
        const totalTime = Date.now() - startTime;
        console.log(`\\n📊 PERFORMANCE SUMMARY:`);
        console.log(`Total time: ${totalTime}ms`);
        console.log(`${totalTime < 5000 ? '✅' : '❌'} Performance: ${totalTime < 5000 ? 'GOOD' : 'SLOW'}`);
        
        process.exit(0);
        
    } catch (error) {
        console.log('❌ Performance test failed:', error.message);
        console.log(`Total time before failure: ${Date.now() - startTime}ms`);
        process.exit(1);
    }
}

// Set timeout
setTimeout(() => {
    console.log('❌ Performance test timed out after 30 seconds');
    console.log(`Time elapsed: ${Date.now() - startTime}ms`);
    process.exit(1);
}, 30000);

testPerformance();