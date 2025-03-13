const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const submissionRoutes = require('./routes/submission');

const app = express();

if (process.env.NODE_ENV !== 'test') {
    connectDB(process.env.MONGODB_URI);
}

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/submissions', submissionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

