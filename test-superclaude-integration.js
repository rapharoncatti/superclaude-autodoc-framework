#!/usr/bin/env node

// Test SuperClaude integration
try {
    const fs = require('fs');
    const yaml = require('js-yaml');
    const path = require('path');
    
    console.log('🔍 Testing SuperClaude integration...');
    
    // Test loading personas from clean SuperClaude repo
    const superClaudePath = '/media/rapharoncatti/Transfer/Repos/clean-superclaude';
    const personasPath = path.join(superClaudePath, '.claude/shared/superclaude-personas.yml');
    
    console.log(`📋 Checking personas file: ${personasPath}`);
    
    if (!fs.existsSync(personasPath)) {
        console.log('❌ SuperClaude personas file not found');
        process.exit(1);
    }
    
    console.log('✅ SuperClaude personas file exists');
    
    // Try to load and parse
    const content = fs.readFileSync(personasPath, 'utf8');
    console.log(`📄 File size: ${content.length} characters`);
    
    const data = yaml.load(content);
    console.log('✅ YAML parsing successful');
    
    // Check for personas
    const personas = data?.All_Personas || {};
    const personaNames = Object.keys(personas);
    
    console.log(`🎭 Found ${personaNames.length} personas: ${personaNames.join(', ')}`);
    
    if (personaNames.length >= 9) {
        console.log('✅ All expected personas found');
        
        // Test specific persona data
        const architect = personas.architect;
        if (architect && architect.Identity && architect.MCP_Preferences) {
            console.log('✅ Persona data structure is correct');
            console.log(`🏗️  Architect identity: ${architect.Identity}`);
            console.log(`🔧 Architect MCP: ${architect.MCP_Preferences}`);
            
            console.log('✅ SuperClaude integration test PASSED');
            process.exit(0);
        } else {
            console.log('❌ Persona data structure incorrect');
            process.exit(1);
        }
    } else {
        console.log('❌ Missing personas');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ SuperClaude integration test failed:', error.message);
    process.exit(1);
}