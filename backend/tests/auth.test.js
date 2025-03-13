const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
    const teacherData = {
        name: "Test Teacher",
        email: "teacher@test.com",
        password: "password123",
        role: "teacher"
    };

    const studentData = {
        name: "Test Student",
        email: "student@test.com",
        password: "password123",
        role: "student"
    };

    describe('POST /api/auth/register', () => {
        it('should register a teacher successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(teacherData);
            
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('User registered successfully');
        });

        it('should register a student successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(studentData);
            
            expect(res.status).to.equal(201);
        });

        it('should not register user with existing email', async () => {
            await request(app).post('/api/auth/register').send(teacherData);
            const res = await request(app).post('/api/auth/register').send(teacherData);
            expect(res.status).to.equal(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send(teacherData);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: teacherData.email,
                    password: teacherData.password
                });
            
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: teacherData.email,
                    password: 'wrongpassword'
                });
            
            expect(res.status).to.equal(400);
        });
    });
});
