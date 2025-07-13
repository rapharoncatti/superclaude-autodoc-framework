#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📝 OUTPUT QUALITY & STABILITY TEST');
console.log('==================================\n');

async function testOutputQuality() {
    // Create simple test project
    const testRoot = './simple-quality-test';
    if (fs.existsSync(testRoot)) fs.rmSync(testRoot, { recursive: true });
    fs.mkdirSync(testRoot, { recursive: true });

    const testFiles = {
        'package.json': JSON.stringify({
            name: 'quality-comparison',
            version: '1.0.0',
            main: 'src/index.js',
            dependencies: { express: '^4.18.0' }
        }, null, 2),
        'src/index.js': `const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Hello World', status: 'active' });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

module.exports = app;`,
        'src/utils.js': `function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function validateEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

module.exports = { formatDate, validateEmail };`,
        'README.md': '# Quality Test\n\nA simple Express server for testing documentation quality.'
    };

    for (const [file, content] of Object.entries(testFiles)) {
        const fullPath = path.join(testRoot, file);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, content);
    }

    console.log('✅ Test project created\n');

    // Test both systems 3 times
    const results = { v1: [], v2: [] };

    console.log('📊 Testing v1.0 Legacy System (3 runs)');
    for (let i = 1; i <= 3; i++) {
        try {
            const LegacySystem = require('./core/auto-documentation');
            const system = new LegacySystem(testRoot);
            const result = await system.run();
            
            const output = getDocumentationOutput(testRoot);
            const quality = assessQuality(output);
            results.v1.push({ run: i, output, quality, success: true });
            console.log(`  Run ${i}: ${quality.score}/10 quality, ${output.length} chars`);
            
        } catch (error) {
            results.v1.push({ run: i, output: '', quality: {score: 0}, success: false, error: error.message });
            console.log(`  Run ${i}: Failed - ${error.message}`);
        }
        
        clearCache(testRoot);
    }

    console.log('\n⚡ Testing v2.0 Ultra-Efficient System (3 runs)');
    for (let i = 1; i <= 3; i++) {
        try {
            const UltraSystem = require('./core/auto-documentation-v2');
            const system = new UltraSystem(testRoot);
            const result = await system.run();
            
            const output = getDocumentationOutput(testRoot);
            const quality = assessQuality(output);
            results.v2.push({ run: i, output, quality, success: true });
            console.log(`  Run ${i}: ${quality.score}/10 quality, ${output.length} chars`);
            
        } catch (error) {
            results.v2.push({ run: i, output: '', quality: {score: 0}, success: false, error: error.message });
            console.log(`  Run ${i}: Failed - ${error.message}`);
        }
        
        clearCache(testRoot);
    }

    // Analyze results
    console.log('\n📈 QUALITY & STABILITY ANALYSIS');
    console.log('==============================');

    const v1Successful = results.v1.filter(r => r.success);
    const v2Successful = results.v2.filter(r => r.success);

    if (v1Successful.length === 0 && v2Successful.length === 0) {
        console.log('❌ Both systems failed completely');
        return;
    }

    // Quality comparison
    const v1QualityAvg = v1Successful.length > 0 ? 
        v1Successful.reduce((sum, r) => sum + r.quality.score, 0) / v1Successful.length : 0;
    const v2QualityAvg = v2Successful.length > 0 ?
        v2Successful.reduce((sum, r) => sum + r.quality.score, 0) / v2Successful.length : 0;

    console.log(`📝 Documentation Quality:`);
    console.log(`   v1.0 Legacy: ${v1QualityAvg.toFixed(1)}/10 average (${v1Successful.length}/3 successful runs)`);
    console.log(`   v2.0 Ultra:  ${v2QualityAvg.toFixed(1)}/10 average (${v2Successful.length}/3 successful runs)`);
    
    // Stability comparison
    const v1Lengths = v1Successful.map(r => r.output.length);
    const v2Lengths = v2Successful.map(r => r.output.length);
    
    const v1StdDev = calculateStdDev(v1Lengths);
    const v2StdDev = calculateStdDev(v2Lengths);
    
    console.log(`\n🔄 Output Stability (consistency):`);
    console.log(`   v1.0 Legacy: ${v1StdDev.toFixed(0)} chars std deviation`);
    console.log(`   v2.0 Ultra:  ${v2StdDev.toFixed(0)} chars std deviation`);
    
    // Content comparison
    if (v1Successful.length > 0 && v2Successful.length > 0) {
        const v1Sample = v1Successful[0].output;
        const v2Sample = v2Successful[0].output;
        
        console.log(`\n📋 Content Analysis:`);
        console.log(`   v1.0 Sample length: ${v1Sample.length} characters`);
        console.log(`   v2.0 Sample length: ${v2Sample.length} characters`);
        console.log(`   v1.0 Has sections: ${hasSections(v1Sample)}`);
        console.log(`   v2.0 Has sections: ${hasSections(v2Sample)}`);
        console.log(`   v1.0 Has code examples: ${hasCodeExamples(v1Sample)}`);
        console.log(`   v2.0 Has code examples: ${hasCodeExamples(v2Sample)}`);
    }

    // Overall verdict
    console.log(`\n🏆 QUALITY & STABILITY VERDICT:`);
    
    const qualityWinner = v2QualityAvg > v1QualityAvg ? 'v2.0' : 
                         v1QualityAvg > v2QualityAvg ? 'v1.0' : 'TIE';
    const stabilityWinner = v2StdDev < v1StdDev ? 'v2.0' : 
                           v1StdDev < v2StdDev ? 'v1.0' : 'TIE';
    const reliabilityWinner = v2Successful.length > v1Successful.length ? 'v2.0' :
                             v1Successful.length > v2Successful.length ? 'v1.0' : 'TIE';

    console.log(`   Quality Winner: ${qualityWinner}`);
    console.log(`   Stability Winner: ${stabilityWinner}`);
    console.log(`   Reliability Winner: ${reliabilityWinner}`);

    // Save sample outputs for inspection
    if (v1Successful.length > 0) {
        fs.writeFileSync('./v1-sample-output.md', v1Successful[0].output);
        console.log(`\n📄 v1.0 sample saved to: ./v1-sample-output.md`);
    }
    if (v2Successful.length > 0) {
        fs.writeFileSync('./v2-sample-output.md', v2Successful[0].output);
        console.log(`📄 v2.0 sample saved to: ./v2-sample-output.md`);
    }

    // Cleanup
    fs.rmSync(testRoot, { recursive: true, force: true });
    console.log('\n✅ Quality test completed');
}

function getDocumentationOutput(projectPath) {
    const claudePath = path.join(projectPath, 'CLAUDE.md');
    return fs.existsSync(claudePath) ? fs.readFileSync(claudePath, 'utf8') : '';
}

function assessQuality(output) {
    let score = 0;
    const issues = [];

    if (!output || output.length < 50) {
        issues.push('No or minimal documentation generated');
        return { score: 0, issues };
    }

    // Basic content checks
    if (output.length > 200) score += 2; // Substantial content
    if (output.includes('express') || output.includes('server')) score += 2; // Project-relevant
    if (hasSections(output)) score += 2; // Proper structure
    if (hasCodeExamples(output)) score += 2; // Code examples
    if (output.includes('installation') || output.includes('usage')) score += 2; // Practical info

    return { score: Math.min(score, 10), issues };
}

function hasSections(text) {
    return /^#+\s/.test(text) || text.includes('##');
}

function hasCodeExamples(text) {
    return text.includes('```') || text.includes('`');
}

function calculateStdDev(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
}

function clearCache(projectPath) {
    const cachePath = path.join(projectPath, '.superclaude-cache');
    if (fs.existsSync(cachePath)) {
        fs.rmSync(cachePath, { recursive: true, force: true });
    }
}

testOutputQuality().catch(console.error);