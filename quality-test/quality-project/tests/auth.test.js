const request = require('supertest');
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
});