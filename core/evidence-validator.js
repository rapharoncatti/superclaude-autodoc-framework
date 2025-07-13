#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework v2.0 - Evidence-Based Validator
 * Anti-hallucination engine with fact verification and constraint validation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class EvidenceBasedValidator {
    constructor(projectRoot = process.cwd()) {
        this.projectRoot = projectRoot;
        this.cacheDir = path.join(projectRoot, '.superclaude-cache');
        this.factDbPath = path.join(this.cacheDir, 'fact-database.json');
        this.constraintsPath = path.join(this.cacheDir, 'constraint-rules.json');
        this.evidencePath = path.join(this.cacheDir, 'evidence-chains.json');
        
        this.initializeValidator();
        this.loadKnowledgeBases();
    }

    // Initialize validator with default knowledge bases
    initializeValidator() {
        // Ensure cache directory exists
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }

        // Initialize fact database if not exists
        if (!fs.existsSync(this.factDbPath)) {
            this.createDefaultFactDatabase();
        }

        // Initialize constraints if not exists
        if (!fs.existsSync(this.constraintsPath)) {
            this.createDefaultConstraints();
        }

        // Initialize evidence chains if not exists
        if (!fs.existsSync(this.evidencePath)) {
            fs.writeFileSync(this.evidencePath, JSON.stringify({}, null, 2));
        }
    }

    // Create default fact database with project truths
    createDefaultFactDatabase() {
        const defaultFacts = {
            // File system facts (ground truth)
            files: {},
            directories: {},
            
            // Project configuration facts
            project: {
                type: null,
                technologies: [],
                dependencies: {},
                lastVerified: null
            },

            // Code structure facts
            components: {},
            functions: {},
            classes: {},
            
            // Architecture facts
            patterns: {},
            integrations: {},
            
            // Performance facts
            metrics: {},
            
            // Version control facts
            git: {
                branch: null,
                lastCommit: null,
                remotes: []
            }
        };

        fs.writeFileSync(this.factDbPath, JSON.stringify(defaultFacts, null, 2));
    }

    // Create default constraint rules (never violate these)
    createDefaultConstraints() {
        const defaultConstraints = {
            // File system constraints
            filesystem: {
                "never_delete_without_backup": {
                    rule: "Never suggest deleting files without creating backups",
                    severity: "critical",
                    evidence_required: ["backup_exists", "user_confirmation"]
                },
                "respect_gitignore": {
                    rule: "Never document or process files in .gitignore",
                    severity: "high",
                    evidence_required: ["gitignore_check"]
                }
            },

            // Code quality constraints
            code: {
                "maintain_compilation": {
                    rule: "Never suggest changes that break compilation",
                    severity: "critical",
                    evidence_required: ["syntax_valid", "dependencies_resolved"]
                },
                "preserve_functionality": {
                    rule: "Document actual behavior, not assumed behavior",
                    severity: "high",
                    evidence_required: ["runtime_verification", "test_results"]
                }
            },

            // Documentation constraints
            documentation: {
                "accuracy_over_completeness": {
                    rule: "Better to have accurate partial docs than complete inaccurate docs",
                    severity: "high",
                    evidence_required: ["source_verification"]
                },
                "no_speculation": {
                    rule: "Never document speculative or unverified information",
                    severity: "critical",
                    evidence_required: ["direct_evidence"]
                }
            },

            // Security constraints
            security: {
                "no_secret_exposure": {
                    rule: "Never document or log sensitive information",
                    severity: "critical",
                    evidence_required: ["secret_scan_clean"]
                }
            }
        };

        fs.writeFileSync(this.constraintsPath, JSON.stringify(defaultConstraints, null, 2));
    }

    // Load all knowledge bases into memory
    loadKnowledgeBases() {
        try {
            this.factDatabase = JSON.parse(fs.readFileSync(this.factDbPath, 'utf8'));
            this.constraints = JSON.parse(fs.readFileSync(this.constraintsPath, 'utf8'));
            this.evidenceChains = JSON.parse(fs.readFileSync(this.evidencePath, 'utf8'));
        } catch (error) {
            console.error('Failed to load knowledge bases:', error.message);
            this.factDatabase = {};
            this.constraints = {};
            this.evidenceChains = {};
        }
    }

    // Update fact database with verified information
    updateFact(category, key, value, evidence = []) {
        if (!this.factDatabase[category]) {
            this.factDatabase[category] = {};
        }

        // Create fact entry with evidence chain
        this.factDatabase[category][key] = {
            value,
            lastUpdated: Date.now(),
            evidence,
            verificationLevel: this.calculateVerificationLevel(evidence),
            hash: this.generateFactHash(category, key, value)
        };

        this.saveFactDatabase();
        this.recordEvidenceChain(category, key, evidence);
    }

    // Calculate verification level based on evidence quality
    calculateVerificationLevel(evidence) {
        if (evidence.length === 0) return 'unverified';
        
        const evidenceTypes = evidence.map(e => e.type || 'unknown');
        
        if (evidenceTypes.includes('filesystem_check')) return 'verified';
        if (evidenceTypes.includes('runtime_test')) return 'high';
        if (evidenceTypes.includes('source_analysis')) return 'medium';
        
        return 'low';
    }

    // Generate unique hash for fact verification
    generateFactHash(category, key, value) {
        const factString = `${category}:${key}:${JSON.stringify(value)}`;
        return crypto.createHash('sha256').update(factString).digest('hex').slice(0, 16);
    }

    // Validate claim against known facts and constraints
    async validateClaim(claim, context = {}) {
        const validation = {
            isValid: true,
            confidence: 1.0,
            violations: [],
            supportingEvidence: [],
            contradictingEvidence: [],
            requiredEvidence: [],
            recommendation: 'proceed'
        };

        // Check constraint violations
        const constraintViolations = this.checkConstraintViolations(claim, context);
        if (constraintViolations.length > 0) {
            validation.isValid = false;
            validation.violations = constraintViolations;
            validation.confidence = 0.0;
            validation.recommendation = 'reject';
            return validation;
        }

        // Check against fact database
        const factCheck = this.checkAgainstFacts(claim, context);
        validation.supportingEvidence = factCheck.supporting;
        validation.contradictingEvidence = factCheck.contradicting;

        // Calculate confidence based on evidence
        validation.confidence = this.calculateConfidence(
            factCheck.supporting,
            factCheck.contradicting,
            claim
        );

        // Determine if more evidence is needed
        if (validation.confidence < 0.7) {
            validation.requiredEvidence = this.identifyRequiredEvidence(claim, context);
            validation.recommendation = 'verify';
        }

        return validation;
    }

    // Check for constraint violations
    checkConstraintViolations(claim, context) {
        const violations = [];

        for (const [category, categoryConstraints] of Object.entries(this.constraints)) {
            for (const [constraintId, constraint] of Object.entries(categoryConstraints)) {
                if (this.claimViolatesConstraint(claim, constraint, context)) {
                    violations.push({
                        category,
                        constraintId,
                        rule: constraint.rule,
                        severity: constraint.severity,
                        evidence_required: constraint.evidence_required
                    });
                }
            }
        }

        return violations;
    }

    // Check if claim violates specific constraint
    claimViolatesConstraint(claim, constraint, context) {
        const claimLower = claim.toLowerCase();
        
        // Rule-based violation detection
        if (constraint.rule.includes('Never delete') && claimLower.includes('delete')) {
            return !this.hasRequiredEvidence(['backup_exists', 'user_confirmation'], context);
        }

        if (constraint.rule.includes('break compilation') && claimLower.includes('error')) {
            return true;
        }

        if (constraint.rule.includes('speculative') && this.containsSpeculativeLanguage(claim)) {
            return true;
        }

        return false;
    }

    // Detect speculative language that might indicate hallucination
    containsSpeculativeLanguage(text) {
        const speculativeTerms = [
            'probably', 'likely', 'might', 'could be', 'seems to',
            'appears to', 'presumably', 'supposedly', 'I think',
            'maybe', 'perhaps', 'potentially', 'possibly'
        ];

        return speculativeTerms.some(term => 
            text.toLowerCase().includes(term)
        );
    }

    // Check required evidence is present
    hasRequiredEvidence(requiredTypes, context) {
        const availableEvidence = context.evidence || [];
        const availableTypes = availableEvidence.map(e => e.type);

        return requiredTypes.every(type => availableTypes.includes(type));
    }

    // Check claim against fact database
    checkAgainstFacts(claim, context) {
        const supporting = [];
        const contradicting = [];

        // Check file system facts
        if (this.factDatabase.files) {
            for (const [filePath, fileData] of Object.entries(this.factDatabase.files)) {
                if (claim.includes(filePath)) {
                    supporting.push({
                        type: 'file_exists',
                        evidence: fileData,
                        confidence: fileData.verificationLevel === 'verified' ? 1.0 : 0.7
                    });
                }
            }
        }

        // Check component facts
        if (this.factDatabase.components) {
            for (const [componentName, componentData] of Object.entries(this.factDatabase.components)) {
                if (claim.includes(componentName)) {
                    supporting.push({
                        type: 'component_verified',
                        evidence: componentData,
                        confidence: componentData.verificationLevel === 'verified' ? 1.0 : 0.7
                    });
                }
            }
        }

        return { supporting, contradicting };
    }

    // Calculate confidence score based on evidence
    calculateConfidence(supportingEvidence, contradictingEvidence, claim) {
        let confidence = 0.5; // Start neutral

        // Boost confidence for supporting evidence
        supportingEvidence.forEach(evidence => {
            confidence += evidence.confidence * 0.3;
        });

        // Reduce confidence for contradicting evidence
        contradictingEvidence.forEach(evidence => {
            confidence -= evidence.confidence * 0.4;
        });

        // Penalty for speculative language
        if (this.containsSpeculativeLanguage(claim)) {
            confidence -= 0.2;
        }

        // Boost for specific, verifiable claims
        if (this.isSpecificClaim(claim)) {
            confidence += 0.1;
        }

        return Math.max(0.0, Math.min(1.0, confidence));
    }

    // Check if claim is specific and verifiable
    isSpecificClaim(claim) {
        const specificIndicators = [
            /\b\d+\b/, // Contains numbers
            /\.cs$|\.js$|\.py$/, // File extensions
            /function\s+\w+/, // Function names
            /class\s+\w+/, // Class names
            /line\s+\d+/ // Line numbers
        ];

        return specificIndicators.some(pattern => pattern.test(claim));
    }

    // Identify what evidence is needed to verify claim
    identifyRequiredEvidence(claim, context) {
        const required = [];

        if (claim.includes('file') || claim.includes('script')) {
            required.push('filesystem_check');
        }

        if (claim.includes('function') || claim.includes('method')) {
            required.push('source_analysis');
        }

        if (claim.includes('working') || claim.includes('functionality')) {
            required.push('runtime_test');
        }

        if (claim.includes('performance') || claim.includes('speed')) {
            required.push('performance_measurement');
        }

        return required;
    }

    // Record evidence chain for decision
    recordEvidenceChain(category, key, evidence) {
        const chainId = `${category}_${key}_${Date.now()}`;
        
        this.evidenceChains[chainId] = {
            category,
            key,
            evidence,
            created: Date.now(),
            verificationPath: evidence.map(e => e.type).join(' -> ')
        };

        this.saveEvidenceChains();
    }

    // Perform reality check against file system
    async performRealityCheck(claims) {
        const results = [];

        for (const claim of claims) {
            const result = {
                claim,
                verified: false,
                evidence: [],
                discrepancies: []
            };

            // Check file existence claims
            const fileMatches = claim.match(/file\s+([^\s]+)/gi) || [];
            for (const match of fileMatches) {
                const fileName = match.split(' ')[1];
                const filePath = path.join(this.projectRoot, fileName);
                
                if (fs.existsSync(filePath)) {
                    result.evidence.push({
                        type: 'file_exists',
                        file: fileName,
                        verified: true
                    });
                } else {
                    result.discrepancies.push({
                        type: 'file_not_found',
                        file: fileName,
                        claim: match
                    });
                }
            }

            result.verified = result.discrepancies.length === 0;
            results.push(result);
        }

        return results;
    }

    // Save fact database to disk
    saveFactDatabase() {
        fs.writeFileSync(this.factDbPath, JSON.stringify(this.factDatabase, null, 2));
    }

    // Save evidence chains to disk
    saveEvidenceChains() {
        fs.writeFileSync(this.evidencePath, JSON.stringify(this.evidenceChains, null, 2));
    }

    // Get validation statistics
    getValidationStats() {
        const stats = {
            totalFacts: 0,
            verifiedFacts: 0,
            evidenceChains: Object.keys(this.evidenceChains).length,
            constraintRules: 0
        };

        // Count facts by verification level
        for (const category of Object.values(this.factDatabase)) {
            if (typeof category === 'object' && category !== null) {
                for (const fact of Object.values(category)) {
                    if (fact.verificationLevel) {
                        stats.totalFacts++;
                        if (fact.verificationLevel === 'verified') {
                            stats.verifiedFacts++;
                        }
                    }
                }
            }
        }

        // Count constraint rules
        for (const category of Object.values(this.constraints)) {
            stats.constraintRules += Object.keys(category).length;
        }

        return stats;
    }
}

module.exports = EvidenceBasedValidator;