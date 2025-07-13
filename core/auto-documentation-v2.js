#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Ultra-Efficient Main Engine
 * Integration layer combining all optimization systems with fallback support
 */

const UltraEfficientEngine = require('./ultra-efficient-engine');
const UniversalAutoDocumentationSystem = require('./auto-documentation');
const PerformanceMonitor = require('../tools/performance-monitor');
const fs = require('fs');
const path = require('path');

class AutoDocumentationV2 {
    constructor(projectRoot = process.cwd(), configFile = null) {
        this.projectRoot = projectRoot;
        this.configFile = configFile;
        
        // Initialize systems
        this.ultraEngine = new UltraEfficientEngine(projectRoot, configFile);
        this.legacySystem = new UniversalAutoDocumentationSystem(projectRoot, configFile);
        this.monitor = new PerformanceMonitor(projectRoot);
        
        // Configuration
        this.config = this.loadConfiguration();
        this.fallbackThreshold = 3; // Number of failures before fallback
        this.currentFailures = 0;
        
        this.initializeSystem();
    }

    // Load system configuration
    loadConfiguration() {
        const defaultConfig = {
            mode: 'ultra-efficient', // 'ultra-efficient' | 'legacy' | 'hybrid'
            enableMonitoring: true,
            enableCaching: true,
            enableValidation: true,
            tokenBudget: 500, // Maximum tokens per operation
            timeBudget: 5000, // Maximum time per operation (ms)
            confidenceThreshold: 0.7,
            fallbackOnError: true,
            performanceReporting: true
        };

        // Try to load custom configuration
        const configPath = path.join(this.projectRoot, '.superclaude.yml');
        if (fs.existsSync(configPath)) {
            try {
                const yaml = require('js-yaml');
                const customConfig = yaml.load(fs.readFileSync(configPath, 'utf8'));
                return { ...defaultConfig, ...(customConfig.ultraEfficient || {}) };
            } catch (error) {
                console.log('⚠️  Using default configuration due to config error');
            }
        }

        return defaultConfig;
    }

    // Initialize the system
    initializeSystem() {
        console.log('🚀 SuperClaude Auto-Documentation Framework v2.0');
        console.log('================================================');
        console.log(`Mode: ${this.config.mode}`);
        console.log(`Monitoring: ${this.config.enableMonitoring ? 'Enabled' : 'Disabled'}`);
        console.log(`Token Budget: ${this.config.tokenBudget}`);
        console.log(`Time Budget: ${this.config.timeBudget}ms`);
        console.log(`Confidence Threshold: ${this.config.confidenceThreshold}\n`);
    }

    // Main execution method with intelligent system selection
    async run(options = {}) {
        const operationStart = Date.now();
        
        try {
            // Choose execution strategy based on configuration and history
            const strategy = this.selectExecutionStrategy();
            console.log(`📊 Execution strategy: ${strategy}\n`);

            let result;
            switch (strategy) {
                case 'ultra-efficient':
                    result = await this.runUltraEfficient(options);
                    break;
                case 'hybrid':
                    result = await this.runHybrid(options);
                    break;
                case 'legacy':
                    result = await this.runLegacy(options);
                    break;
                default:
                    result = await this.runUltraEfficient(options);
            }

            // Record successful operation
            this.currentFailures = 0;
            
            const operationTime = Date.now() - operationStart;
            if (this.config.enableMonitoring) {
                this.monitor.recordOperation('main_run', {
                    duration: operationTime,
                    tokensUsed: result.performance?.tokensUsed || 0,
                    confidence: result.quality?.confidenceAverage || 0.8,
                    validationPassed: true,
                    strategy
                });
            }

            return result;

        } catch (error) {
            this.currentFailures++;
            console.error(`❌ Operation failed (${this.currentFailures}/${this.fallbackThreshold}):`, error.message);
            
            // Attempt fallback if enabled and not already at max failures
            if (this.config.fallbackOnError && this.currentFailures < this.fallbackThreshold) {
                console.log('🔄 Attempting fallback to legacy system...');
                return await this.runLegacy(options);
            } else {
                throw error;
            }
        }
    }

    // Select optimal execution strategy
    selectExecutionStrategy() {
        // Force specific mode if configured
        if (this.config.mode !== 'auto') {
            return this.config.mode;
        }

        // Auto-selection based on performance history and system state
        const recentPerformance = this.monitor.getDashboard();
        
        // Use ultra-efficient if system is healthy
        if (recentPerformance.systemHealth.status === 'healthy' && this.currentFailures === 0) {
            return 'ultra-efficient';
        }
        
        // Use hybrid if there are some issues
        if (recentPerformance.systemHealth.status === 'warning' || this.currentFailures > 0) {
            return 'hybrid';
        }
        
        // Fall back to legacy for critical issues
        return 'legacy';
    }

    // Run ultra-efficient engine
    async runUltraEfficient(options) {
        console.log('⚡ Running ultra-efficient engine...');
        
        const startTime = Date.now();
        const result = await this.ultraEngine.run(options);
        const endTime = Date.now();
        
        // Validate results meet quality standards
        if (!this.validateResults(result)) {
            throw new Error('Ultra-efficient results failed quality validation');
        }
        
        console.log(`✅ Ultra-efficient execution completed in ${endTime - startTime}ms`);
        return {
            ...result,
            strategy: 'ultra-efficient',
            executionTime: endTime - startTime
        };
    }

    // Run hybrid mode (ultra-efficient with legacy backup)
    async runHybrid(options) {
        console.log('🔀 Running hybrid mode...');
        
        try {
            // Try ultra-efficient first
            const ultraResult = await this.ultraEngine.run(options);
            
            // If results are high-confidence, use them
            if (this.validateResults(ultraResult) && 
                parseFloat(ultraResult.quality?.confidenceAverage || 0) >= this.config.confidenceThreshold) {
                console.log('✅ Ultra-efficient results accepted');
                return {
                    ...ultraResult,
                    strategy: 'hybrid-ultra',
                    fallbackUsed: false
                };
            }
            
            // Otherwise, use legacy for verification
            console.log('🔄 Low confidence results, using legacy verification...');
            const legacyResult = await this.legacySystem.run();
            
            return {
                ...legacyResult,
                strategy: 'hybrid-legacy',
                fallbackUsed: true,
                ultraResults: ultraResult
            };
            
        } catch (error) {
            console.log('🔄 Ultra-efficient failed, falling back to legacy...');
            const legacyResult = await this.legacySystem.run();
            
            return {
                ...legacyResult,
                strategy: 'hybrid-fallback',
                fallbackUsed: true,
                error: error.message
            };
        }
    }

    // Run legacy system
    async runLegacy(options) {
        console.log('🔄 Running legacy system...');
        
        const startTime = Date.now();
        const result = await this.legacySystem.run();
        const endTime = Date.now();
        
        console.log(`✅ Legacy execution completed in ${endTime - startTime}ms`);
        return {
            ...result,
            strategy: 'legacy',
            executionTime: endTime - startTime
        };
    }

    // Validate results meet quality standards
    validateResults(result) {
        if (!result) return false;
        
        // Check if performance metrics exist
        if (!result.performance) return false;
        
        // Check token budget
        if (result.performance.tokensUsed > this.config.tokenBudget) {
            console.log(`⚠️  Token budget exceeded: ${result.performance.tokensUsed}/${this.config.tokenBudget}`);
            return false;
        }
        
        // Check time budget
        if (result.performance.totalTime && 
            parseFloat(result.performance.totalTime) > this.config.timeBudget) {
            console.log(`⚠️  Time budget exceeded: ${result.performance.totalTime}ms/${this.config.timeBudget}ms`);
            return false;
        }
        
        // Check confidence threshold
        const confidence = parseFloat(result.quality?.confidenceAverage || 0);
        if (confidence < this.config.confidenceThreshold) {
            console.log(`⚠️  Confidence below threshold: ${confidence}/${this.config.confidenceThreshold}`);
            return false;
        }
        
        return true;
    }

    // Get comprehensive system status
    async getSystemStatus() {
        const dashboard = this.monitor.getDashboard();
        const cacheStats = await this.ultraEngine.cache.getCacheStats();
        const validationStats = this.ultraEngine.validator.getValidationStats();
        
        return {
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            mode: this.config.mode,
            systemHealth: dashboard.systemHealth.status,
            performance: {
                currentSession: dashboard.currentSession,
                recentPerformance: dashboard.recentPerformance
            },
            cache: {
                stats: cacheStats,
                hitRate: dashboard.currentSession.cacheHitRate
            },
            validation: {
                stats: validationStats,
                successRate: dashboard.currentSession.validationRate
            },
            efficiency: {
                tokenBudgetUtilization: `${dashboard.currentSession.operations * 20}/${this.config.tokenBudget}`,
                averageProcessingTime: dashboard.recentPerformance.lastHour.averageTime,
                costEfficiency: this.calculateCostEfficiency(dashboard)
            },
            reliability: {
                consecutiveFailures: this.currentFailures,
                fallbackThreshold: this.fallbackThreshold,
                systemStability: this.currentFailures === 0 ? 'stable' : 'unstable'
            }
        };
    }

    // Calculate cost efficiency metrics
    calculateCostEfficiency(dashboard) {
        const operations = dashboard.currentSession.operations;
        const tokensUsed = operations * 20; // Estimated
        const baselineCost = operations * 0.10; // $0.10 per operation baseline
        const actualCost = (tokensUsed / 1000) * 0.002; // Rough estimate
        
        return {
            estimatedCost: `$${actualCost.toFixed(4)}`,
            baselineCost: `$${baselineCost.toFixed(4)}`,
            savings: `$${Math.max(0, baselineCost - actualCost).toFixed(4)}`,
            efficiency: operations > 0 ? `${((1 - actualCost/baselineCost) * 100).toFixed(1)}%` : '0%'
        };
    }

    // Run performance benchmark
    async runBenchmark(testOperations = 10) {
        console.log(`🏃 Running performance benchmark (${testOperations} operations)...\n`);
        
        const benchmarkResults = {
            ultraEfficient: null,
            legacy: null,
            comparison: null
        };

        // Benchmark ultra-efficient engine
        try {
            const ultraStart = Date.now();
            for (let i = 0; i < testOperations; i++) {
                await this.ultraEngine.run({ benchmark: true });
            }
            const ultraEnd = Date.now();
            
            benchmarkResults.ultraEfficient = {
                totalTime: ultraEnd - ultraStart,
                averageTime: (ultraEnd - ultraStart) / testOperations,
                operationsPerSecond: (testOperations / (ultraEnd - ultraStart)) * 1000
            };
            
            console.log(`⚡ Ultra-efficient: ${benchmarkResults.ultraEfficient.averageTime.toFixed(2)}ms avg`);
        } catch (error) {
            console.log(`❌ Ultra-efficient benchmark failed: ${error.message}`);
        }

        // Benchmark legacy system
        try {
            const legacyStart = Date.now();
            for (let i = 0; i < testOperations; i++) {
                await this.legacySystem.run();
            }
            const legacyEnd = Date.now();
            
            benchmarkResults.legacy = {
                totalTime: legacyEnd - legacyStart,
                averageTime: (legacyEnd - legacyStart) / testOperations,
                operationsPerSecond: (testOperations / (legacyEnd - legacyStart)) * 1000
            };
            
            console.log(`🐢 Legacy: ${benchmarkResults.legacy.averageTime.toFixed(2)}ms avg`);
        } catch (error) {
            console.log(`❌ Legacy benchmark failed: ${error.message}`);
        }

        // Calculate comparison
        if (benchmarkResults.ultraEfficient && benchmarkResults.legacy) {
            const speedImprovement = ((benchmarkResults.legacy.averageTime - benchmarkResults.ultraEfficient.averageTime) / benchmarkResults.legacy.averageTime) * 100;
            
            benchmarkResults.comparison = {
                speedImprovement: `${speedImprovement.toFixed(1)}%`,
                timesRelation: `${(benchmarkResults.legacy.averageTime / benchmarkResults.ultraEfficient.averageTime).toFixed(1)}x faster`,
                efficiency: speedImprovement > 50 ? 'excellent' : speedImprovement > 20 ? 'good' : 'marginal'
            };
            
            console.log(`\n📊 Performance improvement: ${benchmarkResults.comparison.speedImprovement} (${benchmarkResults.comparison.timesRelation})`);
        }

        return benchmarkResults;
    }

    // Generate comprehensive report
    async generateReport() {
        console.log('📊 Generating comprehensive system report...\n');
        
        const systemStatus = await this.getSystemStatus();
        const performanceReport = this.monitor.generatePerformanceReport();
        
        const report = {
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            framework: 'SuperClaude Auto-Documentation v2.0',
            summary: {
                systemHealth: systemStatus.systemHealth,
                mode: systemStatus.mode,
                efficiency: systemStatus.efficiency,
                reliability: systemStatus.reliability
            },
            performance: performanceReport,
            systemStatus,
            recommendations: this.generateOptimizationRecommendations(systemStatus),
            nextSteps: this.generateNextSteps(systemStatus)
        };

        // Save report
        const reportsDir = path.join(this.projectRoot, '.superclaude-cache', 'comprehensive-reports');
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        const reportPath = path.join(reportsDir, `comprehensive-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`📄 Comprehensive report saved: ${reportPath}`);
        return report;
    }

    // Generate optimization recommendations
    generateOptimizationRecommendations(systemStatus) {
        const recommendations = [];
        
        // System health recommendations
        if (systemStatus.systemHealth !== 'healthy') {
            recommendations.push({
                category: 'system_health',
                priority: 'high',
                title: 'System Health Issues Detected',
                description: 'System health is not optimal - investigate resource usage',
                actions: ['Check memory usage', 'Monitor cache performance', 'Review validation rules']
            });
        }
        
        // Performance recommendations
        const avgTime = systemStatus.performance.recentPerformance.lastHour.averageTime;
        if (avgTime > 3000) {
            recommendations.push({
                category: 'performance',
                priority: 'medium',
                title: 'Processing Time Above Target',
                description: `Average processing time (${avgTime.toFixed(2)}ms) exceeds target`,
                actions: ['Optimize pattern matching', 'Improve caching strategy', 'Reduce file I/O']
            });
        }
        
        // Cost efficiency recommendations
        const efficiency = parseFloat(systemStatus.efficiency.costEfficiency.efficiency);
        if (efficiency < 70) {
            recommendations.push({
                category: 'cost',
                priority: 'medium',
                title: 'Cost Efficiency Below Target',
                description: `Cost efficiency (${efficiency}%) is below 70% target`,
                actions: ['Increase cache usage', 'Improve pattern matching', 'Reduce AI calls']
            });
        }
        
        return recommendations;
    }

    // Generate next steps
    generateNextSteps(systemStatus) {
        const steps = [];
        
        if (systemStatus.systemHealth === 'healthy' && systemStatus.reliability.systemStability === 'stable') {
            steps.push('System is operating optimally - consider expanding usage to more projects');
            steps.push('Monitor long-term trends and plan for scale-up');
        } else {
            steps.push('Address system health and reliability issues');
            steps.push('Run diagnostics to identify root causes');
        }
        
        steps.push('Review performance reports regularly');
        steps.push('Consider upgrading to latest framework version');
        
        return steps;
    }

    // Clean shutdown
    async shutdown() {
        console.log('🛑 Shutting down SuperClaude Auto-Documentation Framework v2.0...');
        
        // Generate final report
        const finalReport = await this.generateReport();
        
        // Stop monitoring
        this.monitor.stop();
        
        // Close connections
        this.ultraEngine.close();
        
        console.log('✅ Shutdown complete');
        return finalReport;
    }
}

// CLI Support
if (require.main === module) {
    const args = process.argv.slice(2);
    const projectRoot = args.find(arg => !arg.startsWith('--')) || process.cwd();
    
    async function runCLI() {
        try {
            const system = new AutoDocumentationV2(projectRoot);
            
            if (args.includes('--benchmark')) {
                console.log('🏃 Running performance benchmark...\n');
                const benchmarkResult = await system.runBenchmark(5);
                console.log('\n📊 Benchmark completed');
                
            } else if (args.includes('--status')) {
                const status = await system.getSystemStatus();
                console.log('📊 System Status:', JSON.stringify(status, null, 2));
                
            } else if (args.includes('--report')) {
                const report = await system.generateReport();
                console.log('📄 Report generated and saved');
                
            } else {
                console.log('🚀 Running ultra-efficient documentation system...\n');
                const result = await system.run();
                console.log('\n✅ Documentation update completed');
            }
            
            await system.shutdown();
            
        } catch (error) {
            console.error('❌ CLI execution failed:', error.message);
            process.exit(1);
        }
    }
    
    runCLI();
}

module.exports = AutoDocumentationV2;