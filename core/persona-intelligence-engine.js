#!/usr/bin/env node

/**
 * SuperClaude Persona Intelligence Engine
 * Automatically selects and switches personas based on context analysis
 * Integrates clean SuperClaude knowledge with v2.0 optimizations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PersonaIntelligenceEngine {
    constructor(options = {}) {
        this.superClaudePath = options.superClaudePath || '/media/rapharoncatti/Transfer/Repos/clean-superclaude';
        this.frameworkPath = options.frameworkPath || '/media/rapharoncatti/Transfer/Repos/superclaude-autodoc-framework';
        
        // Load SuperClaude knowledge
        this.personas = this.loadSuperClaudePersonas();
        this.intelligentActivation = this.loadIntelligentActivation();
        this.evidenceStandards = this.loadEvidenceStandards();
        
        // Initialize v2.0 components
        this.smartCache = this.initializeSmartCache();
        this.evidenceValidator = this.initializeEvidenceValidator();
        this.performanceMonitor = this.initializePerformanceMonitor();
        
        // Persona intelligence state
        this.currentPersona = null;
        this.personaHistory = [];
        this.contextAnalysisCache = new Map();
        this.learningPatterns = this.loadLearningPatterns();
        
        console.log('✅ SuperClaude Persona Intelligence Engine initialized');
        console.log(`📋 Loaded ${Object.keys(this.personas).length} personas from clean SuperClaude`);
    }

    // Load SuperClaude persona definitions
    loadSuperClaudePersonas() {
        try {
            const yaml = require('js-yaml');
            const personasPath = path.join(this.superClaudePath, '.claude/shared/superclaude-personas.yml');
            
            if (fs.existsSync(personasPath)) {
                const content = fs.readFileSync(personasPath, 'utf8');
                
                // Extract just the All_Personas section to avoid YAML duplication errors
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
                    
                    // Extract personas content
                    const personasLines = lines.slice(startIndex, endIndex);
                    
                    // Remove empty lines at the end
                    while (personasLines.length > 0 && personasLines[personasLines.length - 1].trim() === '') {
                        personasLines.pop();
                    }
                    
                    const personasContent = personasLines.join('\n');
                    
                    // Wrap in proper YAML structure by indenting all content
                    const indentedContent = personasContent.split('\n').map(line => 
                        line.trim() === '' ? '' : `  ${line}`
                    ).join('\n');
                    
                    const yamlContent = `All_Personas:\n${indentedContent}`;
                    
                    const data = yaml.load(yamlContent);
                    if (data?.All_Personas) {
                        console.log('✅ Loaded SuperClaude personas from clean repo');
                        return data.All_Personas;
                    }
                }
                
                console.log('⚠️  Could not extract All_Personas section, using fallback');
            }
        } catch (error) {
            console.log('⚠️  Could not load SuperClaude personas, using fallback:', error.message);
        }
        
        // Fallback persona definitions from SuperClaude
        return {
            architect: {
                Identity: "Systems architect | Scalability specialist | Long-term thinker",
                Decision_Framework: "Long-term maintainability > short-term efficiency | Proven patterns > innovation",
                MCP_Preferences: "Sequential(primary) + Context7(patterns) | Avoid Magic",
                Focus: "Scalability | Maintainability | Technical debt prevention | Team productivity"
            },
            frontend: {
                Identity: "UX specialist | Accessibility advocate | Performance optimizer",
                Decision_Framework: "User needs > technical elegance | Accessibility > convenience | Performance > features",
                MCP_Preferences: "Magic(primary) + Puppeteer(testing) + Context7(frameworks)",
                Focus: "User experience | Accessibility compliance | Performance optimization | Design systems"
            },
            backend: {
                Identity: "Reliability engineer | Performance specialist | Scalability architect",
                Decision_Framework: "Reliability > features > convenience | Data integrity > performance > convenience",
                MCP_Preferences: "Context7(primary) + Sequential(scalability) | Avoid Magic for server logic",
                Focus: "Reliability engineering | Performance optimization | Scalability planning | API design"
            },
            analyzer: {
                Identity: "Root cause specialist | Evidence-based investigator | Systematic thinker",
                Decision_Framework: "Hypothesize → Test → Eliminate → Repeat | Evidence > intuition > opinion",
                MCP_Preferences: "All servers (Sequential primary) | Use best tool for evidence gathering",
                Focus: "Root cause analysis | Evidence-based reasoning | Problem investigation | Quality forensics"
            },
            security: {
                Identity: "Security architect | Threat modeler | Compliance specialist",
                Decision_Framework: "Secure by default | Defense in depth | Zero trust architecture",
                MCP_Preferences: "Sequential(threat modeling) + Context7(security patterns) + Puppeteer(testing)",
                Focus: "Threat modeling | Vulnerability assessment | Compliance management | Incident response"
            },
            mentor: {
                Identity: "Technical educator | Knowledge transfer specialist | Learning facilitator",
                Decision_Framework: "Student context > technical accuracy | Understanding > completion | Growth > efficiency",
                MCP_Preferences: "Context7(learning resources) + Sequential(explanation breakdown) | Avoid Magic unless teaching UI",
                Focus: "Knowledge transfer | Skill development | Documentation | Team mentoring"
            },
            refactorer: {
                Identity: "Code quality specialist | Technical debt manager | Maintainability advocate",
                Decision_Framework: "Code health > feature velocity | Simplicity > cleverness | Maintainability > performance",
                MCP_Preferences: "Sequential(analysis) + Context7(patterns) | Avoid Magic/Puppeteer unless testing refactoring",
                Focus: "Code quality | Technical debt reduction | Maintainability | Design patterns"
            },
            performance: {
                Identity: "Performance engineer | Optimization specialist | Efficiency advocate",
                Decision_Framework: "Measure first | Optimize critical path | Data-driven decisions | User-perceived performance",
                MCP_Preferences: "Puppeteer(metrics) + Sequential(bottleneck analysis) + Context7(optimization patterns)",
                Focus: "Performance optimization | Bottleneck identification | Monitoring | Performance budgets"
            },
            qa: {
                Identity: "Quality advocate | Testing specialist | Risk identifier",
                Decision_Framework: "Quality gates > delivery speed | Comprehensive testing > quick releases",
                MCP_Preferences: "Puppeteer(testing) + Sequential(edge cases) + Context7(testing frameworks)",
                Focus: "Quality assurance | Test coverage | Edge case identification | Quality metrics"
            }
        };
    }

    // Load SuperClaude intelligent activation patterns
    loadIntelligentActivation() {
        try {
            const yaml = require('js-yaml');
            const corePath = path.join(this.superClaudePath, '.claude/shared/superclaude-core.yml');
            
            if (fs.existsSync(corePath)) {
                const content = fs.readFileSync(corePath, 'utf8');
                
                // Extract the Intelligent_Auto_Activation section
                const lines = content.split('\n');
                let startIndex = -1;
                let endIndex = -1;
                
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].trim() === '## Intelligent_Auto_Activation') {
                        startIndex = i + 1;
                    } else if (startIndex !== -1 && lines[i].startsWith('## ')) {
                        endIndex = i;
                        break;
                    }
                }
                
                if (startIndex !== -1) {
                    if (endIndex === -1) endIndex = lines.length;
                    
                    const sectionLines = lines.slice(startIndex, endIndex);
                    while (sectionLines.length > 0 && sectionLines[sectionLines.length - 1].trim() === '') {
                        sectionLines.pop();
                    }
                    
                    const sectionContent = sectionLines.join('\n');
                    const indentedContent = sectionContent.split('\n').map(line => 
                        line.trim() === '' ? '' : `  ${line}`
                    ).join('\n');
                    
                    const yamlContent = `Intelligent_Auto_Activation:\n${indentedContent}`;
                    
                    const data = yaml.load(yamlContent);
                    if (data?.Intelligent_Auto_Activation) {
                        console.log('✅ Loaded SuperClaude intelligent activation patterns from clean repo');
                        return data.Intelligent_Auto_Activation;
                    }
                }
                
                console.log('⚠️  Could not extract Intelligent_Auto_Activation section');
            }
        } catch (error) {
            console.log('⚠️  Could not load activation patterns, using fallback:', error.message);
        }

        // Fallback activation patterns from SuperClaude core
        return {
            File_Type_Detection: {
                tsx_jsx: "→frontend persona",
                py_js: "→appropriate stack",
                sql: "→data operations", 
                Docker: "→devops workflows",
                test: "→qa persona",
                api: "→backend focus",
                md: "→documentation mode",
                yml_json: "→configuration analysis"
            },
            Keyword_Triggers: {
                bug_error_issue: "→analyzer persona",
                optimize_performance: "→performance persona",
                secure_auth_vulnerability: "→security persona",
                refactor_clean: "→refactorer persona",
                explain_document_tutorial: "→mentor persona",
                design_architecture: "→architect persona"
            },
            Context_Intelligence: {
                TypeError: "→dependency analysis",
                Module_errors: "→installation workflows",
                Permission_issues: "→security analysis",
                Performance_bottlenecks: "→optimization workflows",
                Build_failures: "→systematic debugging",
                Test_failures: "→qa analysis"
            }
        };
    }

    // Load SuperClaude evidence standards
    loadEvidenceStandards() {
        try {
            const yaml = require('js-yaml');
            const corePath = path.join(this.superClaudePath, '.claude/shared/superclaude-core.yml');
            
            if (fs.existsSync(corePath)) {
                const content = fs.readFileSync(corePath, 'utf8');
                
                // Extract the Evidence_Based_Standards section
                const lines = content.split('\n');
                let startIndex = -1;
                let endIndex = -1;
                
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].trim() === '## Evidence_Based_Standards') {
                        startIndex = i + 1;
                    } else if (startIndex !== -1 && lines[i].startsWith('## ')) {
                        endIndex = i;
                        break;
                    }
                }
                
                if (startIndex !== -1) {
                    if (endIndex === -1) endIndex = lines.length;
                    
                    const sectionLines = lines.slice(startIndex, endIndex);
                    while (sectionLines.length > 0 && sectionLines[sectionLines.length - 1].trim() === '') {
                        sectionLines.pop();
                    }
                    
                    const sectionContent = sectionLines.join('\n');
                    const indentedContent = sectionContent.split('\n').map(line => 
                        line.trim() === '' ? '' : `  ${line}`
                    ).join('\n');
                    
                    const yamlContent = `Evidence_Based_Standards:\n${indentedContent}`;
                    
                    const data = yaml.load(yamlContent);
                    if (data?.Evidence_Based_Standards) {
                        console.log('✅ Loaded SuperClaude evidence standards from clean repo');
                        return data.Evidence_Based_Standards;
                    }
                }
                
                console.log('⚠️  Could not extract Evidence_Based_Standards section');
            }
        } catch (error) {
            console.log('⚠️  Could not load evidence standards, using fallback:', error.message);
        }

        return {
            Prohibited_Language: "best|optimal|faster|secure|better|improved|enhanced|always|never|guaranteed",
            Required_Language: "may|could|potentially|typically|often|sometimes|measured|documented",
            Evidence_Requirements: "testing confirms|metrics show|benchmarks prove|data indicates|documentation states"
        };
    }

    // Initialize v2.0 smart cache
    initializeSmartCache() {
        try {
            const SmartCache = require('./smart-cache.js');
            const cache = new SmartCache({
                dbPath: path.join(this.frameworkPath, '.superclaude-cache/persona-intelligence.db')
            });
            console.log('✅ Smart cache with SQLite initialized');
            return cache;
        } catch (error) {
            // Create an enhanced memory cache with persistence
            console.log('ℹ️  Using enhanced JSON cache (SQLite not available)');
            return this.createEnhancedMemoryCache();
        }
    }

    // Create enhanced memory cache with JSON persistence
    createEnhancedMemoryCache() {
        const cachePath = path.join(this.frameworkPath, '.superclaude-cache/memory-cache.json');
        
        const cache = {
            data: new Map(),
            
            // Load from disk on startup
            load: () => {
                try {
                    if (fs.existsSync(cachePath)) {
                        const fileContent = fs.readFileSync(cachePath, 'utf8');
                        const jsonData = JSON.parse(fileContent);
                        cache.data = new Map(Object.entries(jsonData));
                        console.log(`✅ Loaded ${cache.data.size} cached items from disk`);
                    }
                } catch (error) {
                    console.log('⚠️  Could not load cache from disk, starting fresh');
                }
            },
            
            // Save to disk
            save: () => {
                try {
                    const dir = path.dirname(cachePath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    
                    const jsonData = Object.fromEntries(cache.data);
                    fs.writeFileSync(cachePath, JSON.stringify(jsonData, null, 2));
                } catch (error) {
                    console.log('⚠️  Could not save cache to disk');
                }
            },
            
            get: (key) => cache.data.get(key),
            set: (key, value) => {
                cache.data.set(key, value);
                // Save periodically (not on every set for performance)
                if (cache.data.size % 10 === 0) {
                    cache.save();
                }
                return true;
            },
            has: (key) => cache.data.has(key)
        };
        
        // Load existing cache
        cache.load();
        
        // Save on exit
        process.on('exit', cache.save);
        process.on('SIGINT', cache.save);
        
        return cache;
    }

    // Initialize v2.0 evidence validator
    initializeEvidenceValidator() {
        try {
            const EvidenceValidator = require('./evidence-validator.js');
            return new EvidenceValidator();
        } catch (error) {
            console.log('⚠️  Evidence validator not available, using basic validation');
            return {
                validateClaim: async (claim) => ({ isValid: true, confidence: 0.8 })
            };
        }
    }

    // Initialize v2.0 performance monitor
    initializePerformanceMonitor() {
        try {
            const PerformanceMonitor = require('../tools/performance-monitor.js');
            return new PerformanceMonitor();
        } catch (error) {
            console.log('⚠️  Performance monitor not available, using basic logging');
            return {
                recordOperation: (type, metrics) => {
                    console.log(`📊 ${type}: ${JSON.stringify(metrics)}`);
                }
            };
        }
    }

    // Load learning patterns from previous sessions
    loadLearningPatterns() {
        const patternsPath = path.join(this.frameworkPath, '.superclaude-cache/learning-patterns.json');
        
        try {
            if (fs.existsSync(patternsPath)) {
                const content = fs.readFileSync(patternsPath, 'utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.log('⚠️  No learning patterns found, starting fresh');
        }

        return {
            contextPatterns: {},
            personaSuccess: {},
            taskTypeMapping: {},
            userPreferences: {}
        };
    }

    // Save learning patterns for future sessions
    saveLearningPatterns() {
        const patternsPath = path.join(this.frameworkPath, '.superclaude-cache/learning-patterns.json');
        
        try {
            const dir = path.dirname(patternsPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(patternsPath, JSON.stringify(this.learningPatterns, null, 2));
        } catch (error) {
            console.log('⚠️  Could not save learning patterns');
        }
    }

    // Analyze context to determine optimal persona
    async analyzeContext(request, options = {}) {
        const startTime = Date.now();
        
        // Generate context signature for caching
        const contextSignature = this.generateContextSignature(request, options);
        
        // Check cache first (v2.0 optimization)
        if (this.smartCache.has(contextSignature)) {
            const cached = this.smartCache.get(contextSignature);
            console.log('⚡ Using cached context analysis');
            return cached;
        }

        // Comprehensive context analysis
        const context = {
            request: typeof request === 'string' ? request : JSON.stringify(request),
            options,
            timestamp: Date.now(),
            
            // File analysis
            fileTypes: this.extractFileTypes(request),
            fileContent: this.analyzeFileContent(request),
            
            // Keyword analysis
            keywords: this.extractKeywords(request),
            technicalTerms: this.extractTechnicalTerms(request),
            
            // Task classification
            taskType: this.classifyTaskType(request),
            complexity: this.assessComplexity(request),
            urgency: this.assessUrgency(request),
            
            // Error pattern analysis
            errorPatterns: this.detectErrorPatterns(request),
            debuggingNeeds: this.assessDebuggingNeeds(request),
            
            // Project context
            projectType: this.detectProjectType(),
            stack: this.detectTechnologyStack(request),
            
            // User intent analysis
            intent: this.analyzeUserIntent(request),
            learningLevel: this.assessLearningLevel(request),
            
            // Performance requirements
            performanceNeeds: this.assessPerformanceNeeds(request),
            qualityRequirements: this.assessQualityRequirements(request)
        };

        // Cache the analysis (v2.0 optimization)
        this.smartCache.set(contextSignature, context);
        
        // Record performance
        this.performanceMonitor.recordOperation('context_analysis', {
            duration: Date.now() - startTime,
            cacheHit: false,
            complexity: context.complexity
        });

        return context;
    }

    // Generate signature for context caching
    generateContextSignature(request, options) {
        const content = JSON.stringify({ request, options });
        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }

    // Extract file types from request
    extractFileTypes(request) {
        const text = typeof request === 'string' ? request : JSON.stringify(request);
        const extensions = text.match(/\.\w+/g) || [];
        return [...new Set(extensions)];
    }

    // Analyze file content patterns
    analyzeFileContent(request) {
        const text = typeof request === 'string' ? request : JSON.stringify(request);
        
        return {
            hasReactComponents: /import.*React|export.*Component|\.jsx?/.test(text),
            hasBackendCode: /express|fastify|server|api|database|sql/.test(text),
            hasTestCode: /test|spec|jest|mocha|cypress|describe|it\(/.test(text),
            hasConfigFiles: /config|\.json|\.yml|\.yaml|docker|package\.json/.test(text),
            hasDocumentation: /readme|documentation|docs|\.md/.test(text),
            hasSecurityCode: /auth|security|crypto|password|token/.test(text),
            hasPerformanceCode: /optimize|performance|cache|async|await/.test(text)
        };
    }

    // Extract keywords using SuperClaude patterns
    extractKeywords(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        const keywords = [];
        
        // Use SuperClaude keyword triggers
        const triggers = this.intelligentActivation.Keyword_Triggers || {};
        
        for (const [pattern, action] of Object.entries(triggers)) {
            const keywordList = pattern.split('_');
            if (keywordList.some(keyword => text.includes(keyword))) {
                keywords.push(pattern);
            }
        }

        return keywords;
    }

    // Extract technical terms for better persona selection
    extractTechnicalTerms(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        const terms = [];

        const technicalPatterns = {
            frontend: ['react', 'vue', 'angular', 'css', 'html', 'ui', 'ux', 'component'],
            backend: ['api', 'server', 'database', 'sql', 'node', 'express', 'fastify'],
            security: ['auth', 'security', 'vulnerability', 'crypto', 'hash', 'token'],
            performance: ['optimize', 'cache', 'performance', 'speed', 'memory', 'cpu'],
            qa: ['test', 'testing', 'jest', 'mocha', 'cypress', 'coverage', 'quality'],
            devops: ['docker', 'kubernetes', 'deployment', 'ci', 'cd', 'pipeline']
        };

        for (const [category, patterns] of Object.entries(technicalPatterns)) {
            if (patterns.some(pattern => text.includes(pattern))) {
                terms.push(category);
            }
        }

        return terms;
    }

    // Classify task type for optimal persona selection
    classifyTaskType(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        if (/build|create|implement|develop|code/.test(text)) return 'development';
        if (/debug|error|bug|fix|troubleshoot/.test(text)) return 'debugging';
        if (/design|architecture|plan|structure/.test(text)) return 'architecture';
        if (/test|quality|coverage|validate/.test(text)) return 'testing';
        if (/optimize|performance|speed|improve/.test(text)) return 'optimization';
        if (/secure|security|vulnerability|auth/.test(text)) return 'security';
        if (/explain|learn|tutorial|document/.test(text)) return 'education';
        if (/refactor|clean|maintain|debt/.test(text)) return 'maintenance';
        
        return 'general';
    }

    // Assess task complexity
    assessComplexity(request) {
        const text = typeof request === 'string' ? request : JSON.stringify(request);
        
        let complexity = 1;
        
        // Increase complexity based on indicators
        if (/multiple|complex|advanced|enterprise/.test(text)) complexity += 2;
        if (/integration|system|architecture/.test(text)) complexity += 2;
        if (/performance|optimization|scalability/.test(text)) complexity += 1;
        if (/security|authentication|authorization/.test(text)) complexity += 1;
        if (text.length > 500) complexity += 1;
        if (text.split(' ').length > 100) complexity += 1;
        
        return Math.min(complexity, 5); // Cap at 5
    }

    // Assess urgency
    assessUrgency(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        if (/urgent|critical|emergency|asap|immediately/.test(text)) return 'high';
        if (/bug|error|broken|failed|not working/.test(text)) return 'high';
        if (/soon|quick|fast/.test(text)) return 'medium';
        
        return 'normal';
    }

    // Detect error patterns using SuperClaude intelligence
    detectErrorPatterns(request) {
        const text = typeof request === 'string' ? request : JSON.stringify(request);
        const patterns = [];
        
        // Use SuperClaude context intelligence
        const contextIntelligence = this.intelligentActivation.Context_Intelligence || {};
        
        for (const [pattern, action] of Object.entries(contextIntelligence)) {
            if (text.includes(pattern)) {
                patterns.push({ pattern, suggestedAction: action });
            }
        }

        return patterns;
    }

    // Assess debugging needs
    assessDebuggingNeeds(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        return {
            hasStackTrace: /stack trace|error:|at \w+\.|line \d+/.test(text),
            hasErrorMessages: /error|exception|failed|undefined|null/.test(text),
            needsInvestigation: /why|how|what.*wrong|not working/.test(text),
            needsSystematicApproach: /complex|multiple|intermittent/.test(text)
        };
    }

    // Detect project type
    detectProjectType() {
        const cwd = process.cwd();
        
        if (fs.existsSync(path.join(cwd, 'package.json'))) return 'node';
        if (fs.existsSync(path.join(cwd, 'requirements.txt'))) return 'python';
        if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) return 'rust';
        if (fs.existsSync(path.join(cwd, 'pom.xml'))) return 'java';
        if (fs.existsSync(path.join(cwd, 'Assets/Scripts'))) return 'unity';
        if (fs.existsSync(path.join(cwd, 'Dockerfile'))) return 'containerized';
        
        return 'generic';
    }

    // Detect technology stack
    detectTechnologyStack(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        const stack = [];
        
        const stackPatterns = {
            'React': /react|jsx|tsx/,
            'Vue': /vue|vuex/,
            'Angular': /angular|typescript/,
            'Node.js': /node|npm|express/,
            'Python': /python|django|flask/,
            'Docker': /docker|container/,
            'AWS': /aws|lambda|s3/,
            'Database': /sql|mongodb|postgres|mysql/
        };

        for (const [tech, pattern] of Object.entries(stackPatterns)) {
            if (pattern.test(text)) {
                stack.push(tech);
            }
        }

        return stack;
    }

    // Analyze user intent
    analyzeUserIntent(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        if (/how.*work|explain|understand/.test(text)) return 'learning';
        if (/build|create|make|implement/.test(text)) return 'creation';
        if (/fix|debug|solve|resolve/.test(text)) return 'problem_solving';
        if (/improve|optimize|enhance|better/.test(text)) return 'improvement';
        if (/review|check|validate|audit/.test(text)) return 'evaluation';
        
        return 'general_assistance';
    }

    // Assess learning level
    assessLearningLevel(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        if (/beginner|new|learning|first time|basic/.test(text)) return 'beginner';
        if (/advanced|expert|complex|enterprise/.test(text)) return 'advanced';
        
        return 'intermediate';
    }

    // Assess performance needs
    assessPerformanceNeeds(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        return {
            needsOptimization: /slow|performance|optimize|speed/.test(text),
            needsScaling: /scale|scalability|load|traffic/.test(text),
            needsMonitoring: /monitor|metrics|benchmark/.test(text),
            needsCaching: /cache|caching|redis|memcached/.test(text)
        };
    }

    // Assess quality requirements
    assessQualityRequirements(request) {
        const text = typeof request === 'string' ? request.toLowerCase() : JSON.stringify(request).toLowerCase();
        
        return {
            needsTesting: /test|testing|coverage|quality/.test(text),
            needsSecurity: /secure|security|auth|vulnerability/.test(text),
            needsDocumentation: /document|docs|readme|comment/.test(text),
            needsRefactoring: /refactor|clean|maintainable|debt/.test(text)
        };
    }

    // Select optimal persona based on context analysis
    async selectOptimalPersona(context) {
        const startTime = Date.now();
        
        // Multi-factor persona scoring
        const personaScores = {};
        
        // Initialize all personas with base score
        for (const personaName of Object.keys(this.personas)) {
            personaScores[personaName] = 0;
        }

        // Score based on file types (SuperClaude file type detection)
        this.scoreByFileTypes(context.fileTypes, personaScores);
        
        // Score based on keywords (SuperClaude keyword triggers)
        this.scoreByKeywords(context.keywords, personaScores);
        
        // Score based on technical terms
        this.scoreByTechnicalTerms(context.technicalTerms, personaScores);
        
        // Score based on task type
        this.scoreByTaskType(context.taskType, personaScores);
        
        // Score based on error patterns (SuperClaude context intelligence)
        this.scoreByErrorPatterns(context.errorPatterns, personaScores);
        
        // Score based on file content analysis
        this.scoreByFileContent(context.fileContent, personaScores);
        
        // Score based on performance and quality needs
        this.scoreByRequirements(context.performanceNeeds, context.qualityRequirements, personaScores);
        
        // Apply learning patterns (v2.0 enhancement)
        this.applyLearningPatterns(context, personaScores);
        
        // Select persona with highest score
        const selectedPersona = Object.keys(personaScores).reduce((a, b) => 
            personaScores[a] > personaScores[b] ? a : b
        );

        // Record performance
        this.performanceMonitor.recordOperation('persona_selection', {
            duration: Date.now() - startTime,
            selectedPersona,
            scores: personaScores,
            context: context.taskType
        });

        // Update learning patterns
        this.updateLearningPatterns(context, selectedPersona, personaScores);

        return {
            persona: selectedPersona,
            confidence: personaScores[selectedPersona] / 10, // Normalize to 0-1
            scores: personaScores,
            reasoning: this.generateSelectionReasoning(selectedPersona, context, personaScores)
        };
    }

    // Score personas based on file types using SuperClaude patterns
    scoreByFileTypes(fileTypes, scores) {
        const fileTypeMapping = {
            '.tsx': ['frontend'],
            '.jsx': ['frontend'],
            '.css': ['frontend'],
            '.scss': ['frontend'],
            '.js': ['frontend', 'backend'],
            '.ts': ['frontend', 'backend'],
            '.py': ['backend'],
            '.sql': ['backend'],
            '.test.js': ['qa'],
            '.spec.js': ['qa'],
            '.test.ts': ['qa'],
            '.spec.ts': ['qa'],
            '.md': ['mentor'],
            '.yml': ['architect'],
            '.yaml': ['architect'],
            '.json': ['architect'],
            'Dockerfile': ['architect']
        };

        for (const fileType of fileTypes) {
            if (fileTypeMapping[fileType]) {
                for (const persona of fileTypeMapping[fileType]) {
                    scores[persona] += 3;
                }
            }
        }
    }

    // Score personas based on SuperClaude keyword triggers
    scoreByKeywords(keywords, scores) {
        const keywordMapping = {
            'bug_error_issue': ['analyzer'],
            'optimize_performance': ['performance'],
            'secure_auth_vulnerability': ['security'],
            'refactor_clean': ['refactorer'],
            'explain_document_tutorial': ['mentor'],
            'design_architecture': ['architect']
        };

        for (const keyword of keywords) {
            if (keywordMapping[keyword]) {
                for (const persona of keywordMapping[keyword]) {
                    scores[persona] += 5;
                }
            }
        }
    }

    // Score based on technical terms
    scoreByTechnicalTerms(terms, scores) {
        const termMapping = {
            'frontend': ['frontend'],
            'backend': ['backend'],
            'security': ['security'],
            'performance': ['performance'],
            'qa': ['qa'],
            'devops': ['architect']
        };

        for (const term of terms) {
            if (termMapping[term]) {
                for (const persona of termMapping[term]) {
                    scores[persona] += 2;
                }
            }
        }
    }

    // Score based on task type
    scoreByTaskType(taskType, scores) {
        const taskMapping = {
            'development': ['frontend', 'backend', 'architect'],
            'debugging': ['analyzer', 'qa'],
            'architecture': ['architect'],
            'testing': ['qa'],
            'optimization': ['performance'],
            'security': ['security'],
            'education': ['mentor'],
            'maintenance': ['refactorer']
        };

        if (taskMapping[taskType]) {
            for (const persona of taskMapping[taskType]) {
                scores[persona] += 4;
            }
        }
    }

    // Score based on error patterns using SuperClaude context intelligence
    scoreByErrorPatterns(errorPatterns, scores) {
        if (!Array.isArray(errorPatterns)) return;
        
        for (const { pattern, suggestedAction } of errorPatterns) {
            if (suggestedAction.includes('dependency analysis')) scores['analyzer'] += 3;
            if (suggestedAction.includes('security analysis')) scores['security'] += 3;
            if (suggestedAction.includes('optimization')) scores['performance'] += 3;
            if (suggestedAction.includes('debugging')) scores['analyzer'] += 3;
            if (suggestedAction.includes('qa analysis')) scores['qa'] += 3;
        }
    }

    // Score based on file content analysis
    scoreByFileContent(fileContent, scores) {
        if (fileContent.hasReactComponents) scores['frontend'] += 3;
        if (fileContent.hasBackendCode) scores['backend'] += 3;
        if (fileContent.hasTestCode) scores['qa'] += 4;
        if (fileContent.hasConfigFiles) scores['architect'] += 2;
        if (fileContent.hasDocumentation) scores['mentor'] += 2;
        if (fileContent.hasSecurityCode) scores['security'] += 4;
        if (fileContent.hasPerformanceCode) scores['performance'] += 3;
    }

    // Score based on performance and quality requirements
    scoreByRequirements(performanceNeeds, qualityRequirements, scores) {
        if (performanceNeeds.needsOptimization) scores['performance'] += 4;
        if (performanceNeeds.needsScaling) scores['architect'] += 3;
        if (performanceNeeds.needsMonitoring) scores['performance'] += 2;

        if (qualityRequirements.needsTesting) scores['qa'] += 4;
        if (qualityRequirements.needsSecurity) scores['security'] += 4;
        if (qualityRequirements.needsDocumentation) scores['mentor'] += 3;
        if (qualityRequirements.needsRefactoring) scores['refactorer'] += 4;
    }

    // Apply learning patterns from previous sessions
    applyLearningPatterns(context, scores) {
        const contextHash = this.generateContextSignature(context, {});
        
        // Apply successful patterns
        if (this.learningPatterns.contextPatterns[contextHash]) {
            const successfulPersona = this.learningPatterns.contextPatterns[contextHash];
            scores[successfulPersona] += 2;
        }

        // Apply task type patterns
        if (this.learningPatterns.taskTypeMapping[context.taskType]) {
            const preferredPersona = this.learningPatterns.taskTypeMapping[context.taskType];
            scores[preferredPersona] += 1;
        }
    }

    // Update learning patterns based on selection
    updateLearningPatterns(context, selectedPersona, scores) {
        const contextHash = this.generateContextSignature(context, {});
        
        // Update context patterns
        this.learningPatterns.contextPatterns[contextHash] = selectedPersona;
        
        // Update task type mapping
        if (!this.learningPatterns.taskTypeMapping[context.taskType]) {
            this.learningPatterns.taskTypeMapping[context.taskType] = selectedPersona;
        }

        // Update persona success tracking
        if (!this.learningPatterns.personaSuccess[selectedPersona]) {
            this.learningPatterns.personaSuccess[selectedPersona] = 0;
        }
        this.learningPatterns.personaSuccess[selectedPersona]++;

        // Save learning patterns
        this.saveLearningPatterns();
    }

    // Generate reasoning for persona selection
    generateSelectionReasoning(selectedPersona, context, scores) {
        const reasoning = [];
        
        reasoning.push(`Selected ${selectedPersona} persona`);
        reasoning.push(`Task type: ${context.taskType}`);
        reasoning.push(`File types: ${context.fileTypes.join(', ') || 'none'}`);
        reasoning.push(`Keywords: ${context.keywords.join(', ') || 'none'}`);
        reasoning.push(`Technical terms: ${context.technicalTerms.join(', ') || 'none'}`);
        
        // Top 3 scoring personas
        const topPersonas = Object.entries(scores)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([persona, score]) => `${persona}(${score})`);
        
        reasoning.push(`Top scores: ${topPersonas.join(', ')}`);
        
        return reasoning.join(' | ');
    }

    // Execute with selected persona and SuperClaude knowledge
    async executeWithPersona(persona, request, context) {
        const startTime = Date.now();
        
        try {
            // Get persona configuration from SuperClaude
            const personaConfig = this.personas[persona] || {};
            
            // Apply SuperClaude evidence standards
            const evidenceValidation = await this.validateWithSuperclaude(request, personaConfig);
            
            // Execute with persona-specific approach
            const result = await this.executePersonaSpecific(persona, request, context, personaConfig);
            
            // Record persona usage
            this.recordPersonaUsage(persona, context, Date.now() - startTime, true);
            
            return {
                persona,
                personaConfig,
                evidenceValidation,
                result,
                executionTime: Date.now() - startTime,
                superclaudeIntegration: true
            };
            
        } catch (error) {
            this.recordPersonaUsage(persona, context, Date.now() - startTime, false);
            throw error;
        }
    }

    // Validate request using SuperClaude evidence standards
    async validateWithSuperclaude(request, personaConfig) {
        const text = typeof request === 'string' ? request : JSON.stringify(request);
        
        // Check prohibited language (SuperClaude standards)
        const prohibitedTerms = this.evidenceStandards.Prohibited_Language?.split('|') || [];
        const foundProhibited = prohibitedTerms.filter(term => 
            new RegExp(term, 'i').test(text)
        );

        // Use v2.0 evidence validator if available
        let evidenceValidation = { isValid: true, confidence: 1.0 };
        if (this.evidenceValidator) {
            evidenceValidation = await this.evidenceValidator.validateClaim(text, {
                persona: personaConfig.Identity,
                standards: this.evidenceStandards
            });
        }

        return {
            passesSuperclaude: foundProhibited.length === 0,
            prohibitedTerms: foundProhibited,
            evidenceValidation,
            personaIdentity: personaConfig.Identity,
            decisionFramework: personaConfig.Decision_Framework
        };
    }

    // Execute with persona-specific approach
    async executePersonaSpecific(persona, request, context, personaConfig) {
        // This would be where the actual execution happens
        // For now, return a structured response that shows the persona integration
        
        return {
            approach: personaConfig.Decision_Framework,
            focus: personaConfig.Focus,
            mcpPreferences: personaConfig.MCP_Preferences,
            reasoning: `Applying ${persona} perspective to: ${context.taskType}`,
            recommendations: this.generatePersonaRecommendations(persona, context),
            nextSteps: this.generateNextSteps(persona, context)
        };
    }

    // Generate persona-specific recommendations
    generatePersonaRecommendations(persona, context) {
        const recommendations = [];
        const personaConfig = this.personas[persona] || {};
        
        switch (persona) {
            case 'architect':
                recommendations.push('Consider long-term maintainability and scalability');
                recommendations.push('Design clear boundaries and minimize coupling');
                recommendations.push('Document architectural decisions');
                break;
                
            case 'analyzer':
                recommendations.push('Gather evidence before making assumptions');
                recommendations.push('Consider multiple potential root causes');
                recommendations.push('Follow systematic investigation approach');
                break;
                
            case 'security':
                recommendations.push('Apply defense in depth principles');
                recommendations.push('Implement secure by default approach');
                recommendations.push('Conduct threat modeling');
                break;
                
            case 'performance':
                recommendations.push('Measure performance before optimizing');
                recommendations.push('Focus on critical path optimization');
                recommendations.push('Use data-driven decision making');
                break;
                
            case 'qa':
                recommendations.push('Implement comprehensive testing strategy');
                recommendations.push('Focus on edge case identification');
                recommendations.push('Maintain quality gates');
                break;
                
            default:
                recommendations.push(`Apply ${persona} expertise and perspective`);
                recommendations.push(`Follow ${persona} decision framework`);
        }

        return recommendations;
    }

    // Generate next steps based on persona
    generateNextSteps(persona, context) {
        const steps = [];
        
        steps.push(`Continue with ${persona} perspective`);
        steps.push(`Apply ${persona}-specific quality standards`);
        steps.push(`Use recommended MCP servers: ${this.personas[persona]?.MCP_Preferences || 'standard'}`);
        
        if (context.complexity > 3) {
            steps.push('Consider breaking down into smaller tasks');
            steps.push('Plan checkpoint reviews');
        }

        return steps;
    }

    // Record persona usage for learning
    recordPersonaUsage(persona, context, duration, success) {
        this.personaHistory.push({
            persona,
            context: context.taskType,
            duration,
            success,
            timestamp: Date.now()
        });

        this.performanceMonitor.recordOperation('persona_usage', {
            persona,
            duration,
            success,
            taskType: context.taskType
        });
    }

    // Main intelligence engine interface
    async process(request, options = {}) {
        console.log('🧠 SuperClaude Persona Intelligence Engine Processing...');
        
        try {
            // Analyze context with v2.0 optimizations
            const context = await this.analyzeContext(request, options);
            console.log(`📋 Context: ${context.taskType} | Complexity: ${context.complexity} | Files: ${context.fileTypes.join(',') || 'none'}`);
            
            // Select optimal persona using SuperClaude knowledge
            const personaSelection = await this.selectOptimalPersona(context);
            console.log(`🎯 Selected: ${personaSelection.persona} (confidence: ${(personaSelection.confidence * 100).toFixed(1)}%)`);
            console.log(`💭 Reasoning: ${personaSelection.reasoning}`);
            
            // Execute with selected persona
            const execution = await this.executeWithPersona(personaSelection.persona, request, context);
            
            // Return comprehensive result
            return {
                success: true,
                context,
                personaSelection,
                execution,
                superclaudeIntegration: true,
                v2Optimizations: true,
                processingTime: execution.executionTime
            };
            
        } catch (error) {
            console.error('❌ Persona Intelligence Engine failed:', error.message);
            
            return {
                success: false,
                error: error.message,
                fallback: 'architect', // Default fallback persona
                timestamp: Date.now()
            };
        }
    }

    // Get current status and statistics
    getStatus() {
        return {
            currentPersona: this.currentPersona,
            personaHistory: this.personaHistory.length,
            learningPatterns: Object.keys(this.learningPatterns.contextPatterns).length,
            availablePersonas: Object.keys(this.personas),
            v2ComponentsLoaded: Object.keys(this.v2Components).length,
            superclaudeIntegration: true
        };
    }
}

// CLI interface
if (require.main === module) {
    const engine = new PersonaIntelligenceEngine();
    
    const request = process.argv.slice(2).join(' ') || 'Help me debug a React component performance issue';
    
    engine.process(request)
        .then(result => {
            console.log('\n🎉 SuperClaude Persona Intelligence Result:');
            console.log(JSON.stringify(result, null, 2));
        })
        .catch(error => {
            console.error('❌ Engine failed:', error.message);
            process.exit(1);
        });
}

module.exports = PersonaIntelligenceEngine;