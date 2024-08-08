const express = require('express');
const app = express();

const swaggerJsDoc = require('./docs/swagger');

app.use(express.json());

const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const borrowingRoutes = require('./routes/borrowingRoutes');
const reportRoutes = require('./routes/reportsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api-docs', swaggerJsDoc.serve, swaggerJsDoc.setup);


app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/borrowing', borrowingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
