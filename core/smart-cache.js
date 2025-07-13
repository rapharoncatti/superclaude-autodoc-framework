#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Smart Cache System
 * Ultra-efficient caching and state management for zero-token operations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// SQL.js as SQLite alternative (pure JavaScript, no compilation needed)
const initSqlJs = require('sql.js');
let SQL = null;

// Initialize SQL.js
initSqlJs().then(sql => {
    SQL = sql;
    console.log('✅ SQL.js initialized - SQLite functionality available');
}).catch(err => {
    console.log('ℹ️  SQL.js initialization failed, using JSON fallback:', err.message);
});

class SmartCacheSystem {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.cacheDir = path.join(projectRoot, '.superclaude-cache');
        this.dbPath = path.join(this.cacheDir, 'project-state.db');
        this.signaturesPath = path.join(this.cacheDir, 'component-signatures.json');
        this.decisionsPath = path.join(this.cacheDir, 'decision-cache.json');
        
        this.initializeCache();
        
        // Initialize SQL.js database or fallback to JSON
        if (SQL) {
            this.initializeSqlJsDatabase();
            this.useJson = false;
        } else {
            this.db = null;
            this.initializeJsonFallback();
            this.useJson = true;
        }
    }

    // Initialize cache directory structure
    initializeCache() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
        
        // Create subdirectories
        const subdirs = ['template-instances', 'validation-results', 'state-diffs'];
        subdirs.forEach(dir => {
            const dirPath = path.join(this.cacheDir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });
    }

    // Initialize JSON fallback for caching when SQLite unavailable
    initializeJsonFallback() {
        this.jsonCache = {
            fileStates: {},
            decisionCache: {},
            validationResults: {},
            performanceMetrics: []
        };
        
        // Load existing JSON cache if it exists
        const jsonCachePath = path.join(this.cacheDir, 'cache-fallback.json');
        if (fs.existsSync(jsonCachePath)) {
            try {
                this.jsonCache = JSON.parse(fs.readFileSync(jsonCachePath, 'utf8'));
            } catch (error) {
                console.log('ℹ️  Creating new JSON cache');
            }
        }
        
        this.jsonCachePath = jsonCachePath;
    }

    // Initialize SQL.js database for fast project state
    initializeSqlJsDatabase() {
        try {
            // Load existing database file or create new one
            let data;
            if (fs.existsSync(this.dbPath)) {
                data = fs.readFileSync(this.dbPath);
                this.db = new SQL.Database(data);
            } else {
                this.db = new SQL.Database();
            }
            
            this.initializeSchema();
            console.log('✅ SQL.js database initialized');
        } catch (error) {
            console.log('❌ SQL.js database initialization failed:', error.message);
            this.db = null;
            this.initializeJsonFallback();
            this.useJson = true;
        }
    }

    // Initialize database schema
    initializeSchema() {
        const schema = `
            CREATE TABLE IF NOT EXISTS file_states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                file_path TEXT UNIQUE,
                signature TEXT,
                last_modified INTEGER,
                file_type TEXT,
                analysis_result TEXT,
                last_analyzed INTEGER,
                change_count INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS decision_cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                context_hash TEXT UNIQUE,
                decision TEXT,
                rationale TEXT,
                confidence REAL,
                created_at INTEGER,
                expires_at INTEGER,
                hit_count INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS validation_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                validation_type TEXT,
                target_hash TEXT,
                result TEXT,
                evidence TEXT,
                created_at INTEGER,
                is_valid BOOLEAN
            );

            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                operation_type TEXT,
                tokens_used INTEGER,
                processing_time REAL,
                cache_hit_ratio REAL,
                created_at INTEGER
            );

            CREATE INDEX IF NOT EXISTS idx_file_path ON file_states(file_path);
            CREATE INDEX IF NOT EXISTS idx_context_hash ON decision_cache(context_hash);
            CREATE INDEX IF NOT EXISTS idx_validation_type ON validation_results(validation_type);
            CREATE INDEX IF NOT EXISTS idx_created_at ON performance_metrics(created_at);
        `;

        try {
            this.db.exec(schema);
            console.log('✅ Database schema initialized');
        } catch (error) {
            console.log('❌ Schema initialization failed:', error.message);
        }
    }

    // Save SQL.js database to file
    saveSqlJsDatabase() {
        if (this.db && !this.useJson) {
            try {
                const data = this.db.export();
                fs.writeFileSync(this.dbPath, data);
            } catch (error) {
                console.log('❌ Failed to save database:', error.message);
            }
        }
    }

    // Helper function to map SQL.js row data to object
    mapRowToObject(columns, values) {
        const obj = {};
        for (let i = 0; i < columns.length; i++) {
            obj[columns[i]] = values[i];
        }
        return obj;
    }

    // Generate ultra-fast file signature using SHA-256 + metadata
    generateFileSignature(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Create signature from content hash + size + mtime
            const contentHash = crypto.createHash('sha256').update(content).digest('hex');
            const signature = `${contentHash}-${stats.size}-${stats.mtimeMs}`;
            
            return {
                signature,
                size: stats.size,
                mtime: stats.mtimeMs,
                lines: content.split('\n').length,
                contentHash
            };
        } catch (error) {
            return null;
        }
    }

    // Microsecond change detection using signatures
    async detectChanges(filePaths) {
        const changes = [];
        const currentSignatures = {};
        
        // Load existing signatures
        let existingSignatures = {};
        if (fs.existsSync(this.signaturesPath)) {
            try {
                existingSignatures = JSON.parse(fs.readFileSync(this.signaturesPath, 'utf8'));
            } catch (error) {
                existingSignatures = {};
            }
        }

        // Check each file for changes
        for (const filePath of filePaths) {
            const relativePath = path.relative(this.projectRoot, filePath);
            const currentSig = this.generateFileSignature(filePath);
            
            if (!currentSig) continue;
            
            currentSignatures[relativePath] = currentSig;
            const existingSig = existingSignatures[relativePath];
            
            // Detect change type
            if (!existingSig) {
                changes.push({
                    type: 'added',
                    file: relativePath,
                    signature: currentSig.signature,
                    metadata: currentSig
                });
            } else if (existingSig.signature !== currentSig.signature) {
                changes.push({
                    type: 'modified',
                    file: relativePath,
                    oldSignature: existingSig.signature,
                    newSignature: currentSig.signature,
                    metadata: currentSig,
                    changeType: this.analyzeChangeType(existingSig, currentSig)
                });
            }
        }

        // Check for deleted files
        for (const relativePath of Object.keys(existingSignatures)) {
            const fullPath = path.join(this.projectRoot, relativePath);
            if (!fs.existsSync(fullPath)) {
                changes.push({
                    type: 'deleted',
                    file: relativePath,
                    signature: existingSignatures[relativePath].signature
                });
                delete currentSignatures[relativePath];
            }
        }

        // Update signatures file
        fs.writeFileSync(this.signaturesPath, JSON.stringify(currentSignatures, null, 2));
        
        return changes;
    }

    // Analyze type of change for smart processing
    analyzeChangeType(oldSig, newSig) {
        const sizeDiff = newSig.size - oldSig.size;
        const linesDiff = newSig.lines - oldSig.lines;
        
        if (Math.abs(sizeDiff) < 100 && Math.abs(linesDiff) < 5) {
            return 'minor'; // Small changes - quick processing
        } else if (sizeDiff > 1000 || linesDiff > 50) {
            return 'major'; // Large changes - full analysis
        } else {
            return 'moderate'; // Medium changes - targeted analysis
        }
    }

    // Cache decision with TTL and confidence scoring
    async cacheDecision(contextHash, decision, rationale, confidence = 0.9, ttlHours = 24) {
        const now = Date.now();
        const expiresAt = now + (ttlHours * 60 * 60 * 1000);
        
        if (this.useJson) {
            // JSON fallback
            const existing = this.jsonCache.decisionCache[contextHash] || {};
            this.jsonCache.decisionCache[contextHash] = {
                decision,
                rationale,
                confidence,
                created_at: now,
                expires_at: expiresAt,
                hit_count: existing.hit_count || 0
            };
            this.saveJsonCache();
            return Promise.resolve(contextHash);
        }
        
        try {
            const stmt = this.db.prepare(`
                INSERT OR REPLACE INTO decision_cache 
                (context_hash, decision, rationale, confidence, created_at, expires_at, hit_count)
                VALUES (?, ?, ?, ?, ?, ?, COALESCE((SELECT hit_count FROM decision_cache WHERE context_hash = ?), 0))
            `);
            
            stmt.run([contextHash, decision, rationale, confidence, now, expiresAt, contextHash]);
            this.saveSqlJsDatabase();
            return Promise.resolve(contextHash);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Retrieve cached decision (0 tokens!)
    async getCachedDecision(contextHash) {
        const now = Date.now();
        
        if (this.useJson) {
            // JSON fallback
            const cached = this.jsonCache.decisionCache[contextHash];
            if (cached && cached.expires_at > now) {
                cached.hit_count = (cached.hit_count || 0) + 1;
                this.saveJsonCache();
                return Promise.resolve({
                    decision: cached.decision,
                    rationale: cached.rationale,
                    confidence: cached.confidence,
                    hitCount: cached.hit_count,
                    cached: true
                });
            }
            return Promise.resolve(null);
        }
        
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM decision_cache 
                WHERE context_hash = ? AND expires_at > ?
            `);
            
            const results = this.db.exec(`
                SELECT * FROM decision_cache 
                WHERE context_hash = '${contextHash}' AND expires_at > ${now}
            `);
            
            const result = results.length > 0 && results[0].values.length > 0 ? 
                this.mapRowToObject(results[0].columns, results[0].values[0]) : null;
            
            if (result) {
                // Increment hit count
                const updateStmt = this.db.prepare(`
                    UPDATE decision_cache SET hit_count = hit_count + 1 
                    WHERE context_hash = ?
                `);
                updateStmt.run([contextHash]);
                this.saveSqlJsDatabase();
                
                return Promise.resolve({
                    decision: result.decision,
                    rationale: result.rationale,
                    confidence: result.confidence,
                    hitCount: result.hit_count + 1,
                    cached: true
                });
            } else {
                return Promise.resolve(null);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // Generate context hash for decision caching
    generateContextHash(context) {
        const contextString = typeof context === 'string' ? 
            context : JSON.stringify(context, Object.keys(context).sort());
        return crypto.createHash('sha256').update(contextString).digest('hex');
    }

    // Cache template instance for reuse
    cacheTemplateInstance(templateId, context, renderedContent) {
        const instancePath = path.join(this.cacheDir, 'template-instances', `${templateId}.json`);
        const cacheData = {
            templateId,
            context,
            content: renderedContent,
            created: Date.now(),
            contextHash: this.generateContextHash(context)
        };
        
        fs.writeFileSync(instancePath, JSON.stringify(cacheData, null, 2));
        return cacheData;
    }

    // Get cached template instance
    getCachedTemplateInstance(templateId, context) {
        const instancePath = path.join(this.cacheDir, 'template-instances', `${templateId}.json`);
        
        if (!fs.existsSync(instancePath)) return null;
        
        try {
            const cacheData = JSON.parse(fs.readFileSync(instancePath, 'utf8'));
            const contextHash = this.generateContextHash(context);
            
            if (cacheData.contextHash === contextHash) {
                return cacheData.content;
            }
        } catch (error) {
            // Invalid cache file, ignore
        }
        
        return null;
    }

    // Record performance metrics for optimization
    async recordMetrics(operationType, tokensUsed, processingTime, cacheHitRatio) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO performance_metrics 
                (operation_type, tokens_used, processing_time, cache_hit_ratio, created_at)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            stmt.run([operationType, tokensUsed, processingTime, cacheHitRatio, Date.now()], 
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
            stmt.finalize();
        });
    }

    // Get performance statistics
    async getPerformanceStats(hours = 24) {
        const since = Date.now() - (hours * 60 * 60 * 1000);
        
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    operation_type,
                    COUNT(*) as operations,
                    AVG(tokens_used) as avg_tokens,
                    SUM(tokens_used) as total_tokens,
                    AVG(processing_time) as avg_time,
                    AVG(cache_hit_ratio) as avg_cache_hit_ratio
                FROM performance_metrics 
                WHERE created_at > ?
                GROUP BY operation_type
            `, [since], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Clean expired cache entries
    async cleanExpiredCache() {
        const now = Date.now();
        
        return new Promise((resolve, reject) => {
            this.db.run(`
                DELETE FROM decision_cache WHERE expires_at < ?
            `, [now], function(err) {
                if (err) reject(err);
                else {
                    console.log(`🧹 Cleaned ${this.changes} expired cache entries`);
                    resolve(this.changes);
                }
            });
        });
    }

    // Get cache statistics
    async getCacheStats() {
        if (this.useJson) {
            // JSON fallback stats
            const now = Date.now();
            const validDecisions = Object.values(this.jsonCache.decisionCache || {})
                .filter(d => d.expires_at > now);
            
            const stats = [
                {
                    cache_type: 'decisions',
                    total_entries: validDecisions.length,
                    total_hits: validDecisions.reduce((sum, d) => sum + (d.hit_count || 0), 0),
                    avg_confidence: validDecisions.length > 0 ? 
                        validDecisions.reduce((sum, d) => sum + (d.confidence || 0), 0) / validDecisions.length : 0
                },
                {
                    cache_type: 'files',
                    total_entries: Object.keys(this.jsonCache.fileStates || {}).length,
                    total_hits: 0,
                    avg_confidence: 0
                }
            ];
            
            return Promise.resolve(stats);
        }
        
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    'decisions' as cache_type,
                    COUNT(*) as total_entries,
                    SUM(hit_count) as total_hits,
                    AVG(confidence) as avg_confidence
                FROM decision_cache
                WHERE expires_at > ?
                
                UNION ALL
                
                SELECT 
                    'files' as cache_type,
                    COUNT(*) as total_entries,
                    SUM(change_count) as total_hits,
                    0 as avg_confidence
                FROM file_states
            `, [Date.now()], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Save JSON cache to disk (for fallback mode)
    saveJsonCache() {
        if (this.useJson && this.jsonCachePath) {
            try {
                fs.writeFileSync(this.jsonCachePath, JSON.stringify(this.jsonCache, null, 2));
            } catch (error) {
                console.log('⚠️  Failed to save JSON cache:', error.message);
            }
        }
    }

    // Close database connection
    close() {
        if (this.useJson) {
            this.saveJsonCache();
        } else if (this.db) {
            this.db.close();
        }
    }
}

module.exports = SmartCacheSystem;