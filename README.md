
# Online Quiz Application


## Key Points
- **Authentication**: Teachers and Stundets can register and login
- **Teacher specific features**: Teachers can create, edit and delete quizzes and manage questions.
- **Student specific features**: Students can view and take quizzes.
- **Database**: MongoDB.
- **Unit tests**: Unit tests use an in-memory MongoDB instance.


## Setup Instructions

### 1️ Clone the repository

Clone the project:
```bash
git clone https://github.com/yourusername/online-quiz.git
cd online-quiz
```

### 2️ Install Dependencies

Install required packages:
```bash
npm install
```

### 3 Start the Server

Run the server:
```bash
npm run dev
```

The server will run on port 3000 by default.

### 4 Testing

Run the tests:
```bash
npm test
```

## API Endpoints

### Authentication

- **POST `/api/auth/register`**: Register a user (teacher/student).
- **POST `/api/auth/login`**: Login a user and get a JWT token.

### Quizzes

- **POST `/api/quizzes`**: Create a quiz (only accessible by teachers).
- **GET `/api/quizzes`**: Get all quizzes (students can access).
- **GET `/api/quizzes/:id`**: Get a specific quiz by ID (students and teachers can access).
- **PUT `/api/quizzes/:id`**: Edit a quiz, only creator can edit the quiz
- **DELETE `api/quizzes/:id`**: Delete a quiz, only creator cand delete the quiz

### Submission

- **POST `/api/submissions/:quizId`**: Submit answers for a quiz. Students can use this endpoint to submit their answers for a quiz