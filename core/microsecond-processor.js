#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Microsecond Processor
 * Ultra-fast incremental processing with deterministic decision engine
 */

const fs = require('fs');
const path = require('path');
const SmartCacheSystem = require('./smart-cache');
const EvidenceBasedValidator = require('./evidence-validator');

class MicrosecondProcessor {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.cache = new SmartCacheSystem(projectRoot);
        this.validator = new EvidenceBasedValidator(projectRoot);
        
        // Load processing rules and lookup tables
        this.initializeProcessingEngine();
        this.loadDecisionTables();
    }

    // Initialize ultra-fast processing engine
    initializeProcessingEngine() {
        // Pattern matching for instant decisions (0 tokens)
        this.instantPatterns = {
            // File type detection patterns
            fileTypes: {
                'react_component': /\.jsx?$.*export\s+(default\s+)?function|class.*extends.*Component/,
                'unity_script': /\.cs$.*MonoBehaviour|using UnityEngine/,
                'api_endpoint': /\.(js|ts)$.*app\.(get|post|put|delete)|router\./,
                'database_model': /\.(js|ts|py)$.*model|schema|Model\(/,
                'test_file': /\.(test|spec)\.(js|ts|py)$|describe\(|it\(/,
                'config_file': /\.(json|yml|yaml|toml|ini)$|config/i,
                'documentation': /\.md$|readme|changelog|\.txt$/i
            },

            // Component patterns for instant classification
            components: {
                'ui_component': /button|input|form|modal|dialog|menu/i,
                'data_handler': /service|repository|dao|api|client/i,
                'business_logic': /manager|controller|handler|processor/i,
                'utility': /util|helper|tool|common/i,
                'configuration': /config|setting|constant|environment/i
            },

            // Change significance patterns
            changeSignificance: {
                'critical': /error|exception|crash|security|auth|password/i,
                'high': /api|endpoint|database|model|schema|integration/i,
                'medium': /component|function|method|class/i,
                'low': /comment|formatting|variable\s+name|log/i,
                'cosmetic': /whitespace|indent|style|prettier/i
            }
        };

        // Deterministic rules for instant decisions
        this.deterministic = {
            // File processing rules
            shouldProcess: (file) => {
                if (file.endsWith('.md') && file !== 'CLAUDE.md') return false;
                if (file.includes('node_modules/')) return false;
                if (file.includes('.git/')) return false;
                if (file.includes('build/') || file.includes('dist/')) return false;
                return true;
            },

            // Documentation section mapping
            sectionMapping: {
                'react_component': 'Component Library',
                'unity_script': 'Architecture Overview',
                'api_endpoint': 'API Documentation',
                'database_model': 'Database Schema',
                'test_file': 'Testing Strategy',
                'config_file': 'Development Setup'
            },

            // Priority assignment
            processingPriority: {
                'critical': 1,
                'high': 2,
                'medium': 3,
                'low': 4,
                'cosmetic': 5
            }
        };
    }

    // Load pre-computed decision tables for instant lookups
    loadDecisionTables() {
        const tablesPath = path.join(this.cache.cacheDir, 'decision-tables.json');
        
        if (fs.existsSync(tablesPath)) {
            try {
                this.decisionTables = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
            } catch (error) {
                this.decisionTables = this.createDefaultDecisionTables();
            }
        } else {
            this.decisionTables = this.createDefaultDecisionTables();
            this.saveDecisionTables();
        }
    }

    // Create default decision tables for common scenarios
    createDefaultDecisionTables() {
        return {
            // Common file patterns -> actions
            filePatterns: {
                'package.json': { action: 'update_dependencies', section: 'Development Setup', priority: 2 },
                'README.md': { action: 'skip', reason: 'user_managed' },
                'tsconfig.json': { action: 'update_config', section: 'Development Setup', priority: 3 },
                '.env': { action: 'security_check', section: 'Security', priority: 1 },
                'docker-compose.yml': { action: 'update_deployment', section: 'Deployment', priority: 2 }
            },

            // Function naming patterns -> descriptions
            functionPatterns: {
                'get*': 'Data retrieval function',
                'set*': 'Data modification function',
                'handle*': 'Event handler function',
                'render*': 'UI rendering function',
                'validate*': 'Validation function',
                'process*': 'Data processing function',
                'create*': 'Object creation function',
                'delete*': 'Object deletion function',
                'update*': 'Object update function'
            },

            // Class naming patterns -> purposes
            classPatterns: {
                '*Manager': 'System management and coordination',
                '*Service': 'Business logic service',
                '*Repository': 'Data access layer',
                '*Controller': 'Request handling controller',
                '*Component': 'UI component',
                '*Handler': 'Event or request handler',
                '*Util*': 'Utility class',
                '*Helper': 'Helper functions',
                '*Test': 'Test class'
            },

            // Change types -> update strategies
            changeStrategies: {
                'added_file': { tokens: 50, processing: 'full_analysis' },
                'modified_minor': { tokens: 10, processing: 'incremental' },
                'modified_major': { tokens: 30, processing: 'targeted_analysis' },
                'deleted_file': { tokens: 5, processing: 'reference_cleanup' },
                'renamed_file': { tokens: 15, processing: 'reference_update' }
            }
        };
    }

    // Process changes with microsecond decision making
    async processChanges(changes) {
        const startTime = process.hrtime.bigint();
        const results = {
            processed: [],
            skipped: [],
            errors: [],
            totalTokens: 0,
            cacheHits: 0,
            processingTime: 0
        };

        // Sort changes by priority for optimal processing
        const prioritizedChanges = this.prioritizeChanges(changes);

        for (const change of prioritizedChanges) {
            const changeResult = await this.processChange(change);
            
            if (changeResult.processed) {
                results.processed.push(changeResult);
                results.totalTokens += changeResult.tokensUsed || 0;
                
                if (changeResult.fromCache) {
                    results.cacheHits++;
                }
            } else if (changeResult.skipped) {
                results.skipped.push(changeResult);
            } else {
                results.errors.push(changeResult);
            }
        }

        const endTime = process.hrtime.bigint();
        results.processingTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

        // Record performance metrics
        await this.cache.recordMetrics(
            'change_processing',
            results.totalTokens,
            results.processingTime,
            results.cacheHits / Math.max(1, results.processed.length)
        );

        return results;
    }

    // Process single change with instant decisions where possible
    async processChange(change) {
        const changeStart = process.hrtime.bigint();
        
        try {
            // 1. Instant skip decisions (0 tokens)
            if (!this.deterministic.shouldProcess(change.file)) {
                return {
                    processed: false,
                    skipped: true,
                    reason: 'file_excluded',
                    file: change.file,
                    tokensUsed: 0
                };
            }

            // 2. Generate context hash for caching
            const contextHash = this.generateChangeContextHash(change);
            
            // 3. Check cache for instant decision (0 tokens)
            const cachedDecision = await this.cache.getCachedDecision(contextHash);
            if (cachedDecision) {
                return {
                    processed: true,
                    fromCache: true,
                    decision: cachedDecision.decision,
                    file: change.file,
                    tokensUsed: 0,
                    confidence: cachedDecision.confidence
                };
            }

            // 4. Instant pattern matching (0 tokens)
            const instantDecision = this.makeInstantDecision(change);
            if (instantDecision.confident) {
                // Cache the instant decision
                await this.cache.cacheDecision(
                    contextHash,
                    instantDecision.decision,
                    instantDecision.rationale,
                    instantDecision.confidence,
                    24 // 24 hour TTL
                );

                return {
                    processed: true,
                    fromCache: false,
                    decision: instantDecision.decision,
                    file: change.file,
                    tokensUsed: 0,
                    confidence: instantDecision.confidence,
                    method: 'pattern_matching'
                };
            }

            // 5. Incremental analysis for unknown patterns (minimal tokens)
            const analysisResult = await this.performIncrementalAnalysis(change);
            
            // Cache the analyzed decision
            await this.cache.cacheDecision(
                contextHash,
                analysisResult.decision,
                analysisResult.rationale,
                analysisResult.confidence,
                12 // 12 hour TTL for analyzed decisions
            );

            const changeEnd = process.hrtime.bigint();
            const processingTime = Number(changeEnd - changeStart) / 1000000;

            return {
                processed: true,
                fromCache: false,
                decision: analysisResult.decision,
                file: change.file,
                tokensUsed: analysisResult.tokensUsed || 20,
                confidence: analysisResult.confidence,
                method: 'incremental_analysis',
                processingTime
            };

        } catch (error) {
            return {
                processed: false,
                error: error.message,
                file: change.file,
                tokensUsed: 0
            };
        }
    }

    // Make instant decisions using pattern matching and lookup tables
    makeInstantDecision(change) {
        const file = change.file;
        const fileExt = path.extname(file);
        const fileName = path.basename(file);
        
        // 1. Check decision tables for exact matches
        if (this.decisionTables.filePatterns[fileName]) {
            const tableDecision = this.decisionTables.filePatterns[fileName];
            return {
                confident: true,
                decision: tableDecision.action,
                rationale: `Lookup table match for ${fileName}`,
                confidence: 0.95,
                section: tableDecision.section,
                priority: tableDecision.priority
            };
        }

        // 2. Pattern-based file type detection
        let fileType = 'unknown';
        let fileContent = '';
        
        try {
            if (fs.existsSync(path.join(this.projectRoot, file))) {
                fileContent = fs.readFileSync(path.join(this.projectRoot, file), 'utf8');
                
                for (const [type, pattern] of Object.entries(this.instantPatterns.fileTypes)) {
                    if (pattern.test(file + fileContent)) {
                        fileType = type;
                        break;
                    }
                }
            }
        } catch (error) {
            // File read error, use file extension only
        }

        // 3. Determine action based on file type
        if (fileType !== 'unknown') {
            const section = this.deterministic.sectionMapping[fileType] || 'Architecture Overview';
            const action = this.getActionForFileType(fileType, change);
            
            return {
                confident: true,
                decision: action,
                rationale: `Pattern match: ${fileType} -> ${action}`,
                confidence: 0.85,
                section,
                fileType
            };
        }

        // 4. Change significance analysis
        const significance = this.analyzeChangeSignificance(change, fileContent);
        if (significance !== 'unknown') {
            const priority = this.deterministic.processingPriority[significance];
            
            return {
                confident: significance === 'cosmetic', // Only confident for cosmetic changes
                decision: significance === 'cosmetic' ? 'skip' : 'analyze',
                rationale: `Change significance: ${significance}`,
                confidence: significance === 'cosmetic' ? 0.9 : 0.6,
                significance,
                priority
            };
        }

        // 5. Not confident enough for instant decision
        return {
            confident: false,
            decision: 'needs_analysis',
            rationale: 'Requires detailed analysis',
            confidence: 0.3
        };
    }

    // Get action for specific file type
    getActionForFileType(fileType, change) {
        const actionMap = {
            'react_component': 'update_component_docs',
            'unity_script': 'update_script_docs',
            'api_endpoint': 'update_api_docs',
            'database_model': 'update_schema_docs',
            'test_file': 'update_test_docs',
            'config_file': 'update_config_docs',
            'documentation': 'skip' // User-managed docs
        };

        return actionMap[fileType] || 'analyze';
    }

    // Analyze change significance using patterns
    analyzeChangeSignificance(change, content = '') {
        const combinedText = (change.file + ' ' + content).toLowerCase();
        
        for (const [significance, pattern] of Object.entries(this.instantPatterns.changeSignificance)) {
            if (pattern.test(combinedText)) {
                return significance;
            }
        }

        // Analyze change size
        if (change.metadata) {
            const { size, lines } = change.metadata;
            if (size < 50 && lines < 3) return 'cosmetic';
            if (size > 5000 || lines > 100) return 'high';
            if (size > 1000 || lines > 20) return 'medium';
        }

        return 'unknown';
    }

    // Perform minimal incremental analysis for unknown patterns
    async performIncrementalAnalysis(change) {
        // This would normally use AI, but for now use heuristics
        // In production, this would be a minimal AI call with compressed context
        
        const heuristicDecision = this.makeHeuristicDecision(change);
        
        return {
            decision: heuristicDecision.action,
            rationale: heuristicDecision.reason,
            confidence: 0.7,
            tokensUsed: 20, // Minimal AI usage
            method: 'heuristic_analysis'
        };
    }

    // Make heuristic decision without AI
    makeHeuristicDecision(change) {
        const file = change.file;
        const ext = path.extname(file);
        
        // Simple heuristics based on file extension and name
        if (['.js', '.ts', '.jsx', '.tsx'].includes(ext)) {
            return { action: 'update_code_docs', reason: 'JavaScript/TypeScript file' };
        }
        
        if (['.py'].includes(ext)) {
            return { action: 'update_code_docs', reason: 'Python file' };
        }
        
        if (['.cs'].includes(ext)) {
            return { action: 'update_unity_docs', reason: 'C# file (likely Unity)' };
        }
        
        if (['.json', '.yml', '.yaml'].includes(ext)) {
            return { action: 'update_config_docs', reason: 'Configuration file' };
        }
        
        return { action: 'minimal_update', reason: 'Unknown file type - minimal documentation' };
    }

    // Prioritize changes for optimal processing order
    prioritizeChanges(changes) {
        return changes.sort((a, b) => {
            // Critical changes first
            const aPriority = this.getChangePriority(a);
            const bPriority = this.getChangePriority(b);
            
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }
            
            // Then by change type (added files last for context)
            const typeOrder = { 'deleted': 1, 'modified': 2, 'added': 3 };
            return (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2);
        });
    }

    // Get change priority (1 = highest)
    getChangePriority(change) {
        const file = change.file.toLowerCase();
        
        // Security and critical files
        if (file.includes('auth') || file.includes('security') || file.includes('.env')) {
            return 1;
        }
        
        // API and database files
        if (file.includes('api') || file.includes('model') || file.includes('schema')) {
            return 2;
        }
        
        // Core application files
        if (file.includes('component') || file.includes('service') || file.includes('manager')) {
            return 3;
        }
        
        // Test and documentation files
        if (file.includes('test') || file.includes('.md')) {
            return 4;
        }
        
        // Everything else
        return 5;
    }

    // Generate context hash for change caching
    generateChangeContextHash(change) {
        const contextData = {
            file: change.file,
            type: change.type,
            signature: change.signature || change.newSignature,
            changeType: change.changeType
        };
        
        return this.cache.generateContextHash(contextData);
    }

    // Save decision tables for future use
    saveDecisionTables() {
        const tablesPath = path.join(this.cache.cacheDir, 'decision-tables.json');
        fs.writeFileSync(tablesPath, JSON.stringify(this.decisionTables, null, 2));
    }

    // Get processing statistics
    async getProcessingStats() {
        const cacheStats = await this.cache.getCacheStats();
        const performanceStats = await this.cache.getPerformanceStats();
        
        return {
            cache: cacheStats,
            performance: performanceStats,
            decisionTables: {
                filePatterns: Object.keys(this.decisionTables.filePatterns).length,
                functionPatterns: Object.keys(this.decisionTables.functionPatterns).length,
                classPatterns: Object.keys(this.decisionTables.classPatterns).length
            }
        };
    }

    // Clean up resources
    close() {
        this.cache.close();
    }
}

module.exports = MicrosecondProcessor;