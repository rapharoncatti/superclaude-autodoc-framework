#!/usr/bin/env node

// Test extracting just the All_Personas section
const fs = require('fs');
const yaml = require('js-yaml');

console.log('🔍 Testing All_Personas section extraction...');

try {
    const filePath = '/media/rapharoncatti/Transfer/Repos/clean-superclaude/.claude/shared/superclaude-personas.yml';
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let startIndex = -1;
    let endIndex = -1;
    
    // Find ## All_Personas section
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '## All_Personas') {
            startIndex = i + 1; // Start after the header
        } else if (startIndex !== -1 && lines[i].startsWith('## ')) {
            endIndex = i;
            break;
        }
    }
    
    if (startIndex !== -1) {
        if (endIndex === -1) endIndex = lines.length;
        
        console.log(`📋 Found All_Personas section: lines ${startIndex + 1} to ${endIndex}`);
        
        // Extract just the personas content (without the ## header)
        const personasLines = lines.slice(startIndex, endIndex);
        
        // Remove empty lines at the end
        while (personasLines.length > 0 && personasLines[personasLines.length - 1].trim() === '') {
            personasLines.pop();
        }
        
        const personasContent = personasLines.join('\n');
        console.log(`📄 Extracted ${personasContent.length} characters`);
        console.log(`🔍 First few lines:\n${personasLines.slice(0, 5).join('\n')}`);
        
        // Wrap in a proper YAML structure by indenting all content
        const indentedContent = personasContent.split('\n').map(line => 
            line.trim() === '' ? '' : `  ${line}`
        ).join('\n');
        
        const yamlContent = `All_Personas:\n${indentedContent}`;
        
        try {
            const data = yaml.load(yamlContent);
            
            if (data && data.All_Personas) {
                const personas = Object.keys(data.All_Personas);
                console.log(`✅ Successfully parsed ${personas.length} personas: ${personas.join(', ')}`);
                
                // Test specific persona
                const architect = data.All_Personas.architect;
                if (architect && architect.Identity && architect.MCP_Preferences) {
                    console.log(`✅ Persona structure correct`);
                    console.log(`🏗️  Architect Identity: ${architect.Identity}`);
                    console.log(`🔧 Architect MCP: ${architect.MCP_Preferences}`);
                    
                    console.log('✅ All_Personas extraction SUCCESSFUL');
                    process.exit(0);
                } else {
                    console.log('❌ Persona structure incorrect');
                    console.log('Debug architect:', JSON.stringify(architect, null, 2));
                    process.exit(1);
                }
            } else {
                console.log('❌ No All_Personas in parsed data');
                console.log('Parsed keys:', Object.keys(data || {}));
                process.exit(1);
            }
        } catch (parseError) {
            console.log('❌ YAML parsing failed:', parseError.message);
            console.log('Content preview:', yamlContent.substring(0, 500));
            process.exit(1);
        }
    } else {
        console.log('❌ Could not find All_Personas section');
        process.exit(1);
    }
    
} catch (error) {
    console.log('❌ Extraction failed:', error.message);
    process.exit(1);
}