#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Performance Monitor
 * Real-time performance monitoring and optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceMonitor {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.cacheDir = path.join(projectRoot, '.superclaude-cache');
        this.metricsPath = path.join(this.cacheDir, 'performance-metrics.json');
        this.reportsPath = path.join(this.cacheDir, 'performance-reports');
        
        this.currentSession = {
            startTime: Date.now(),
            operations: [],
            totalTokens: 0,
            totalTime: 0,
            cacheHits: 0,
            cacheMisses: 0,
            validationsPassed: 0,
            validationsFailed: 0,
            hallucinationsPrevented: 0
        };

        this.initializeMonitor();
    }

    // Initialize performance monitoring system
    initializeMonitor() {
        // Ensure directories exist
        if (!fs.existsSync(this.reportsPath)) {
            fs.mkdirSync(this.reportsPath, { recursive: true });
        }

        // Load historical metrics
        this.loadHistoricalMetrics();
        
        // Start monitoring
        this.startContinuousMonitoring();
    }

    // Load historical performance metrics
    loadHistoricalMetrics() {
        if (fs.existsSync(this.metricsPath)) {
            try {
                this.historicalMetrics = JSON.parse(fs.readFileSync(this.metricsPath, 'utf8'));
            } catch (error) {
                this.historicalMetrics = this.createDefaultMetrics();
            }
        } else {
            this.historicalMetrics = this.createDefaultMetrics();
        }
    }

    // Create default metrics structure
    createDefaultMetrics() {
        return {
            sessions: [],
            aggregated: {
                totalOperations: 0,
                averageTokensPerOperation: 0,
                averageTimePerOperation: 0,
                overallCacheHitRate: 0,
                totalTokensSaved: 0,
                totalTimeSaved: 0,
                hallucinationPreventionRate: 0
            },
            trends: {
                tokenUsage: [],
                processingTime: [],
                cachePerformance: [],
                qualityMetrics: []
            },
            optimizations: {
                applied: [],
                recommendations: []
            }
        };
    }

    // Start continuous monitoring
    startContinuousMonitoring() {
        // Monitor system resources every 30 seconds
        this.monitoringInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, 30000);

        // Generate reports every 5 minutes
        this.reportingInterval = setInterval(() => {
            this.generatePerformanceReport();
        }, 300000);
    }

    // Record operation performance
    recordOperation(operationType, metrics) {
        const operation = {
            type: operationType,
            timestamp: Date.now(),
            duration: metrics.duration || 0,
            tokensUsed: metrics.tokensUsed || 0,
            cacheHit: metrics.cacheHit || false,
            confidence: metrics.confidence || 0,
            validationPassed: metrics.validationPassed !== false,
            hallucinationPrevented: metrics.hallucinationPrevented || false,
            memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // MB
            cpuTime: process.cpuUsage().user / 1000 // milliseconds
        };

        this.currentSession.operations.push(operation);
        this.updateSessionAggregates(operation);
        
        // Real-time optimization suggestions
        this.checkForOptimizationOpportunities(operation);
    }

    // Update session aggregates
    updateSessionAggregates(operation) {
        this.currentSession.totalTokens += operation.tokensUsed;
        this.currentSession.totalTime += operation.duration;
        
        if (operation.cacheHit) {
            this.currentSession.cacheHits++;
        } else {
            this.currentSession.cacheMisses++;
        }

        if (operation.validationPassed) {
            this.currentSession.validationsPassed++;
        } else {
            this.currentSession.validationsFailed++;
        }

        if (operation.hallucinationPrevented) {
            this.currentSession.hallucinationsPrevented++;
        }
    }

    // Check for real-time optimization opportunities
    checkForOptimizationOpportunities(operation) {
        const opportunities = [];

        // High token usage warning
        if (operation.tokensUsed > 100) {
            opportunities.push({
                type: 'high_token_usage',
                severity: 'warning',
                operation: operation.type,
                recommendation: 'Consider caching this decision or improving pattern matching',
                potentialSavings: `${operation.tokensUsed} tokens`
            });
        }

        // Slow operation warning
        if (operation.duration > 5000) { // 5 seconds
            opportunities.push({
                type: 'slow_operation',
                severity: 'warning',
                operation: operation.type,
                recommendation: 'Operation took longer than expected - check for bottlenecks',
                potentialSavings: `${(operation.duration / 1000).toFixed(2)} seconds`
            });
        }

        // Low confidence warning
        if (operation.confidence < 0.7) {
            opportunities.push({
                type: 'low_confidence',
                severity: 'info',
                operation: operation.type,
                recommendation: 'Consider improving pattern matching or adding more validation',
                impact: `Confidence: ${operation.confidence.toFixed(2)}`
            });
        }

        // Cache miss in repeated operations
        const recentSimilar = this.currentSession.operations
            .filter(op => op.type === operation.type)
            .slice(-5);
            
        if (recentSimilar.length >= 3 && recentSimilar.every(op => !op.cacheHit)) {
            opportunities.push({
                type: 'repeated_cache_miss',
                severity: 'warning',
                operation: operation.type,
                recommendation: 'Repeated cache misses - consider improving caching strategy',
                impact: `${recentSimilar.length} consecutive misses`
            });
        }

        // Log opportunities
        opportunities.forEach(opp => {
            console.log(`💡 Optimization opportunity: ${opp.recommendation}`);
        });

        return opportunities;
    }

    // Collect system resource metrics
    collectSystemMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();
        
        const systemMetrics = {
            timestamp: Date.now(),
            memory: {
                heapUsed: memUsage.heapUsed / 1024 / 1024, // MB
                heapTotal: memUsage.heapTotal / 1024 / 1024,
                external: memUsage.external / 1024 / 1024,
                rss: memUsage.rss / 1024 / 1024
            },
            cpu: {
                user: cpuUsage.user / 1000, // milliseconds
                system: cpuUsage.system / 1000
            },
            uptime: process.uptime()
        };

        // Check for resource issues
        this.checkResourceUsage(systemMetrics);
    }

    // Check for resource usage issues
    checkResourceUsage(metrics) {
        const warnings = [];

        // High memory usage
        if (metrics.memory.heapUsed > 500) { // 500MB
            warnings.push({
                type: 'high_memory_usage',
                severity: 'warning',
                value: `${metrics.memory.heapUsed.toFixed(2)}MB`,
                recommendation: 'Consider clearing caches or optimizing memory usage'
            });
        }

        // Memory leak detection (growing heap)
        const recentMemory = this.getRecentMetricsTrend('memory.heapUsed', 10);
        if (recentMemory.length >= 5 && this.isIncreasingTrend(recentMemory)) {
            warnings.push({
                type: 'potential_memory_leak',
                severity: 'error',
                trend: 'increasing',
                recommendation: 'Investigate potential memory leak - heap usage consistently growing'
            });
        }

        warnings.forEach(warning => {
            console.log(`⚠️  Resource warning: ${warning.recommendation}`);
        });
    }

    // Get recent metrics trend
    getRecentMetricsTrend(metricPath, count) {
        // This would access stored metrics - simplified for demo
        return [];
    }

    // Check if trend is increasing
    isIncreasingTrend(values) {
        if (values.length < 3) return false;
        
        let increasingCount = 0;
        for (let i = 1; i < values.length; i++) {
            if (values[i] > values[i-1]) {
                increasingCount++;
            }
        }
        
        return increasingCount >= values.length * 0.7; // 70% increasing
    }

    // Generate comprehensive performance report
    generatePerformanceReport() {
        const reportTimestamp = new Date().toISOString();
        const sessionDuration = Date.now() - this.currentSession.startTime;
        
        const report = {
            timestamp: reportTimestamp,
            session: {
                duration: sessionDuration,
                operations: this.currentSession.operations.length,
                averageOperationTime: this.currentSession.operations.length > 0 ?
                    this.currentSession.totalTime / this.currentSession.operations.length : 0,
                totalTokens: this.currentSession.totalTokens,
                averageTokensPerOperation: this.currentSession.operations.length > 0 ?
                    this.currentSession.totalTokens / this.currentSession.operations.length : 0
            },
            efficiency: {
                cacheHitRate: this.calculateCacheHitRate(),
                tokenSavingsRate: this.calculateTokenSavingsRate(),
                timeSavingsRate: this.calculateTimeSavingsRate(),
                hallucinationPreventionRate: this.calculateHallucinationPreventionRate()
            },
            quality: {
                validationSuccessRate: this.calculateValidationSuccessRate(),
                averageConfidence: this.calculateAverageConfidence(),
                errorRate: this.calculateErrorRate()
            },
            trends: this.analyzeTrends(),
            recommendations: this.generateRecommendations()
        };

        // Save report
        const reportPath = path.join(this.reportsPath, `report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        // Update historical metrics
        this.updateHistoricalMetrics(report);

        return report;
    }

    // Calculate cache hit rate
    calculateCacheHitRate() {
        const total = this.currentSession.cacheHits + this.currentSession.cacheMisses;
        return total > 0 ? (this.currentSession.cacheHits / total) * 100 : 0;
    }

    // Calculate token savings rate compared to baseline
    calculateTokenSavingsRate() {
        const baselineTokensPerOperation = 50; // Estimated baseline
        const actualTokensPerOperation = this.currentSession.operations.length > 0 ?
            this.currentSession.totalTokens / this.currentSession.operations.length : 0;
        
        if (actualTokensPerOperation === 0) return 0;
        
        const savingsRate = Math.max(0, (1 - actualTokensPerOperation / baselineTokensPerOperation) * 100);
        return savingsRate;
    }

    // Calculate time savings rate
    calculateTimeSavingsRate() {
        const baselineTimePerOperation = 10000; // 10 seconds baseline
        const actualTimePerOperation = this.currentSession.operations.length > 0 ?
            this.currentSession.totalTime / this.currentSession.operations.length : 0;
        
        if (actualTimePerOperation === 0) return 0;
        
        const savingsRate = Math.max(0, (1 - actualTimePerOperation / baselineTimePerOperation) * 100);
        return savingsRate;
    }

    // Calculate hallucination prevention rate
    calculateHallucinationPreventionRate() {
        const totalOperations = this.currentSession.operations.length;
        return totalOperations > 0 ? 
            (this.currentSession.hallucinationsPrevented / totalOperations) * 100 : 0;
    }

    // Calculate validation success rate
    calculateValidationSuccessRate() {
        const totalValidations = this.currentSession.validationsPassed + this.currentSession.validationsFailed;
        return totalValidations > 0 ? 
            (this.currentSession.validationsPassed / totalValidations) * 100 : 0;
    }

    // Calculate average confidence
    calculateAverageConfidence() {
        const operations = this.currentSession.operations;
        if (operations.length === 0) return 0;
        
        const totalConfidence = operations.reduce((sum, op) => sum + (op.confidence || 0), 0);
        return totalConfidence / operations.length;
    }

    // Calculate error rate
    calculateErrorRate() {
        const operations = this.currentSession.operations;
        if (operations.length === 0) return 0;
        
        const errors = operations.filter(op => !op.validationPassed).length;
        return (errors / operations.length) * 100;
    }

    // Analyze performance trends
    analyzeTrends() {
        const operations = this.currentSession.operations;
        if (operations.length < 5) return { insufficient_data: true };

        const recent = operations.slice(-10);
        const older = operations.slice(0, -10);

        return {
            tokenUsage: {
                recent: recent.reduce((sum, op) => sum + op.tokensUsed, 0) / recent.length,
                older: older.length > 0 ? older.reduce((sum, op) => sum + op.tokensUsed, 0) / older.length : 0,
                trend: this.determineTrend('tokens')
            },
            processingTime: {
                recent: recent.reduce((sum, op) => sum + op.duration, 0) / recent.length,
                older: older.length > 0 ? older.reduce((sum, op) => sum + op.duration, 0) / older.length : 0,
                trend: this.determineTrend('time')
            },
            confidence: {
                recent: recent.reduce((sum, op) => sum + (op.confidence || 0), 0) / recent.length,
                older: older.length > 0 ? older.reduce((sum, op) => sum + (op.confidence || 0), 0) / older.length : 0,
                trend: this.determineTrend('confidence')
            }
        };
    }

    // Determine trend direction
    determineTrend(metric) {
        // Simplified trend analysis
        const operations = this.currentSession.operations;
        if (operations.length < 10) return 'stable';

        const recent = operations.slice(-5);
        const previous = operations.slice(-10, -5);

        let recentAvg, previousAvg;

        switch (metric) {
            case 'tokens':
                recentAvg = recent.reduce((sum, op) => sum + op.tokensUsed, 0) / recent.length;
                previousAvg = previous.reduce((sum, op) => sum + op.tokensUsed, 0) / previous.length;
                break;
            case 'time':
                recentAvg = recent.reduce((sum, op) => sum + op.duration, 0) / recent.length;
                previousAvg = previous.reduce((sum, op) => sum + op.duration, 0) / previous.length;
                break;
            case 'confidence':
                recentAvg = recent.reduce((sum, op) => sum + (op.confidence || 0), 0) / recent.length;
                previousAvg = previous.reduce((sum, op) => sum + (op.confidence || 0), 0) / previous.length;
                break;
            default:
                return 'unknown';
        }

        const difference = (recentAvg - previousAvg) / previousAvg;
        
        if (Math.abs(difference) < 0.05) return 'stable';
        return difference > 0 ? 'increasing' : 'decreasing';
    }

    // Generate optimization recommendations
    generateRecommendations() {
        const recommendations = [];
        const operations = this.currentSession.operations;

        // Cache optimization
        const cacheHitRate = this.calculateCacheHitRate();
        if (cacheHitRate < 60) {
            recommendations.push({
                type: 'cache_optimization',
                priority: 'high',
                description: 'Cache hit rate is below 60% - consider improving caching strategy',
                expectedImpact: 'Reduce token usage by 30-50%',
                implementation: 'Analyze frequently processed patterns and extend cache TTL'
            });
        }

        // Token usage optimization
        const avgTokens = operations.length > 0 ? 
            this.currentSession.totalTokens / operations.length : 0;
        if (avgTokens > 20) {
            recommendations.push({
                type: 'token_reduction',
                priority: 'medium',
                description: 'Average token usage per operation is high',
                expectedImpact: 'Reduce costs by 40-60%',
                implementation: 'Improve pattern matching and heuristic decision making'
            });
        }

        // Performance optimization
        const avgTime = operations.length > 0 ? 
            this.currentSession.totalTime / operations.length : 0;
        if (avgTime > 3000) { // 3 seconds
            recommendations.push({
                type: 'performance_optimization',
                priority: 'medium',
                description: 'Average processing time is above target',
                expectedImpact: 'Improve response time by 50-70%',
                implementation: 'Optimize file I/O and parallel processing'
            });
        }

        // Quality improvement
        const validationRate = this.calculateValidationSuccessRate();
        if (validationRate < 95) {
            recommendations.push({
                type: 'quality_improvement',
                priority: 'high',
                description: 'Validation success rate is below 95%',
                expectedImpact: 'Reduce errors and improve reliability',
                implementation: 'Enhance validation rules and evidence collection'
            });
        }

        return recommendations;
    }

    // Update historical metrics
    updateHistoricalMetrics(currentReport) {
        // Add current session to history
        this.historicalMetrics.sessions.push({
            timestamp: currentReport.timestamp,
            operations: currentReport.session.operations,
            efficiency: currentReport.efficiency,
            quality: currentReport.quality
        });

        // Keep only last 100 sessions
        if (this.historicalMetrics.sessions.length > 100) {
            this.historicalMetrics.sessions = this.historicalMetrics.sessions.slice(-100);
        }

        // Update aggregated metrics
        this.updateAggregatedMetrics();

        // Save to disk
        fs.writeFileSync(this.metricsPath, JSON.stringify(this.historicalMetrics, null, 2));
    }

    // Update aggregated metrics
    updateAggregatedMetrics() {
        const sessions = this.historicalMetrics.sessions;
        if (sessions.length === 0) return;

        const totals = sessions.reduce((acc, session) => {
            acc.operations += session.operations;
            acc.cacheHitRate += session.efficiency.cacheHitRate;
            acc.validationRate += session.quality.validationSuccessRate;
            return acc;
        }, { operations: 0, cacheHitRate: 0, validationRate: 0 });

        this.historicalMetrics.aggregated = {
            totalOperations: totals.operations,
            averageCacheHitRate: totals.cacheHitRate / sessions.length,
            averageValidationRate: totals.validationRate / sessions.length,
            totalSessions: sessions.length,
            lastUpdated: Date.now()
        };
    }

    // Get real-time performance dashboard
    getDashboard() {
        return {
            currentSession: {
                uptime: Date.now() - this.currentSession.startTime,
                operations: this.currentSession.operations.length,
                cacheHitRate: this.calculateCacheHitRate(),
                validationRate: this.calculateValidationSuccessRate(),
                averageConfidence: this.calculateAverageConfidence()
            },
            recentPerformance: {
                lastHour: this.getLastHourMetrics(),
                last24Hours: this.getLast24HourMetrics()
            },
            systemHealth: {
                memory: process.memoryUsage().heapUsed / 1024 / 1024,
                uptime: process.uptime(),
                status: this.getSystemHealthStatus()
            }
        };
    }

    // Get last hour metrics
    getLastHourMetrics() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const recentOps = this.currentSession.operations.filter(op => op.timestamp > oneHourAgo);
        
        return {
            operations: recentOps.length,
            totalTokens: recentOps.reduce((sum, op) => sum + op.tokensUsed, 0),
            averageTime: recentOps.length > 0 ? 
                recentOps.reduce((sum, op) => sum + op.duration, 0) / recentOps.length : 0
        };
    }

    // Get last 24 hour metrics
    getLast24HourMetrics() {
        // Would access historical data - simplified for demo
        return {
            operations: this.currentSession.operations.length,
            totalTokens: this.currentSession.totalTokens,
            averageTime: this.currentSession.operations.length > 0 ?
                this.currentSession.totalTime / this.currentSession.operations.length : 0
        };
    }

    // Get system health status
    getSystemHealthStatus() {
        const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
        const cacheHitRate = this.calculateCacheHitRate();
        const validationRate = this.calculateValidationSuccessRate();

        if (memUsage > 500 || cacheHitRate < 50 || validationRate < 90) {
            return 'warning';
        }

        if (memUsage > 1000 || cacheHitRate < 30 || validationRate < 80) {
            return 'critical';
        }

        return 'healthy';
    }

    // Stop monitoring
    stop() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        if (this.reportingInterval) {
            clearInterval(this.reportingInterval);
        }

        // Generate final report
        const finalReport = this.generatePerformanceReport();
        console.log('📊 Final performance report generated');
        
        return finalReport;
    }
}

module.exports = PerformanceMonitor;