#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Output Quality Benchmark
 * Empirical comparison of documentation quality and stability between v1.0 and v2.0
 */

const fs = require('fs');
const path = require('path');

class OutputQualityBenchmark {
    constructor() {
        this.testRoot = './quality-test';
        this.results = {
            v1: { outputs: [], errors: [], stability: [] },
            v2: { outputs: [], errors: [], stability: [] }
        };
    }

    async runQualityBenchmark() {
        console.log('📝 EMPIRICAL OUTPUT QUALITY BENCHMARK');
        console.log('====================================\n');

        // Create test project
        this.setupTestProject();

        // Run multiple iterations to test stability
        for (let iteration = 1; iteration <= 5; iteration++) {
            console.log(`🔄 Iteration ${iteration}/5`);
            console.log('─'.repeat(30));

            // Modify project slightly each iteration
            this.introduceChanges(iteration);

            // Test v1.0 Legacy System
            const v1Result = await this.testLegacySystem(iteration);
            this.results.v1.outputs.push(v1Result.output);
            this.results.v1.errors.push(v1Result.errors);
            this.results.v1.stability.push(v1Result.stability);

            // Clear and test v2.0 Ultra-Efficient System  
            this.clearCache();
            const v2Result = await this.testUltraEfficientSystem(iteration);
            this.results.v2.outputs.push(v2Result.output);
            this.results.v2.errors.push(v2Result.errors);
            this.results.v2.stability.push(v2Result.stability);

            console.log(`  v1.0: ${v1Result.quality.score}/10 quality, ${v1Result.errors.length} errors`);
            console.log(`  v2.0: ${v2Result.quality.score}/10 quality, ${v2Result.errors.length} errors\n`);
        }

        // Analyze output quality and stability
        this.analyzeOutputQuality();
        this.analyzeStability();
        this.generateQualityReport();

        // Cleanup
        this.cleanup();
    }

    setupTestProject() {
        if (fs.existsSync(this.testRoot)) fs.rmSync(this.testRoot, { recursive: true });
        fs.mkdirSync(this.testRoot, { recursive: true });

        const projectPath = path.join(this.testRoot, 'quality-project');
        fs.mkdirSync(projectPath, { recursive: true });

        // Create realistic project with various file types
        const files = {
            'package.json': JSON.stringify({
                name: 'quality-test-project',
                version: '2.1.0',
                description: 'A comprehensive test project for documentation quality assessment',
                main: 'src/index.js',
                dependencies: {
                    express: '^4.18.0',
                    mongoose: '^7.0.0',
                    joi: '^17.9.0',
                    jsonwebtoken: '^9.0.0'
                },
                devDependencies: {
                    jest: '^29.0.0',
                    nodemon: '^2.0.0'
                }
            }, null, 2),

            'src/index.js': `const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/qualitytest')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`,

            'src/models/User.js': `const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username must not exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    profile: {
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, 'First name must not exceed 50 characters']
        },
        lastName: {
            type: String, 
            trim: true,
            maxlength: [50, 'Last name must not exceed 50 characters']
        },
        avatar: {
            type: String,
            validate: {
                validator: function(v) {
                    return !v || /^https?:\\/\\/.+/.test(v);
                },
                message: 'Avatar must be a valid URL'
            }
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    if (this.profile?.firstName && this.profile?.lastName) {
        return \`\${this.profile.firstName} \${this.profile.lastName}\`;
    }
    return this.username;
});

module.exports = mongoose.model('User', userSchema);`,

            'src/controllers/authController.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');

/**
 * Authentication Controller
 * Handles user registration, login, and token management
 */
class AuthController {
    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async register(req, res, next) {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { username, email, password, firstName, lastName } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'User already exists',
                    field: existingUser.email === email ? 'email' : 'username'
                });
            }

            // Create new user
            const userData = {
                username,
                email,
                password,
                profile: {}
            };

            if (firstName) userData.profile.firstName = firstName;
            if (lastName) userData.profile.lastName = lastName;

            const user = new User(userData);
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        profile: user.profile
                    },
                    token
                }
            });

        } catch (error) {
            console.error('Registration error:', error);
            next(error);
        }
    }

    /**
     * Login user with email/username and password
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object  
     * @param {Function} next - Express next middleware function
     */
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

            const { login, password } = req.body;

            // Find user by email or username
            const user = await User.findOne({
                $or: [
                    { email: login.toLowerCase() },
                    { username: login }
                ]
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated'
                });
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        profile: user.profile,
                        lastLogin: user.lastLogin
                    },
                    token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            next(error);
        }
    }
}

module.exports = new AuthController();`,

            'src/utils/validation.js': `const Joi = require('joi');

/**
 * Validation schemas for request data
 */
const schemas = {
    // User registration validation
    userRegistration: Joi.object({
        username: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
            .messages({
                'string.alphanum': 'Username must contain only alphanumeric characters',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username must not exceed 30 characters',
                'any.required': 'Username is required'
            }),
        
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),
        
        password: Joi.string()
            .min(6)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
            .required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'Password is required'
            }),
        
        firstName: Joi.string()
            .max(50)
            .optional()
            .messages({
                'string.max': 'First name must not exceed 50 characters'
            }),
        
        lastName: Joi.string()
            .max(50)
            .optional()
            .messages({
                'string.max': 'Last name must not exceed 50 characters'
            })
    }),

    // User login validation
    userLogin: Joi.object({
        login: Joi.string()
            .required()
            .messages({
                'any.required': 'Email or username is required'
            }),
        
        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    })
};

/**
 * Middleware factory for request validation
 * @param {string} schemaName - Name of the validation schema to use
 * @returns {Function} Express middleware function
 */
function validateRequest(schemaName) {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return res.status(500).json({
                success: false,
                message: 'Invalid validation schema'
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                value: detail.context.value
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
}

module.exports = {
    schemas,
    validateRequest
};`,

            'tests/auth.test.js': `const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const User = require('../src/models/User');

describe('Authentication Endpoints', () => {
    beforeAll(async () => {
        // Connect to test database
        await mongoose.connect(process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/qualitytest_test');
    });

    beforeEach(async () => {
        // Clear users collection before each test
        await User.deleteMany({});
    });

    afterAll(async () => {
        // Close database connection
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        const validUserData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123',
            firstName: 'Test',
            lastName: 'User'
        };

        it('should register a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(validUserData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.username).toBe(validUserData.username);
            expect(response.body.data.user.email).toBe(validUserData.email);
            expect(response.body.data.token).toBeDefined();
        });

        it('should not register user with duplicate email', async () => {
            // Create first user
            await request(app)
                .post('/api/auth/register')
                .send(validUserData)
                .expect(201);

            // Attempt to create user with same email
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    ...validUserData,
                    username: 'differentuser'
                })
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.field).toBe('email');
        });

        it('should validate required fields', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser'
                    // Missing email and password
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors.length).toBeGreaterThan(0);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            // Create test user
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'Password123'
                });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    login: 'test@example.com',
                    password: 'Password123'
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toBeDefined();
            expect(response.body.data.token).toBeDefined();
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    login: 'test@example.com',
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        });

        it('should not login with non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    login: 'nonexistent@example.com',
                    password: 'Password123'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});`,

            'README.md': `# Quality Test Project

A comprehensive Node.js/Express application for testing documentation generation quality.

## Features

- User authentication with JWT
- MongoDB data persistence
- Input validation with Joi
- Comprehensive test suite
- RESTful API design

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Health Check  
- GET /health - Service health status

## Environment Variables

- MONGODB_URI - MongoDB connection string
- JWT_SECRET - JWT signing secret
- PORT - Server port (default: 3000)
- NODE_ENV - Environment (development/production)
`
        };

        this.writeProjectFiles(projectPath, files);
        console.log('✅ Quality test project created');
    }

    writeProjectFiles(projectPath, files) {
        for (const [filePath, content] of Object.entries(files)) {
            const fullPath = path.join(projectPath, filePath);
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(fullPath, content);
        }
    }

    introduceChanges(iteration) {
        const projectPath = path.join(this.testRoot, 'quality-project');
        
        // Introduce different types of changes each iteration
        switch (iteration) {
            case 1:
                // Add new function to utils
                fs.appendFileSync(
                    path.join(projectPath, 'src/utils/validation.js'),
                    `\n\n/**\n * Added in iteration ${iteration}\n */\nfunction newUtilityFunction() {\n    return 'utility function added';\n}\n\nmodule.exports.newUtilityFunction = newUtilityFunction;`
                );
                break;
                
            case 2:
                // Modify existing controller
                const authPath = path.join(projectPath, 'src/controllers/authController.js');
                let authContent = fs.readFileSync(authPath, 'utf8');
                authContent = authContent.replace(
                    'console.error(\'Registration error:\', error);',
                    `console.error('Registration error:', error);\n        // Added logging in iteration ${iteration}\n        console.log('Additional debug info:', { userId: user?._id, timestamp: new Date().toISOString() });`
                );
                fs.writeFileSync(authPath, authContent);
                break;
                
            case 3:
                // Add new test file
                fs.writeFileSync(
                    path.join(projectPath, 'tests/utils.test.js'),
                    `// Added in iteration ${iteration}\nconst { validateRequest } = require('../src/utils/validation');\n\ndescribe('Validation Utils', () => {\n    it('should validate requests correctly', () => {\n        expect(validateRequest).toBeDefined();\n    });\n});`
                );
                break;
                
            case 4:
                // Modify package.json
                const packagePath = path.join(projectPath, 'package.json');
                const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                packageData.version = '2.2.0';
                packageData.description += ` - Updated in iteration ${iteration}`;
                fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
                break;
                
            case 5:
                // Add middleware file
                fs.writeFileSync(
                    path.join(projectPath, 'src/middleware/logging.js'),
                    `// Added in iteration ${iteration}\nconst logger = (req, res, next) => {\n    console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);\n    next();\n};\n\nmodule.exports = logger;`
                );
                break;
        }
        
        console.log(`  📝 Introduced changes for iteration ${iteration}`);
    }

    async testLegacySystem(iteration) {
        const projectPath = path.join(this.testRoot, 'quality-project');
        
        try {
            const LegacySystem = require('../core/auto-documentation');
            const system = new LegacySystem(projectPath);
            const result = await system.run();
            
            // Analyze output quality
            const output = this.captureDocumentationOutput(projectPath);
            const quality = this.assessDocumentationQuality(output, 'legacy');
            const errors = this.detectErrors(result);
            const stability = this.assessStability(output, iteration, 'legacy');
            
            return {
                output,
                quality,
                errors,
                stability,
                success: true
            };
            
        } catch (error) {
            return {
                output: '',
                quality: { score: 0, issues: ['System error'] },
                errors: [error.message],
                stability: { consistent: false, reason: 'System failure' },
                success: false
            };
        }
    }

    async testUltraEfficientSystem(iteration) {
        const projectPath = path.join(this.testRoot, 'quality-project');
        
        try {
            const UltraSystem = require('../core/auto-documentation-v2');
            const system = new UltraSystem(projectPath);
            const result = await system.run();
            
            // Analyze output quality
            const output = this.captureDocumentationOutput(projectPath);
            const quality = this.assessDocumentationQuality(output, 'ultra');
            const errors = this.detectErrors(result);
            const stability = this.assessStability(output, iteration, 'ultra');
            
            return {
                output,
                quality,
                errors,
                stability,
                success: true
            };
            
        } catch (error) {
            return {
                output: '',
                quality: { score: 0, issues: ['System error'] },
                errors: [error.message],
                stability: { consistent: false, reason: 'System failure' },
                success: false
            };
        }
    }

    captureDocumentationOutput(projectPath) {
        const claudePath = path.join(projectPath, 'CLAUDE.md');
        if (fs.existsSync(claudePath)) {
            return fs.readFileSync(claudePath, 'utf8');
        }
        return '';
    }

    assessDocumentationQuality(output, systemType) {
        const quality = {
            score: 0,
            details: {},
            issues: []
        };

        if (!output || output.length < 100) {
            quality.issues.push('Documentation too short or missing');
            return quality;
        }

        // Check for essential sections
        const essentialSections = [
            'Project Overview',
            'Installation', 
            'Usage',
            'API',
            'Development'
        ];

        let sectionsFound = 0;
        essentialSections.forEach(section => {
            if (output.toLowerCase().includes(section.toLowerCase())) {
                sectionsFound++;
            }
        });

        quality.details.sectionsFound = sectionsFound;
        quality.details.totalSections = essentialSections.length;

        // Check for code examples
        const codeBlocks = (output.match(/```/g) || []).length / 2;
        quality.details.codeBlocks = codeBlocks;

        // Check for proper formatting
        const hasHeadings = /^#+\s/.test(output);
        const hasLists = /^[\*\-\+]\s/m.test(output);
        quality.details.hasFormatting = hasHeadings && hasLists;

        // Check for project-specific content
        const projectSpecific = output.includes('authentication') && 
                               output.includes('mongodb') &&
                               output.includes('express');
        quality.details.projectSpecific = projectSpecific;

        // Calculate score
        let score = 0;
        score += (sectionsFound / essentialSections.length) * 3; // 3 points for sections
        score += Math.min(codeBlocks, 3); // Max 3 points for code examples
        score += quality.details.hasFormatting ? 2 : 0; // 2 points for formatting
        score += projectSpecific ? 2 : 0; // 2 points for project relevance

        quality.score = Math.round(score);

        // Add specific issues
        if (sectionsFound < 3) quality.issues.push('Missing essential documentation sections');
        if (codeBlocks < 1) quality.issues.push('No code examples found');
        if (!quality.details.hasFormatting) quality.issues.push('Poor formatting/structure');
        if (!projectSpecific) quality.issues.push('Generic content, not project-specific');

        return quality;
    }

    detectErrors(result) {
        const errors = [];
        
        if (result?.error) {
            errors.push(result.error);
        }
        
        if (result?.errors && Array.isArray(result.errors)) {
            errors.push(...result.errors);
        }
        
        if (result?.validation && !result.validation.passed) {
            errors.push('Documentation validation failed');
        }

        return errors;
    }

    assessStability(output, iteration, systemType) {
        // Store outputs for stability comparison
        if (!this.stabilityData) {
            this.stabilityData = { legacy: [], ultra: [] };
        }
        
        const systemData = systemType === 'legacy' ? this.stabilityData.legacy : this.stabilityData.ultra;
        systemData.push(output);
        
        if (iteration === 1) {
            return { consistent: true, baseline: true };
        }
        
        // Compare with previous outputs
        const previous = systemData[systemData.length - 2];
        const current = output;
        
        // Simple similarity check
        const similarity = this.calculateSimilarity(previous, current);
        const consistent = similarity > 0.7; // 70% similarity threshold
        
        return {
            consistent,
            similarity: similarity.toFixed(3),
            previousLength: previous.length,
            currentLength: current.length,
            lengthChange: ((current.length - previous.length) / previous.length * 100).toFixed(1) + '%'
        };
    }

    calculateSimilarity(text1, text2) {
        if (!text1 || !text2) return 0;
        
        const words1 = text1.toLowerCase().split(/\s+/);
        const words2 = text2.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        
        return intersection.length / union.length;
    }

    clearCache() {
        const projectPath = path.join(this.testRoot, 'quality-project');
        const cachePath = path.join(projectPath, '.superclaude-cache');
        if (fs.existsSync(cachePath)) {
            fs.rmSync(cachePath, { recursive: true, force: true });
        }
    }

    analyzeOutputQuality() {
        console.log('\n📊 OUTPUT QUALITY ANALYSIS');
        console.log('=========================');

        const v1Scores = this.results.v1.outputs.map((_, i) => this.assessDocumentationQuality(this.results.v1.outputs[i], 'legacy').score);
        const v2Scores = this.results.v2.outputs.map((_, i) => this.assessDocumentationQuality(this.results.v2.outputs[i], 'ultra').score);

        const v1Avg = v1Scores.reduce((a, b) => a + b, 0) / v1Scores.length;
        const v2Avg = v2Scores.reduce((a, b) => a + b, 0) / v2Scores.length;

        console.log(`📝 Documentation Quality (0-10 scale):`);
        console.log(`   v1.0 Legacy: ${v1Avg.toFixed(1)}/10 average`);
        console.log(`   v2.0 Ultra:  ${v2Avg.toFixed(1)}/10 average`);
        console.log(`   Quality diff: ${(v2Avg - v1Avg > 0 ? '+' : '')}${(v2Avg - v1Avg).toFixed(1)} points`);

        const v1Errors = this.results.v1.errors.flat().length;
        const v2Errors = this.results.v2.errors.flat().length;

        console.log(`\n❌ Error Rates:`);
        console.log(`   v1.0 Legacy: ${v1Errors} total errors`);
        console.log(`   v2.0 Ultra:  ${v2Errors} total errors`);
        console.log(`   Error reduction: ${v1Errors - v2Errors} fewer errors`);
    }

    analyzeStability() {
        console.log('\n📈 STABILITY ANALYSIS');
        console.log('====================');

        const v1Stability = this.results.v1.stability.filter(s => s.consistent).length;
        const v2Stability = this.results.v2.stability.filter(s => s.consistent).length;
        const totalIterations = this.results.v1.stability.length;

        console.log(`🔄 Output Consistency:`);
        console.log(`   v1.0 Legacy: ${v1Stability}/${totalIterations} iterations consistent`);
        console.log(`   v2.0 Ultra:  ${v2Stability}/${totalIterations} iterations consistent`);
        console.log(`   Stability improvement: ${((v2Stability - v1Stability) / totalIterations * 100).toFixed(1)}%`);

        // Analyze similarity scores
        const v1Similarities = this.results.v1.stability.filter(s => s.similarity).map(s => parseFloat(s.similarity));
        const v2Similarities = this.results.v2.stability.filter(s => s.similarity).map(s => parseFloat(s.similarity));

        if (v1Similarities.length > 0 && v2Similarities.length > 0) {
            const v1AvgSim = v1Similarities.reduce((a, b) => a + b, 0) / v1Similarities.length;
            const v2AvgSim = v2Similarities.reduce((a, b) => a + b, 0) / v2Similarities.length;

            console.log(`\n🎯 Average Output Similarity:`);
            console.log(`   v1.0 Legacy: ${(v1AvgSim * 100).toFixed(1)}% similarity between runs`);
            console.log(`   v2.0 Ultra:  ${(v2AvgSim * 100).toFixed(1)}% similarity between runs`);
        }
    }

    generateQualityReport() {
        console.log('\n🎯 QUALITY & STABILITY SUMMARY');
        console.log('==============================');

        // Calculate overall metrics
        const v1QualityScores = this.results.v1.outputs.map((output, i) => 
            this.assessDocumentationQuality(output, 'legacy').score
        );
        const v2QualityScores = this.results.v2.outputs.map((output, i) => 
            this.assessDocumentationQuality(output, 'ultra').score
        );

        const v1QualityAvg = v1QualityScores.reduce((a, b) => a + b, 0) / v1QualityScores.length;
        const v2QualityAvg = v2QualityScores.reduce((a, b) => a + b, 0) / v2QualityScores.length;

        const v1ErrorCount = this.results.v1.errors.flat().length;
        const v2ErrorCount = this.results.v2.errors.flat().length;

        const v1ConsistencyRate = this.results.v1.stability.filter(s => s.consistent).length / this.results.v1.stability.length;
        const v2ConsistencyRate = this.results.v2.stability.filter(s => s.consistent).length / this.results.v2.stability.length;

        console.log(`✅ QUALITY COMPARISON:`);
        console.log(`   Documentation Quality: v2.0 ${v2QualityAvg > v1QualityAvg ? 'BETTER' : v2QualityAvg < v1QualityAvg ? 'WORSE' : 'EQUAL'} (${v2QualityAvg.toFixed(1)} vs ${v1QualityAvg.toFixed(1)})`);
        console.log(`   Error Rate: v2.0 ${v2ErrorCount < v1ErrorCount ? 'BETTER' : v2ErrorCount > v1ErrorCount ? 'WORSE' : 'EQUAL'} (${v2ErrorCount} vs ${v1ErrorCount} errors)`);
        console.log(`   Stability: v2.0 ${v2ConsistencyRate > v1ConsistencyRate ? 'MORE STABLE' : v2ConsistencyRate < v1ConsistencyRate ? 'LESS STABLE' : 'EQUAL'} (${(v2ConsistencyRate*100).toFixed(1)}% vs ${(v1ConsistencyRate*100).toFixed(1)}% consistent)`);

        // Overall verdict
        const qualityBetter = v2QualityAvg > v1QualityAvg;
        const errorsBetter = v2ErrorCount < v1ErrorCount;
        const stabilityBetter = v2ConsistencyRate > v1ConsistencyRate;

        const improvementCount = [qualityBetter, errorsBetter, stabilityBetter].filter(Boolean).length;

        console.log(`\n🏆 OVERALL VERDICT:`);
        if (improvementCount >= 2) {
            console.log(`   v2.0 Ultra-Efficient produces BETTER quality and more stable results`);
        } else if (improvementCount === 1) {
            console.log(`   v2.0 Ultra-Efficient shows MIXED results vs v1.0 Legacy`);
        } else {
            console.log(`   v1.0 Legacy produces better quality results than v2.0`);
        }

        // Save detailed report
        this.saveQualityReport({
            v1QualityAvg, v2QualityAvg,
            v1ErrorCount, v2ErrorCount,
            v1ConsistencyRate, v2ConsistencyRate,
            improvementCount
        });
    }

    saveQualityReport(summary) {
        const report = {
            timestamp: new Date().toISOString(),
            methodology: {
                iterations: 5,
                projectType: 'Node.js/Express application',
                changesIntroduced: 'Progressive modifications each iteration',
                qualityMetrics: 'Documentation completeness, formatting, project relevance'
            },
            results: {
                v1: {
                    qualityScores: this.results.v1.outputs.map(output => this.assessDocumentationQuality(output, 'legacy')),
                    errors: this.results.v1.errors,
                    stability: this.results.v1.stability
                },
                v2: {
                    qualityScores: this.results.v2.outputs.map(output => this.assessDocumentationQuality(output, 'ultra')),
                    errors: this.results.v2.errors,
                    stability: this.results.v2.stability
                }
            },
            summary
        };

        const reportPath = path.join(__dirname, '../output-quality-benchmark-results.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed quality report saved: ${reportPath}`);
    }

    cleanup() {
        if (fs.existsSync(this.testRoot)) {
            fs.rmSync(this.testRoot, { recursive: true, force: true });
            console.log('\n🧹 Quality test environment cleaned up');
        }
    }
}

// Run quality benchmark if called directly
if (require.main === module) {
    const benchmark = new OutputQualityBenchmark();
    benchmark.runQualityBenchmark()
        .then(() => {
            console.log('\n✅ Output quality benchmark completed successfully');
        })
        .catch(error => {
            console.error('\n❌ Quality benchmark failed:', error);
            process.exit(1);
        });
}

module.exports = OutputQualityBenchmark;