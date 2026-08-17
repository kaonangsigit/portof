---
title: "Building a Scalable REST API with Node.js"
description: "Learn how to build production-ready REST APIs with best practices and security"
date: "2024-02-15"
author: "Portfolio Author"
tags: ["Node.js", "API", "Backend", "Tutorial"]
---

# Building a Scalable REST API with Node.js

In this comprehensive guide, we'll build a production-ready REST API from scratch using Node.js, Express, and MongoDB.

## Table of Contents

1. Project Setup
2. Database Design
3. Authentication & Authorization
4. CRUD Operations
5. Error Handling
6. Testing
7. Deployment

## 1. Project Setup

Let's start by initializing our Node.js project:

```bash
mkdir rest-api
cd rest-api
npm init -y
npm install express mongoose dotenv cors helmet
```

## 2. Database Design

We'll use MongoDB for our database. Here's our user schema:

```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now }
});
```

## 3. Authentication & Authorization

Implement JWT-based authentication:

```javascript
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

## 4. CRUD Operations

Create RESTful endpoints:

```javascript
// GET all users
app.get('/api/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// POST create user
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});
```

## 5. Error Handling

Implement centralized error handling:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});
```

## 6. Testing

Write comprehensive tests with Jest:

```javascript
describe('User API', () => {
  test('GET /api/users returns users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## 7. Deployment

Deploy to production:

- Set up environment variables
- Use PM2 for process management
- Configure NGINX as reverse proxy
- Set up SSL certificates
- Implement monitoring and logging

## Best Practices

1. **Validation**: Always validate input data
2. **Security**: Use helmet, rate limiting, and CORS
3. **Documentation**: Use Swagger/OpenAPI
4. **Versioning**: Version your API (e.g., /api/v1/)
5. **Logging**: Implement structured logging
6. **Testing**: Aim for 80%+ code coverage

## Conclusion

Building a scalable REST API requires attention to detail and following best practices. This guide provides a solid foundation for your next API project.

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Best Practices](https://docs.mongodb.com/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/)

Happy coding! 🚀
