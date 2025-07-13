#!/usr/bin/env node

// Test YAML parsing of clean SuperClaude personas to understand the exact issue
const fs = require('fs');
const yaml = require('js-yaml');

console.log('🔍 Testing YAML parsing of clean SuperClaude personas...');

try {
    const filePath = '/media/rapharoncatti/Transfer/Repos/clean-superclaude/.claude/shared/superclaude-personas.yml';
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`📄 File size: ${content.length} characters`);
    
    // Try to parse the full YAML
    try {
        const data = yaml.load(content);
        console.log('✅ Full YAML parsing successful');
        console.log(`📋 Top-level keys: ${Object.keys(data).join(', ')}`);
        
        if (data.All_Personas) {
            const personas = Object.keys(data.All_Personas);
            console.log(`🎭 All_Personas has ${personas.length} personas: ${personas.join(', ')}`);
            process.exit(0);
        } else {
            console.log('❌ No All_Personas section found');
            process.exit(1);
        }
    } catch (yamlError) {
        console.log('❌ Full YAML parsing failed:', yamlError.message);
        
        // Try to extract just the All_Personas section
        console.log('🔧 Attempting to extract All_Personas section only...');
        
        const lines = content.split('\n');
        let startIndex = -1;
        let endIndex = -1;
        
        // Find ## All_Personas section
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('## All_Personas')) {
                startIndex = i;
            } else if (startIndex !== -1 && lines[i].startsWith('## ')) {
                endIndex = i;
                break;
            }
        }
        
        if (startIndex !== -1) {
            if (endIndex === -1) endIndex = lines.length;
            
            const personasSection = lines.slice(startIndex, endIndex).join('\n');
            console.log(`📋 Extracted section from line ${startIndex + 1} to ${endIndex}`);
            
            try {
                // Parse just the personas section
                const cleanedSection = personasSection.replace('## All_Personas', 'All_Personas:');
                const personasData = yaml.load(cleanedSection);
                
                if (personasData && personasData.All_Personas) {
                    const personas = Object.keys(personasData.All_Personas);
                    console.log(`✅ Extracted ${personas.length} personas: ${personas.join(', ')}`);
                    
                    // Test specific persona data
                    const architect = personasData.All_Personas.architect;
                    if (architect && architect.Identity) {
                        console.log(`✅ Persona data structure correct`);
                        console.log(`🏗️  Architect: ${architect.Identity}`);
                        process.exit(0);
                    } else {
                        console.log('❌ Persona data structure incorrect');
                        process.exit(1);
                    }
                } else {
                    console.log('❌ Could not extract All_Personas data');
                    process.exit(1);
                }
            } catch (extractError) {
                console.log('❌ Section extraction failed:', extractError.message);
                process.exit(1);
            }
        } else {
            console.log('❌ Could not find All_Personas section');
            process.exit(1);
        }
    }
    
} catch (error) {
    console.log('❌ File reading failed:', error.message);
    process.exit(1);
}