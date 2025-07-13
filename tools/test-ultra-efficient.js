#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Test Suite
 * Comprehensive testing for the ultra-efficient optimization system
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_PROJECT_ROOT = path.join(__dirname, '../test-project');
const EXPECTED_IMPROVEMENTS = {
    tokenReduction: 50, // Minimum 50% token reduction
    speedImprovement: 30, // Minimum 30% speed improvement
    cacheHitRate: 60 // Minimum 60% cache hit rate after warmup
};

class UltraEfficientTester {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: []
        };
        
        this.setupTestEnvironment();
    }

    // Setup isolated test environment
    setupTestEnvironment() {
        console.log('🧪 Setting up test environment...\n');
        
        // Create test project structure
        if (!fs.existsSync(TEST_PROJECT_ROOT)) {
            fs.mkdirSync(TEST_PROJECT_ROOT, { recursive: true });
        }
        
        // Create sample files for testing
        this.createTestFiles();
        console.log('✅ Test environment ready\n');
    }

    // Create sample files to test the system
    createTestFiles() {
        const testFiles = {
            'package.json': JSON.stringify({
                name: 'test-project',
                version: '1.0.0',
                dependencies: { react: '^18.0.0' }
            }, null, 2),
            
            'src/components/Button.jsx': `
import React from 'react';

export default function Button({ onClick, children }) {
    return (
        <button onClick={onClick} className="btn">
            {children}
        </button>
    );
}`,
            
            'src/services/ApiService.js': `
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async getData(endpoint) {
        const response = await fetch(\`\${this.baseUrl}/\${endpoint}\`);
        return response.json();
    }
}

export default ApiService;`,
            
            'src/utils/helpers.js': `
export function formatDate(date) {
    return date.toLocaleDateString();
}

export function validateEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,

            'tests/Button.test.js': `
import { render, fireEvent } from '@testing-library/react';
import Button from '../src/components/Button';

describe('Button Component', () => {
    it('should render with text', () => {
        render(<Button>Click me</Button>);
    });
});`,

            'README.md': '# Test Project\nThis is a test project for the ultra-efficient framework.',
            
            '.superclaude.yml': `
ultraEfficient:
  mode: ultra-efficient
  enableCaching: true
  enableValidation: true
  tokenBudget: 300
  timeBudget: 3000
  confidenceThreshold: 0.8`
        };

        for (const [filePath, content] of Object.entries(testFiles)) {
            const fullPath = path.join(TEST_PROJECT_ROOT, filePath);
            const dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(fullPath, content);
        }
    }

    // Run comprehensive test suite
    async runTests() {
        console.log('🚀 Starting SuperClaude Ultra-Efficient Framework v2.0 Tests');
        console.log('===========================================================\n');

        try {
            // Test 1: System initialization
            await this.testSystemInitialization();
            
            // Test 2: Cache system functionality
            await this.testCacheSystem();
            
            // Test 3: Evidence validation
            await this.testEvidenceValidation();
            
            // Test 4: Microsecond processing
            await this.testMicrosecondProcessing();
            
            // Test 5: Performance monitoring
            await this.testPerformanceMonitoring();
            
            // Test 6: End-to-end ultra-efficient workflow
            await this.testUltraEfficientWorkflow();
            
            // Test 7: Benchmark comparison
            await this.testBenchmarkComparison();

        } catch (error) {
            this.recordFailure('Critical Test Error', error.message);
        }

        this.generateTestReport();
    }

    // Test system initialization
    async testSystemInitialization() {
        console.log('📋 Test 1: System Initialization');
        console.log('--------------------------------');
        
        try {
            // Test that all required modules can be loaded
            const AutoDocumentationV2 = require('../core/auto-documentation-v2');
            
            this.runTest('AutoDocumentationV2 module loads', () => {
                return typeof AutoDocumentationV2 === 'function';
            });

            // Test system can be instantiated
            const system = new AutoDocumentationV2(TEST_PROJECT_ROOT);
            
            this.runTest('System instantiation', () => {
                return system !== null && typeof system.run === 'function';
            });

            this.runTest('Configuration loading', () => {
                return system.config && system.config.mode === 'ultra-efficient';
            });

            console.log('✅ System initialization tests completed\n');

        } catch (error) {
            this.recordFailure('System Initialization', error.message);
        }
    }

    // Test cache system functionality
    async testCacheSystem() {
        console.log('💾 Test 2: Smart Cache System');
        console.log('-----------------------------');
        
        try {
            const SmartCacheSystem = require('../core/smart-cache');
            const cache = new SmartCacheSystem(TEST_PROJECT_ROOT);

            this.runTest('Cache system initialization', () => {
                return cache !== null;
            });

            // Test file signature generation
            const testFile = path.join(TEST_PROJECT_ROOT, 'package.json');
            const signature = cache.generateFileSignature(testFile);
            
            this.runTest('File signature generation', () => {
                return signature && signature.signature && signature.signature.length > 16;
            });

            // Test caching functionality
            await cache.cacheDecision('test_hash', 'test_action', 'test_rationale', 0.9, 1);
            const cachedDecision = await cache.getCachedDecision('test_hash');
            
            this.runTest('Decision caching and retrieval', () => {
                return cachedDecision && cachedDecision.decision === 'test_action';
            });

            console.log('✅ Cache system tests completed\n');
            cache.close();

        } catch (error) {
            this.recordFailure('Cache System', error.message);
        }
    }

    // Test evidence validation system
    async testEvidenceValidation() {
        console.log('🛡️  Test 3: Evidence-Based Validation');
        console.log('------------------------------------');
        
        try {
            const EvidenceBasedValidator = require('../core/evidence-validator');
            const validator = new EvidenceBasedValidator(TEST_PROJECT_ROOT);

            this.runTest('Validator initialization', () => {
                return validator !== null;
            });

            // Test claim validation
            const validClaim = 'File package.json exists';
            const validationResult = await validator.validateClaim(validClaim, {
                evidence: [{ type: 'filesystem_check', verified: true }]
            });
            
            this.runTest('Valid claim validation', () => {
                return validationResult && validationResult.isValid !== false && validationResult.confidence >= 0.5;
            });

            // Test speculative language detection
            const speculativeClaim = 'This file probably contains the main logic';
            const speculativeResult = await validator.validateClaim(speculativeClaim);
            
            this.runTest('Speculative language detection', () => {
                return speculativeResult.confidence < 0.7;
            });

            console.log('✅ Evidence validation tests completed\n');

        } catch (error) {
            this.recordFailure('Evidence Validation', error.message);
        }
    }

    // Test microsecond processing system
    async testMicrosecondProcessing() {
        console.log('⚡ Test 4: Microsecond Processing');
        console.log('--------------------------------');
        
        try {
            const MicrosecondProcessor = require('../core/microsecond-processor');
            const processor = new MicrosecondProcessor(TEST_PROJECT_ROOT);

            this.runTest('Processor initialization', () => {
                return processor !== null;
            });

            // Test instant decision making
            const testChange = {
                file: 'package.json',
                type: 'modified',
                changeType: 'content'
            };
            
            const instantDecision = processor.makeInstantDecision(testChange);
            
            this.runTest('Instant decision making', () => {
                return instantDecision.confident !== undefined && instantDecision.decision;
            });

            // Test pattern matching
            const reactChange = {
                file: 'src/components/Button.jsx',
                type: 'added',
                changeType: 'new_file'
            };
            
            const reactDecision = processor.makeInstantDecision(reactChange);
            
            this.runTest('Pattern matching for React components', () => {
                return reactDecision.decision && (
                    reactDecision.decision.includes('component') || 
                    reactDecision.decision.includes('update') ||
                    reactDecision.decision.includes('code')
                );
            });

            console.log('✅ Microsecond processing tests completed\n');
            processor.close();

        } catch (error) {
            this.recordFailure('Microsecond Processing', error.message);
        }
    }

    // Test performance monitoring
    async testPerformanceMonitoring() {
        console.log('📊 Test 5: Performance Monitoring');
        console.log('---------------------------------');
        
        try {
            const PerformanceMonitor = require('../tools/performance-monitor');
            const monitor = new PerformanceMonitor(TEST_PROJECT_ROOT);

            this.runTest('Monitor initialization', () => {
                return monitor !== null;
            });

            // Test operation recording
            monitor.recordOperation('test_operation', {
                duration: 100,
                tokensUsed: 10,
                cacheHit: true,
                confidence: 0.9
            });
            
            this.runTest('Operation recording', () => {
                return monitor.currentSession.operations.length > 0;
            });

            // Test dashboard generation
            const dashboard = monitor.getDashboard();
            
            this.runTest('Dashboard generation', () => {
                return dashboard.currentSession && dashboard.systemHealth;
            });

            console.log('✅ Performance monitoring tests completed\n');
            monitor.stop();

        } catch (error) {
            this.recordFailure('Performance Monitoring', error.message);
        }
    }

    // Test end-to-end ultra-efficient workflow
    async testUltraEfficientWorkflow() {
        console.log('🔄 Test 6: Ultra-Efficient Workflow');
        console.log('----------------------------------');
        
        try {
            const AutoDocumentationV2 = require('../core/auto-documentation-v2');
            const system = new AutoDocumentationV2(TEST_PROJECT_ROOT);

            // Run the system in test mode
            const result = await system.run({ test: true });
            
            this.runTest('Workflow execution', () => {
                return result && result.performance;
            });

            this.runTest('Token efficiency', () => {
                const tokensUsed = result.performance.tokensUsed || 0;
                return tokensUsed < 500; // Should be very efficient
            });

            this.runTest('Processing speed', () => {
                const totalTime = parseFloat(result.performance.totalTime) || 0;
                return totalTime < 5000; // Should be under 5 seconds
            });

            // Test system status
            const status = await system.getSystemStatus();
            
            this.runTest('System status generation', () => {
                return status.systemHealth && status.performance;
            });

            console.log('✅ Ultra-efficient workflow tests completed\n');

        } catch (error) {
            this.recordFailure('Ultra-Efficient Workflow', error.message);
        }
    }

    // Test benchmark comparison
    async testBenchmarkComparison() {
        console.log('🏁 Test 7: Benchmark Comparison');
        console.log('-------------------------------');
        
        try {
            const AutoDocumentationV2 = require('../core/auto-documentation-v2');
            const system = new AutoDocumentationV2(TEST_PROJECT_ROOT);

            // Run a limited benchmark
            const benchmarkResult = await system.runBenchmark(3);
            
            this.runTest('Benchmark execution', () => {
                return benchmarkResult !== null;
            });

            if (benchmarkResult.ultraEfficient && benchmarkResult.legacy) {
                this.runTest('Performance improvement measurement', () => {
                    return benchmarkResult.comparison && 
                           parseFloat(benchmarkResult.comparison.speedImprovement) > 0;
                });
            }

            console.log('✅ Benchmark comparison tests completed\n');

        } catch (error) {
            this.recordFailure('Benchmark Comparison', error.message);
        }
    }

    // Run individual test with error handling
    runTest(testName, testFunction) {
        this.testResults.total++;
        
        try {
            const result = testFunction();
            if (result) {
                this.testResults.passed++;
                console.log(`  ✅ ${testName}`);
            } else {
                this.testResults.failed++;
                console.log(`  ❌ ${testName} - Test failed`);
                this.testResults.errors.push(`${testName}: Test returned false`);
            }
        } catch (error) {
            this.testResults.failed++;
            console.log(`  ❌ ${testName} - Error: ${error.message}`);
            this.testResults.errors.push(`${testName}: ${error.message}`);
        }
    }

    // Record test failure
    recordFailure(testCategory, errorMessage) {
        this.testResults.failed++;
        this.testResults.total++;
        console.log(`  ❌ ${testCategory} - ${errorMessage}\n`);
        this.testResults.errors.push(`${testCategory}: ${errorMessage}`);
    }

    // Generate comprehensive test report
    generateTestReport() {
        console.log('📋 Test Results Summary');
        console.log('======================');
        console.log(`Total Tests: ${this.testResults.total}`);
        console.log(`Passed: ${this.testResults.passed}`);
        console.log(`Failed: ${this.testResults.failed}`);
        console.log(`Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%\n`);

        if (this.testResults.failed > 0) {
            console.log('❌ Failed Tests:');
            this.testResults.errors.forEach(error => {
                console.log(`  - ${error}`);
            });
            console.log();
        }

        // Overall assessment
        if (this.testResults.failed === 0) {
            console.log('🎉 All tests passed! The ultra-efficient system is working correctly.');
        } else if (this.testResults.failed <= 2) {
            console.log('⚠️  Most tests passed, but some issues detected. System is mostly functional.');
        } else {
            console.log('❌ Multiple tests failed. System requires fixes before use.');
        }

        // Cleanup test environment
        this.cleanup();
    }

    // Clean up test files
    cleanup() {
        try {
            if (fs.existsSync(TEST_PROJECT_ROOT)) {
                fs.rmSync(TEST_PROJECT_ROOT, { recursive: true, force: true });
                console.log('\n🧹 Test environment cleaned up');
            }
        } catch (error) {
            console.log(`\n⚠️  Cleanup warning: ${error.message}`);
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new UltraEfficientTester();
    tester.runTests().catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = UltraEfficientTester;