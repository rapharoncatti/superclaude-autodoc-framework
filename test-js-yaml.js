#!/usr/bin/env node

// Test js-yaml dependency
try {
    const yaml = require('js-yaml');
    console.log('✅ js-yaml loaded successfully');
    
    // Test basic functionality
    const testData = { test: 'value', number: 42 };
    const yamlString = yaml.dump(testData);
    const parsed = yaml.load(yamlString);
    
    if (parsed.test === 'value' && parsed.number === 42) {
        console.log('✅ js-yaml functionality works');
        process.exit(0);
    } else {
        console.log('❌ js-yaml parsing failed');
        process.exit(1);
    }
} catch (error) {
    console.log('❌ js-yaml failed:', error.message);
    process.exit(1);
}