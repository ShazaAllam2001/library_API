const express = require('express')
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
require('dotenv').config();

const authRoute = require('./routes/auth.route.js');
const bookRoute = require('./routes/book.route.js');
const borrowRoute = require('./routes/borrow.route.js');
const returnRoute = require('./routes/return.route.js');
const reportRoute = require('./routes/reports.route.js');

app.use(express.json());

app.use('/api', authRoute);
app.use('/api/books', bookRoute);
app.use('/api/borrow', borrowRoute);
app.use('/api/return', returnRoute);
app.use('/api/reports', reportRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

mongoose.connect(process.env.MONGO_LINK).then(() => console.log('Connected to database'));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Your API's base URL
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api', (req, res) => {
    res.send("Hello from library API");
});
