// Intelligent Auto Persona Changing System
// Beyond documentation-based - real-time intelligent switching

const { globalAutoDoc } = require('./enhanced-superclaude-autodoc.js');

class IntelligentPersonaSystem {
    constructor() {
        this.currentPersona = 'architect';
        this.personaHistory = [];
        this.contextMemory = new Map();
        this.confidenceThreshold = 0.7;
        
        // Enhanced persona definitions with behavioral patterns
        this.personas = {
            architect: {
                identity: 'Systems architect | Scalability specialist | Long-term thinker',
                framework: 'Long-term maintainability > short-term efficiency | Proven patterns > innovation',
                mcpPreference: ['sequential', 'context7'],
                triggers: ['architecture', 'design', 'scalability', 'system', 'structure', 'patterns'],
                behaviorPatterns: {
                    analysisDepth: 'comprehensive',
                    decisionStyle: 'systematic',
                    communicationStyle: 'structured',
                    riskTolerance: 'conservative'
                }
            },
            frontend: {
                identity: 'UX specialist | Accessibility advocate | Performance optimizer',
                framework: 'User needs > technical elegance | Accessibility > convenience',
                mcpPreference: ['magic', 'context7', 'playwright'],
                triggers: ['ui', 'component', 'react', 'vue', 'css', 'html', 'ux', 'interface', 'frontend'],
                behaviorPatterns: {
                    analysisDepth: 'user-focused',
                    decisionStyle: 'iterative',
                    communicationStyle: 'visual',
                    riskTolerance: 'moderate'
                }
            },
            backend: {
                identity: 'Reliability engineer | API specialist | Data integrity focus',
                framework: 'Reliability > features | Data integrity > performance',
                mcpPreference: ['context7', 'sequential'],
                triggers: ['api', 'server', 'database', 'backend', 'node', 'express', 'sql', 'service'],
                behaviorPatterns: {
                    analysisDepth: 'thorough',
                    decisionStyle: 'methodical',
                    communicationStyle: 'technical',
                    riskTolerance: 'conservative'
                }
            },
            security: {
                identity: 'Threat modeler | Compliance expert | Vulnerability specialist',
                framework: 'Security > convenience | Zero trust architecture | Defense in depth',
                mcpPreference: ['sequential', 'context7'],
                triggers: ['security', 'auth', 'vulnerability', 'hack', 'secure', 'crypto', 'token', 'threat'],
                behaviorPatterns: {
                    analysisDepth: 'paranoid',
                    decisionStyle: 'risk-averse',
                    communicationStyle: 'precise',
                    riskTolerance: 'minimal'
                }
            },
            performance: {
                identity: 'Optimization specialist | Bottleneck elimination expert | Metrics-driven analyst',
                framework: 'Measure first > optimize critical path > avoid premature optimization',
                mcpPreference: ['sequential', 'playwright'],
                triggers: ['optimize', 'performance', 'speed', 'slow', 'memory', 'cpu', 'bottleneck'],
                behaviorPatterns: {
                    analysisDepth: 'data-driven',
                    decisionStyle: 'empirical',
                    communicationStyle: 'metric-focused',
                    riskTolerance: 'calculated'
                }
            },
            analyzer: {
                identity: 'Root cause specialist | Evidence-based investigator | Systematic thinker',
                framework: 'Evidence > intuition | Systematic approach > quick fixes',
                mcpPreference: ['sequential'],
                triggers: ['debug', 'error', 'bug', 'issue', 'problem', 'fix', 'analyze', 'investigate'],
                behaviorPatterns: {
                    analysisDepth: 'exhaustive',
                    decisionStyle: 'evidence-based',
                    communicationStyle: 'methodical',
                    riskTolerance: 'systematic'
                }
            },
            qa: {
                identity: 'Quality advocate | Testing specialist | Edge case detective',
                framework: 'Quality gates > delivery speed | Comprehensive testing > quick releases',
                mcpPreference: ['playwright', 'sequential'],
                triggers: ['test', 'testing', 'quality', 'coverage', 'qa', 'validation'],
                behaviorPatterns: {
                    analysisDepth: 'comprehensive',
                    decisionStyle: 'thorough',
                    communicationStyle: 'systematic',
                    riskTolerance: 'risk-averse'
                }
            }
        };
    }

    // Intelligent persona detection with context awareness
    detectOptimalPersona(userInput, currentContext = {}) {
        const scores = new Map();
        const input = userInput.toLowerCase();
        
        // Score each persona based on multiple factors
        for (const [personaName, persona] of Object.entries(this.personas)) {
            let score = 0;
            
            // 1. Keyword matching (30%)
            const keywordMatches = persona.triggers.filter(trigger => 
                input.includes(trigger)
            ).length;
            score += (keywordMatches / persona.triggers.length) * 0.3;
            
            // 2. Context analysis (40%)
            if (currentContext.fileTypes) {
                // Frontend files (.jsx, .css, .html)
                if (personaName === 'frontend' && 
                    currentContext.fileTypes.some(type => ['.jsx', '.tsx', '.css', '.html', '.vue'].includes(type))) {
                    score += 0.4;
                }
                // Backend files (.js, .py, .sql)
                if (personaName === 'backend' && 
                    currentContext.fileTypes.some(type => ['.js', '.py', '.sql', '.json'].includes(type))) {
                    score += 0.3;
                }
            }
            
            // 3. Command patterns (20%)
            if (currentContext.command) {
                const commandPersonaMap = {
                    '/sc:implement': ['frontend', 'backend'],
                    '/sc:build': ['frontend', 'backend', 'architect'],
                    '/sc:analyze': ['analyzer', 'security', 'performance'],
                    '/sc:test': ['qa'],
                    '/sc:secure': ['security'],
                    '/sc:improve': ['performance', 'refactorer']
                };
                
                if (commandPersonaMap[currentContext.command]?.includes(personaName)) {
                    score += 0.2;
                }
            }
            
            // 4. Historical context (10%)
            const recentPersona = this.getRecentPersonaUsage(personaName);
            score += recentPersona * 0.1;
            
            scores.set(personaName, score);
        }
        
        // Find highest scoring persona
        const sortedScores = Array.from(scores.entries())
            .sort(([,a], [,b]) => b - a);
        
        const [topPersona, topScore] = sortedScores[0];
        
        return {
            recommendedPersona: topPersona,
            confidence: topScore,
            allScores: Object.fromEntries(scores),
            shouldSwitch: topScore >= this.confidenceThreshold && topPersona !== this.currentPersona
        };
    }

    // Switch persona with intelligent decision making
    switchPersona(newPersona, reason, userInput) {
        if (newPersona === this.currentPersona) {
            return { switched: false, reason: 'Already active persona' };
        }

        const previousPersona = this.currentPersona;
        this.currentPersona = newPersona;
        
        // Record the switch
        const switchRecord = {
            from: previousPersona,
            to: newPersona,
            reason,
            timestamp: new Date().toISOString(),
            userInput: userInput.substring(0, 100) + '...',
            context: this.getPersonaContext(newPersona)
        };
        
        this.personaHistory.push(switchRecord);
        
        // Update context memory
        this.updateContextMemory(newPersona, userInput);
        
        // Notify auto-doc system
        globalAutoDoc.interceptSuperClaudeResponse('', {
            personaSwitch: switchRecord
        });
        
        return {
            switched: true,
            from: previousPersona,
            to: newPersona,
            reason,
            context: this.getPersonaContext(newPersona)
        };
    }

    // Auto-switch persona based on input analysis
    autoSwitchPersona(userInput, currentContext = {}) {
        const detection = this.detectOptimalPersona(userInput, currentContext);
        
        if (detection.shouldSwitch) {
            return this.switchPersona(
                detection.recommendedPersona,
                `Auto-switched based on ${Math.round(detection.confidence * 100)}% confidence match`,
                userInput
            );
        }
        
        return {
            switched: false,
            reason: 'Confidence threshold not met',
            currentPersona: this.currentPersona,
            detection
        };
    }

    // Get persona behavioral context
    getPersonaContext(personaName = this.currentPersona) {
        const persona = this.personas[personaName];
        if (!persona) return null;
        
        return {
            identity: persona.identity,
            framework: persona.framework,
            mcpPreference: persona.mcpPreference,
            behaviorPatterns: persona.behaviorPatterns,
            currentFocus: this.contextMemory.get(personaName) || 'general'
        };
    }

    // Update context memory for persona
    updateContextMemory(personaName, userInput) {
        const context = this.extractContextFromInput(userInput);
        this.contextMemory.set(personaName, context);
    }

    extractContextFromInput(input) {
        const tech = [];
        const domains = [];
        
        // Technology detection
        if (/react|jsx|tsx/.test(input)) tech.push('React');
        if (/vue/.test(input)) tech.push('Vue');
        if (/node|express/.test(input)) tech.push('Node.js');
        if (/python/.test(input)) tech.push('Python');
        if (/sql|database/.test(input)) tech.push('Database');
        
        // Domain detection
        if (/frontend|ui|component/.test(input)) domains.push('frontend');
        if (/backend|api|server/.test(input)) domains.push('backend');
        if (/security|auth/.test(input)) domains.push('security');
        if (/test|testing/.test(input)) domains.push('testing');
        
        return {
            technologies: tech,
            domains,
            focus: input.substring(0, 50),
            timestamp: new Date().toISOString()
        };
    }

    getRecentPersonaUsage(personaName) {
        const recent = this.personaHistory.slice(-5);
        const usage = recent.filter(h => h.to === personaName).length;
        return usage / 5; // Normalized score
    }

    // Get current session status
    getSessionStatus() {
        return {
            currentPersona: this.currentPersona,
            personaHistory: this.personaHistory.length,
            contextMemorySize: this.contextMemory.size,
            availablePersonas: Object.keys(this.personas),
            lastSwitch: this.personaHistory[this.personaHistory.length - 1] || null
        };
    }

    // Generate persona-aware response format
    generateResponseFormat(userInput, currentContext = {}) {
        const autoSwitch = this.autoSwitchPersona(userInput, currentContext);
        const persona = this.getPersonaContext();
        
        const format = [
            `🎭 PERSONA: ${this.currentPersona}${autoSwitch.switched ? ` (switched from ${autoSwitch.from})` : ''} | ${persona.identity}`,
            `🔌 MCP: ${persona.mcpPreference.join(', ')} - ${autoSwitch.switched ? 'activating' : 'active'}`,
            `📋 FRAMEWORK: ${persona.framework}`,
            `🧠 BEHAVIOR: ${persona.behaviorPatterns.decisionStyle} decisions, ${persona.behaviorPatterns.analysisDepth} analysis`
        ];
        
        if (autoSwitch.switched) {
            format.push(`💡 SWITCH REASON: ${autoSwitch.reason}`);
        }
        
        return {
            header: format.join('\n'),
            persona: this.currentPersona,
            mcpPreference: persona.mcpPreference,
            behaviorPatterns: persona.behaviorPatterns,
            switchInfo: autoSwitch
        };
    }
}

// Global intelligent persona system
const globalPersonaSystem = new IntelligentPersonaSystem();

module.exports = {
    IntelligentPersonaSystem,
    globalPersonaSystem,
    autoSwitchPersona: (input, context) => globalPersonaSystem.autoSwitchPersona(input, context),
    generateResponseFormat: (input, context) => globalPersonaSystem.generateResponseFormat(input, context),
    getCurrentPersona: () => globalPersonaSystem.currentPersona,
    getPersonaContext: () => globalPersonaSystem.getPersonaContext()
};

// Test if run directly
if (require.main === module) {
    console.log('🧠 Intelligent Persona System Active');
    
    // Test auto-switching
    const testInputs = [
        'implement a React component for user authentication',
        'debug the API performance issues',
        'security audit of the payment system',
        'optimize database query performance'
    ];
    
    testInputs.forEach(input => {
        const result = globalPersonaSystem.generateResponseFormat(input);
        console.log(`\nInput: "${input}"`);
        console.log(result.header);
        console.log(`Switch: ${result.switchInfo.switched ? 'Yes' : 'No'}`);
    });
}