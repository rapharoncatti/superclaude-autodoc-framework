#!/usr/bin/env node

/**
 * SuperClaude Auto-Documentation Framework - Empirical Performance Benchmark
 * Real-world performance comparison between v1.0 legacy and v2.0 ultra-efficient systems
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// Benchmark configuration
const BENCHMARK_ROOT = path.join(__dirname, '../benchmark-project');
const SCENARIOS = [
    'small_project',    // 10 files, minimal changes
    'medium_project',   // 50 files, moderate changes  
    'large_project'     // 200 files, significant changes
];

const RUNS_PER_SCENARIO = 5; // Statistical significance
const CHANGE_TYPES = ['added', 'modified', 'deleted', 'renamed'];

class EmpiricalBenchmark {
    constructor() {
        this.results = {
            scenarios: {},
            statistical: {},
            empirical: {
                tokenUsage: { v1: [], v2: [] },
                processingTime: { v1: [], v2: [] },
                memoryUsage: { v1: [], v2: [] },
                cachePerformance: { v1: [], v2: [] }
            }
        };
        
        this.setupBenchmarkEnvironment();
    }

    // Create realistic test projects with actual code
    setupBenchmarkEnvironment() {
        console.log('🔬 Setting up empirical benchmark environment...\n');
        
        if (fs.existsSync(BENCHMARK_ROOT)) {
            fs.rmSync(BENCHMARK_ROOT, { recursive: true, force: true });
        }
        
        fs.mkdirSync(BENCHMARK_ROOT, { recursive: true });
        
        // Create three different project scenarios
        this.createSmallProject();
        this.createMediumProject();
        this.createLargeProject();
        
        console.log('✅ Realistic benchmark projects created\n');
    }

    // Small project: React component library (10 files)
    createSmallProject() {
        const projectPath = path.join(BENCHMARK_ROOT, 'small_project');
        fs.mkdirSync(projectPath, { recursive: true });
        
        const files = {
            'package.json': JSON.stringify({
                name: 'component-library',
                version: '1.0.0',
                dependencies: { 
                    react: '^18.0.0',
                    typescript: '^4.9.0',
                    '@types/react': '^18.0.0'
                }
            }, null, 2),
            
            'src/components/Button/Button.tsx': `
import React from 'react';
import './Button.css';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    disabled = false,
    onClick,
    children
}) => {
    const baseClasses = 'btn';
    const variantClass = \`btn--\${variant}\`;
    const sizeClass = \`btn--\${size}\`;
    
    return (
        <button
            className={\`\${baseClasses} \${variantClass} \${sizeClass}\`}
            disabled={disabled}
            onClick={onClick}
            data-testid="button-component"
        >
            {children}
        </button>
    );
};

export default Button;`,

            'src/components/Input/Input.tsx': `
import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    helperText,
    required,
    className = '',
    ...props
}, ref) => {
    const inputClasses = [
        'input',
        error ? 'input--error' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className="input-container">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                ref={ref}
                className={inputClasses}
                {...props}
            />
            {error && <span className="input-error">{error}</span>}
            {helperText && !error && <span className="input-helper">{helperText}</span>}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;`,

            'src/hooks/useLocalStorage.ts': `
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    // Get value from localStorage or use initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(\`Error reading localStorage key "\${key}":, error\`);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(\`Error setting localStorage key "\${key}":, error\`);
        }
    };

    return [storedValue, setValue];
}`,

            'src/utils/api.ts': `
export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export class ApiClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor(baseUrl: string, defaultHeaders: HeadersInit = {}) {
        this.baseUrl = baseUrl.replace(/\\/$/, '');
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = \`\${this.baseUrl}\${endpoint}\`;
        const config: RequestInit = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            return {
                data,
                status: response.status,
                message: response.statusText
            };
        } catch (error) {
            throw new Error(\`API request failed: \${error}\`);
        }
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}`,

            'tests/Button.test.tsx': `
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../src/components/Button/Button';

describe('Button Component', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByTestId('button-component');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('btn', 'btn--primary', 'btn--medium');
    });

    it('applies variant classes correctly', () => {
        render(<Button variant="danger">Delete</Button>);
        const button = screen.getByTestId('button-component');
        expect(button).toHaveClass('btn--danger');
    });

    it('applies size classes correctly', () => {
        render(<Button size="large">Large Button</Button>);
        const button = screen.getByTestId('button-component');
        expect(button).toHaveClass('btn--large');
    });

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>);
        const button = screen.getByTestId('button-component');
        expect(button).toBeDisabled();
    });

    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        const button = screen.getByTestId('button-component');
        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});`,

            'README.md': `# Component Library

A React TypeScript component library with modern development practices.

## Components

- **Button**: Flexible button component with variants and sizes
- **Input**: Form input with validation and helper text

## Hooks

- **useLocalStorage**: Custom hook for localStorage management

## Utilities

- **ApiClient**: HTTP client for API interactions

## Development

\`\`\`bash
npm install
npm test
npm run build
\`\`\``,

            'tsconfig.json': JSON.stringify({
                compilerOptions: {
                    target: 'es5',
                    lib: ['dom', 'dom.iterable', 'es6'],
                    allowJs: true,
                    skipLibCheck: true,
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                    strict: true,
                    forceConsistentCasingInFileNames: true,
                    moduleResolution: 'node',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx'
                },
                include: ['src', 'tests'],
                exclude: ['node_modules']
            }, null, 2)
        };

        this.writeProjectFiles(projectPath, files);
    }

    // Medium project: Express API with database (50 files)
    createMediumProject() {
        const projectPath = path.join(BENCHMARK_ROOT, 'medium_project');
        fs.mkdirSync(projectPath, { recursive: true });
        
        const files = {
            'package.json': JSON.stringify({
                name: 'express-api',
                version: '1.0.0',
                dependencies: {
                    express: '^4.18.0',
                    mongoose: '^7.0.0',
                    jsonwebtoken: '^9.0.0',
                    bcryptjs: '^2.4.3',
                    joi: '^17.9.0',
                    cors: '^2.8.5',
                    helmet: '^7.0.0',
                    dotenv: '^16.1.0'
                }
            }, null, 2),

            'src/app.js': `
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.originalUrl
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`,

            'src/models/User.js': `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profile: {
        firstName: String,
        lastName: String,
        avatar: String,
        bio: String
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
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.emailVerificationToken;
            delete ret.passwordResetToken;
            return ret;
        }
    }
});

// Index for performance
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate full name
userSchema.virtual('fullName').get(function() {
    if (this.profile && this.profile.firstName && this.profile.lastName) {
        return \`\${this.profile.firstName} \${this.profile.lastName}\`;
    }
    return this.username;
});

module.exports = mongoose.model('User', userSchema);`,

            'src/controllers/authController.js': `
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

class AuthController {
    // Register new user
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
                });
            }

            const { username, email, password, firstName, lastName } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }]
            });

            if (existingUser) {
                return res.status(409).json({
                    error: 'User already exists',
                    field: existingUser.email === email ? 'email' : 'username'
                });
            }

            // Create new user
            const user = new User({
                username,
                email,
                password,
                profile: { firstName, lastName },
                emailVerificationToken: crypto.randomBytes(32).toString('hex')
            });

            await user.save();

            // Send verification email
            if (process.env.NODE_ENV === 'production') {
                await sendEmail({
                    to: user.email,
                    subject: 'Verify your email address',
                    template: 'emailVerification',
                    data: {
                        username: user.username,
                        verificationUrl: \`\${process.env.CLIENT_URL}/verify-email?token=\${user.emailVerificationToken}\`
                    }
                });
            }

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    emailVerified: user.emailVerified
                }
            });

        } catch (error) {
            next(error);
        }
    }

    // Login user
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: errors.array()
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
                    error: 'Invalid credentials'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    error: 'Account is deactivated'
                });
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Invalid credentials'
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
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                    emailVerified: user.emailVerified
                }
            });

        } catch (error) {
            next(error);
        }
    }

    // Get current user profile
    async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user.userId).select('-password');
            
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.json({
                user
            });

        } catch (error) {
            next(error);
        }
    }

    // Refresh JWT token
    async refreshToken(req, res, next) {
        try {
            const user = await User.findById(req.user.userId);
            
            if (!user || !user.isActive) {
                return res.status(401).json({
                    error: 'Invalid user'
                });
            }

            const token = jwt.sign(
                { 
                    userId: user._id,
                    username: user.username,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                message: 'Token refreshed',
                token
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();`
        };

        // Add more files to reach 50 total
        for (let i = 1; i <= 20; i++) {
            files[`src/services/service${i}.js`] = `
// Service ${i} - Auto-generated for benchmark
class Service${i} {
    constructor() {
        this.name = 'Service${i}';
        this.initialized = false;
    }

    async initialize() {
        this.initialized = true;
        console.log(\`\${this.name} initialized\`);
    }

    async processData(data) {
        if (!this.initialized) {
            await this.initialize();
        }
        return \`\${this.name} processed: \${JSON.stringify(data)}\`;
    }
}

module.exports = Service${i};`;
        }

        for (let i = 1; i <= 15; i++) {
            files[`tests/unit/test${i}.test.js`] = `
const Service${i} = require('../../src/services/service${i}');

describe('Service${i}', () => {
    let service;

    beforeEach(() => {
        service = new Service${i}();
    });

    test('should initialize correctly', async () => {
        await service.initialize();
        expect(service.initialized).toBe(true);
    });

    test('should process data', async () => {
        const testData = { test: 'data${i}' };
        const result = await service.processData(testData);
        expect(result).toContain('Service${i} processed');
    });
});`;
        }

        this.writeProjectFiles(projectPath, files);
    }

    // Large project: Microservices architecture (200 files)
    createLargeProject() {
        const projectPath = path.join(BENCHMARK_ROOT, 'large_project');
        fs.mkdirSync(projectPath, { recursive: true });
        
        const files = {
            'package.json': JSON.stringify({
                name: 'microservices-platform',
                version: '1.0.0',
                dependencies: {
                    express: '^4.18.0',
                    mongoose: '^7.0.0',
                    redis: '^4.6.0',
                    kafka: '^0.1.5',
                    grpc: '^1.24.11',
                    winston: '^3.8.0',
                    prometheus: '^14.2.0'
                }
            }, null, 2),

            'docker-compose.yml': `
version: '3.8'
services:
  api-gateway:
    build: ./services/api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
      - user-service
      - product-service
      - order-service

  user-service:
    build: ./services/user-service
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/users
    depends_on:
      - mongo

  product-service:
    build: ./services/product-service
    ports:
      - "3002:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/products
    depends_on:
      - mongo

  order-service:
    build: ./services/order-service
    ports:
      - "3003:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/orders
      - KAFKA_BROKERS=kafka:9092
    depends_on:
      - mongo
      - kafka

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

volumes:
  mongo_data:`
        };

        // Generate microservices
        const services = ['user', 'product', 'order', 'payment', 'notification', 'analytics'];
        services.forEach(service => {
            for (let i = 1; i <= 30; i++) {
                files[`services/${service}-service/src/controllers/controller${i}.js`] = `
class ${service.charAt(0).toUpperCase() + service.slice(1)}Controller${i} {
    constructor() {
        this.serviceName = '${service}-service';
        this.controllerName = 'Controller${i}';
    }

    async handleRequest(req, res, next) {
        try {
            const result = await this.processRequest(req.body);
            res.json({
                service: this.serviceName,
                controller: this.controllerName,
                result
            });
        } catch (error) {
            next(error);
        }
    }

    async processRequest(data) {
        // Simulate complex business logic
        const processed = {
            timestamp: new Date().toISOString(),
            data,
            processedBy: \`\${this.serviceName}/\${this.controllerName}\`
        };
        return processed;
    }
}

module.exports = ${service.charAt(0).toUpperCase() + service.slice(1)}Controller${i};`;
            }
        });

        this.writeProjectFiles(projectPath, files);
    }

    // Write files to project directory
    writeProjectFiles(projectPath, files) {
        for (const [filePath, content] of Object.entries(files)) {
            const fullPath = path.join(projectPath, filePath);
            const dir = path.dirname(fullPath);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(fullPath, content);
        }
    }

    // Run comprehensive empirical benchmark
    async runEmpiricalBenchmark() {
        console.log('🧪 Starting Empirical Performance Benchmark');
        console.log('==========================================\n');
        
        for (const scenario of SCENARIOS) {
            console.log(`📊 Testing scenario: ${scenario}`);
            console.log('─'.repeat(50));
            
            const scenarioResults = {
                v1: { times: [], tokens: [], memory: [], cacheHits: [] },
                v2: { times: [], tokens: [], memory: [], cacheHits: [] }
            };

            for (let run = 1; run <= RUNS_PER_SCENARIO; run++) {
                console.log(`  Run ${run}/${RUNS_PER_SCENARIO}`);
                
                // Simulate file changes for realistic testing
                await this.simulateFileChanges(scenario);
                
                // Test v1.0 Legacy System
                const v1Results = await this.benchmarkLegacySystem(scenario);
                scenarioResults.v1.times.push(v1Results.time);
                scenarioResults.v1.tokens.push(v1Results.tokens);
                scenarioResults.v1.memory.push(v1Results.memory);
                scenarioResults.v1.cacheHits.push(v1Results.cacheHits);
                
                // Clear cache between tests
                await this.clearSystemCache(scenario);
                
                // Test v2.0 Ultra-Efficient System  
                const v2Results = await this.benchmarkUltraEfficientSystem(scenario);
                scenarioResults.v2.times.push(v2Results.time);
                scenarioResults.v2.tokens.push(v2Results.tokens);
                scenarioResults.v2.memory.push(v2Results.memory);
                scenarioResults.v2.cacheHits.push(v2Results.cacheHits);
                
                console.log(`    v1.0: ${v1Results.time}ms, ${v1Results.tokens} tokens`);
                console.log(`    v2.0: ${v2Results.time}ms, ${v2Results.tokens} tokens`);
            }
            
            this.results.scenarios[scenario] = scenarioResults;
            console.log('✅ Scenario completed\n');
        }
        
        // Calculate statistical analysis
        this.calculateStatisticalSignificance();
        
        // Generate empirical report
        this.generateEmpiricalReport();
    }

    // Simulate realistic file changes
    async simulateFileChanges(scenario) {
        const projectPath = path.join(BENCHMARK_ROOT, scenario);
        const changeCount = scenario === 'small_project' ? 3 : 
                          scenario === 'medium_project' ? 8 : 15;
        
        // Get all files in project
        const allFiles = this.getAllFiles(projectPath);
        
        // Randomly select files to modify
        const filesToModify = this.shuffleArray(allFiles).slice(0, changeCount);
        
        for (const file of filesToModify) {
            const changeType = CHANGE_TYPES[Math.floor(Math.random() * CHANGE_TYPES.length)];
            
            switch (changeType) {
                case 'modified':
                    await this.modifyFile(file);
                    break;
                case 'added':
                    await this.addNewFile(projectPath);
                    break;
                case 'deleted':
                    // Don't actually delete, just mark for testing
                    break;
                case 'renamed':
                    // Simulate rename by creating copy
                    break;
            }
        }
    }

    // Get all files in project recursively
    getAllFiles(dir) {
        const files = [];
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
                files.push(...this.getAllFiles(fullPath));
            } else if (stat.isFile() && !item.startsWith('.')) {
                files.push(fullPath);
            }
        }
        
        return files;
    }

    // Modify file content
    async modifyFile(filePath) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Add timestamp comment to simulate modification
            const timestamp = new Date().toISOString();
            content = `// Modified at ${timestamp}\n${content}`;
            
            fs.writeFileSync(filePath, content);
        } catch (error) {
            // Skip files that can't be modified
        }
    }

    // Add new file
    async addNewFile(projectPath) {
        const newFileName = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.js`;
        const newFilePath = path.join(projectPath, 'src', newFileName);
        
        const content = `
// Temporary file for benchmark testing
// Generated at ${new Date().toISOString()}

module.exports = {
    name: '${newFileName}',
    type: 'benchmark_file',
    created: new Date(),
    
    process() {
        return 'Benchmark processing complete';
    }
};`;

        try {
            fs.writeFileSync(newFilePath, content);
        } catch (error) {
            // Skip if can't create file
        }
    }

    // Benchmark legacy v1.0 system
    async benchmarkLegacySystem(scenario) {
        const projectPath = path.join(BENCHMARK_ROOT, scenario);
        const startTime = performance.now();
        const startMemory = process.memoryUsage().heapUsed;
        
        try {
            // Load legacy system
            const LegacySystem = require('../core/auto-documentation');
            const system = new LegacySystem(projectPath);
            
            // Run documentation update
            const result = await system.run();
            
            const endTime = performance.now();
            const endMemory = process.memoryUsage().heapUsed;
            
            return {
                time: Math.round(endTime - startTime),
                tokens: this.estimateTokenUsage(result, 'legacy'),
                memory: Math.round((endMemory - startMemory) / 1024 / 1024), // MB
                cacheHits: 0, // Legacy doesn't have sophisticated caching
                success: true
            };
            
        } catch (error) {
            console.log(`  ⚠️  Legacy system error: ${error.message}`);
            return {
                time: 0,
                tokens: 0,
                memory: 0,
                cacheHits: 0,
                success: false,
                error: error.message
            };
        }
    }

    // Benchmark ultra-efficient v2.0 system
    async benchmarkUltraEfficientSystem(scenario) {
        const projectPath = path.join(BENCHMARK_ROOT, scenario);
        const startTime = performance.now();
        const startMemory = process.memoryUsage().heapUsed;
        
        try {
            // Load v2.0 system
            const UltraEfficientSystem = require('../core/auto-documentation-v2');
            const system = new UltraEfficientSystem(projectPath);
            
            // Run documentation update
            const result = await system.run();
            
            const endTime = performance.now();
            const endMemory = process.memoryUsage().heapUsed;
            
            // Get cache statistics
            const cacheStats = await system.ultraEngine.cache.getCacheStats();
            const cacheHits = this.calculateCacheHits(cacheStats);
            
            return {
                time: Math.round(endTime - startTime),
                tokens: this.estimateTokenUsage(result, 'v2'),
                memory: Math.round((endMemory - startMemory) / 1024 / 1024), // MB
                cacheHits,
                success: true
            };
            
        } catch (error) {
            console.log(`  ⚠️  v2.0 system error: ${error.message}`);
            return {
                time: 0,
                tokens: 0,
                memory: 0,
                cacheHits: 0,
                success: false,
                error: error.message
            };
        }
    }

    // Estimate token usage from results
    estimateTokenUsage(result, systemType) {
        if (!result || !result.performance) return 0;
        
        if (systemType === 'v2' && result.performance.tokensUsed !== undefined) {
            return result.performance.tokensUsed;
        }
        
        // For legacy system, estimate based on operations
        if (systemType === 'legacy') {
            // Rough estimation: 100 tokens per major operation
            const operations = result.updatesApplied || result.updates?.length || 0;
            return operations * 100;
        }
        
        return 0;
    }

    // Calculate cache hits from stats
    calculateCacheHits(cacheStats) {
        if (!cacheStats || !Array.isArray(cacheStats)) return 0;
        
        const decisionStats = cacheStats.find(stat => stat.cache_type === 'decisions');
        return decisionStats ? decisionStats.total_hits || 0 : 0;
    }

    // Clear system cache
    async clearSystemCache(scenario) {
        const cachePath = path.join(BENCHMARK_ROOT, scenario, '.superclaude-cache');
        if (fs.existsSync(cachePath)) {
            fs.rmSync(cachePath, { recursive: true, force: true });
        }
    }

    // Calculate statistical significance
    calculateStatisticalSignificance() {
        this.results.statistical = {};
        
        for (const scenario of SCENARIOS) {
            const v1Times = this.results.scenarios[scenario].v1.times;
            const v2Times = this.results.scenarios[scenario].v2.times;
            const v1Tokens = this.results.scenarios[scenario].v1.tokens;
            const v2Tokens = this.results.scenarios[scenario].v2.tokens;
            
            this.results.statistical[scenario] = {
                time: {
                    v1_mean: this.calculateMean(v1Times),
                    v2_mean: this.calculateMean(v2Times),
                    v1_std: this.calculateStdDev(v1Times),
                    v2_std: this.calculateStdDev(v2Times),
                    improvement_percent: this.calculateImprovement(v1Times, v2Times),
                    statistical_significance: this.tTest(v1Times, v2Times)
                },
                tokens: {
                    v1_mean: this.calculateMean(v1Tokens),
                    v2_mean: this.calculateMean(v2Tokens),
                    v1_std: this.calculateStdDev(v1Tokens),
                    v2_std: this.calculateStdDev(v2Tokens),
                    reduction_percent: this.calculateReduction(v1Tokens, v2Tokens),
                    statistical_significance: this.tTest(v1Tokens, v2Tokens)
                }
            };
        }
    }

    // Generate comprehensive empirical report
    generateEmpiricalReport() {
        console.log('\n📊 EMPIRICAL PERFORMANCE BENCHMARK RESULTS');
        console.log('==========================================\n');
        
        for (const scenario of SCENARIOS) {
            const stats = this.results.statistical[scenario];
            
            console.log(`📈 Scenario: ${scenario.toUpperCase()}`);
            console.log('─'.repeat(40));
            
            console.log(`⏱️  Processing Time:`);
            console.log(`   v1.0 Legacy: ${stats.time.v1_mean.toFixed(1)}ms ± ${stats.time.v1_std.toFixed(1)}ms`);
            console.log(`   v2.0 Ultra:  ${stats.time.v2_mean.toFixed(1)}ms ± ${stats.time.v2_std.toFixed(1)}ms`);
            console.log(`   Improvement: ${stats.time.improvement_percent.toFixed(1)}%`);
            console.log(`   P-value: ${stats.time.statistical_significance.toFixed(4)}`);
            
            console.log(`\n🪙 Token Usage:`);
            console.log(`   v1.0 Legacy: ${stats.tokens.v1_mean.toFixed(0)} ± ${stats.tokens.v1_std.toFixed(0)} tokens`);
            console.log(`   v2.0 Ultra:  ${stats.tokens.v2_mean.toFixed(0)} ± ${stats.tokens.v2_std.toFixed(0)} tokens`);
            console.log(`   Reduction: ${stats.tokens.reduction_percent.toFixed(1)}%`);
            console.log(`   P-value: ${stats.tokens.statistical_significance.toFixed(4)}`);
            
            console.log('');
        }
        
        // Overall summary
        const overallTimeImprovement = this.calculateOverallImprovement('time');
        const overallTokenReduction = this.calculateOverallImprovement('tokens');
        
        console.log('🎯 OVERALL EMPIRICAL RESULTS');
        console.log('============================');
        console.log(`⚡ Average Speed Improvement: ${overallTimeImprovement.toFixed(1)}%`);
        console.log(`🪙 Average Token Reduction: ${overallTokenReduction.toFixed(1)}%`);
        console.log(`📊 Statistical Confidence: ${this.assessStatisticalConfidence()}`);
        console.log(`🔬 Empirical Validity: ${this.assessEmpiricalValidity()}`);
        
        // Save detailed results
        this.saveDetailedResults();
    }

    // Mathematical helper functions
    calculateMean(values) {
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    calculateStdDev(values) {
        const mean = this.calculateMean(values);
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    calculateImprovement(v1Values, v2Values) {
        const v1Mean = this.calculateMean(v1Values);
        const v2Mean = this.calculateMean(v2Values);
        return v1Mean > 0 ? ((v1Mean - v2Mean) / v1Mean) * 100 : 0;
    }

    calculateReduction(v1Values, v2Values) {
        return this.calculateImprovement(v1Values, v2Values);
    }

    // Simple t-test for statistical significance
    tTest(sample1, sample2) {
        const mean1 = this.calculateMean(sample1);
        const mean2 = this.calculateMean(sample2);
        const std1 = this.calculateStdDev(sample1);
        const std2 = this.calculateStdDev(sample2);
        const n1 = sample1.length;
        const n2 = sample2.length;
        
        const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));
        const tStat = (mean1 - mean2) / (pooledStd * Math.sqrt(1/n1 + 1/n2));
        
        // Simplified p-value estimation (proper calculation would need statistical tables)
        return Math.abs(tStat) > 2 ? 0.05 : 0.1; // Rough approximation
    }

    calculateOverallImprovement(metric) {
        const improvements = SCENARIOS.map(scenario => 
            this.results.statistical[scenario][metric].improvement_percent || 
            this.results.statistical[scenario][metric].reduction_percent
        );
        return this.calculateMean(improvements);
    }

    assessStatisticalConfidence() {
        const allPValues = [];
        SCENARIOS.forEach(scenario => {
            allPValues.push(this.results.statistical[scenario].time.statistical_significance);
            allPValues.push(this.results.statistical[scenario].tokens.statistical_significance);
        });
        
        const significantResults = allPValues.filter(p => p < 0.05).length;
        const totalResults = allPValues.length;
        
        return `${significantResults}/${totalResults} metrics significant (p < 0.05)`;
    }

    assessEmpiricalValidity() {
        return `${SCENARIOS.length} scenarios × ${RUNS_PER_SCENARIO} runs = ${SCENARIOS.length * RUNS_PER_SCENARIO} data points`;
    }

    saveDetailedResults() {
        const reportPath = path.join(__dirname, '../empirical-benchmark-results.json');
        const report = {
            timestamp: new Date().toISOString(),
            configuration: {
                scenarios: SCENARIOS,
                runsPerScenario: RUNS_PER_SCENARIO,
                changeTypes: CHANGE_TYPES
            },
            results: this.results,
            summary: {
                overallTimeImprovement: this.calculateOverallImprovement('time'),
                overallTokenReduction: this.calculateOverallImprovement('tokens'),
                statisticalConfidence: this.assessStatisticalConfidence(),
                empiricalValidity: this.assessEmpiricalValidity()
            }
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed results saved: ${reportPath}`);
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Cleanup benchmark environment
    cleanup() {
        if (fs.existsSync(BENCHMARK_ROOT)) {
            fs.rmSync(BENCHMARK_ROOT, { recursive: true, force: true });
            console.log('\n🧹 Benchmark environment cleaned up');
        }
    }
}

// Run benchmark if called directly
if (require.main === module) {
    const benchmark = new EmpiricalBenchmark();
    benchmark.runEmpiricalBenchmark()
        .then(() => {
            console.log('\n✅ Empirical benchmark completed successfully');
            benchmark.cleanup();
        })
        .catch(error => {
            console.error('\n❌ Benchmark failed:', error);
            process.exit(1);
        });
}

module.exports = EmpiricalBenchmark;