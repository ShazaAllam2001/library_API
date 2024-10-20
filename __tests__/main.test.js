const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index.js');

const User = require('../models/user.model.js');

// Authentication testing
describe("register a user", () => {
    it('should respond with 200 and return a success message', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ username: 'Sam', password: 'sam@123', email: 'sam@xyz.com', role: 'admin' });
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'User registered successfully'
        });
    });

    it('should respond with 400 for missing fields', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ username: 'Sam' });
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: 'Fields missing'
        });
    });
});

describe("login a user", () => {
    it('should respond with 200 and return a success message', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'Alice', password: 'alice@123' });
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });

    it('should respond with 401 for missing fields', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'Alice', password: 'alice' });
        
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            error: 'Authentication failed'
        });
    });
});



// Books Testing
describe('get all books', () => {
    it('should respond with an array of books', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const response = await request(app)
            .get('/api/books')
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
    });
});

describe('get a specific book by id', () => {
    it('should respond with a book with a certain id', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const id = '67140d71fdf8ba75c839c640';

        const response = await request(app)
            .get('/api/books/' + id)
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
    });

    it('can not respond with a book (id is wrong)', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const id = '6714174601edd695f9512f65';
        
        const response = await request(app)
            .get('/api/books/' +  id)
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(404);
    });
});

describe("create a book", () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const response = await request(app)
            .post('/api/books')
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'Alice_book', author: 'alice', details: 'a story' });
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});

describe("edit a book", () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const id = '67140d71fdf8ba75c839c640';
        
        const response = await request(app)
            .put('/api/books/' + id)
            .set('Authorization', 'Bearer ' + token)
            .send({ title: 'Alice_book', author: 'alice', details: 'a short story' });
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});

describe("delete a book", () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const id = '67140d71fdf8ba75c839c640';
        
        const response = await request(app)
            .delete('/api/books/' + id)
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});



// Borrow Testing
describe("borrow a book", () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const bookId = '67140d71fdf8ba75c839c640';

        const response = await request(app)
            .post('/api/borrow')
            .set('Authorization', 'Bearer ' + token)
            .send({ book: bookId, user_id: user._id });
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});

describe('get borrowing history for current user', () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const response = await request(app)
            .get('/api/borrow/history')
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});



// Return Testing
describe("return a book", () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});
        const bookId = '67140d71fdf8ba75c839c640';

        const response = await request(app)
            .post('/api/return')
            .set('Authorization', 'Bearer ' + token)
            .send({ book: bookId, user_id: user._id });
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});



// Reports Testing
describe('get all current borrowed books', () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const response = await request(app)
            .get('/api/reports/borrowed')
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});

describe('get popular books', () => {
    it('should respond with 200 and return a success message', async () => {
        const user = await User.findOne({ username: 'Alice' });
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {expiresIn: '1h'});

        const response = await request(app)
            .get('/api/reports/popular')
            .set('Authorization', 'Bearer ' + token);
        
        expect(response.status).toBe(200);
        expect(typeof response.text).toBe('string');
    });
});