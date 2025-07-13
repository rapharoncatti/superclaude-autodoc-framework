#!/usr/bin/env node

// Test just the persona loading from persona engine
async function testPersonaEngine() {
try {
    console.log('🔍 Testing persona engine loading...');
    
    const PersonaIntelligenceEngine = require('./core/persona-intelligence-engine.js');
    
    console.log('✅ PersonaIntelligenceEngine module loaded');
    
    // Create instance but catch any initialization errors
    const engine = new PersonaIntelligenceEngine({
        superClaudePath: '/media/rapharoncatti/Transfer/Repos/clean-superclaude',
        frameworkPath: '/media/rapharoncatti/Transfer/Repos/superclaude-autodoc-framework'
    });
    
    console.log('✅ PersonaIntelligenceEngine instance created');
    
    // Check if personas were loaded (even fallback is OK for now)
    const personas = engine.personas;
    const personaCount = Object.keys(personas).length;
    
    console.log(`🎭 Loaded ${personaCount} personas`);
    
    if (personaCount >= 9) {
        console.log('✅ Required personas available');
        
        // Test basic functionality
        const context = {
            request: 'test debugging issue',
            taskType: 'debugging',
            keywords: ['bug_error_issue'],
            fileTypes: ['.js'],
            technicalTerms: ['frontend'],
            fileContent: {
                hasReactComponents: false,
                hasBackendCode: false,
                hasTestCode: false,
                hasConfigFiles: false,
                hasDocumentation: false,
                hasSecurityCode: false,
                hasPerformanceCode: false
            },
            errorPatterns: [],
            performanceNeeds: {
                needsOptimization: false,
                needsScaling: false,
                needsMonitoring: false,
                needsCaching: false
            },
            qualityRequirements: {
                needsTesting: false,
                needsSecurity: false,
                needsDocumentation: false,
                needsRefactoring: false
            }
        };
        
        const selection = await engine.selectOptimalPersona(context);
        console.log('✅ Persona selection works');
        
        const selectedPersona = selection.persona;
        console.log(`🎯 Selected persona: ${selectedPersona}`);
        
        if (selectedPersona && personas[selectedPersona]) {
            console.log('✅ Selected persona exists in personas data');
            console.log('✅ Persona engine basic functionality PASSED');
            process.exit(0);
        } else {
            console.log('❌ Selected persona not found in data');
            process.exit(1);
        }
    } else {
        console.log('❌ Insufficient personas loaded');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Persona engine test failed:', error.message);
    console.log('Stack:', error.stack);
    process.exit(1);
}
}

testPersonaEngine();