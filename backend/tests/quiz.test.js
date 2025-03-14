const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../server");

describe("Quiz API", () => {
  let teacherToken;
  let studentToken;
  let quizId;
  let createdQuizId;

  const teacherData = {
    name: "Test Teacher",
    email: "teacher@test.com",
    password: "password123",
    role: "teacher",
  };

  const studentData = {
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student",
  };

  const sampleQuiz = {
    title: "Test Quiz",
    description: "Test Description",
    questions: [
      {
        question: "What is 2+2?",
        options: ["3", "4", "5", "6"],
        correctOption: 1,
      },
    ],
    duration: 30,
  };

  before(async () => {
    // Register and login teacher
    await request(app).post("/api/auth/register").send(teacherData);
    const teacherLogin = await request(app).post("/api/auth/login").send({
      email: teacherData.email,
      password: teacherData.password,
    });
    teacherToken = teacherLogin.body.token;

    // Register and login student
    await request(app).post("/api/auth/register").send(studentData);
    const studentLogin = await request(app).post("/api/auth/login").send({
      email: studentData.email,
      password: studentData.password,
    });
    studentToken = studentLogin.body.token;

    //Create quiz with teacher token
    const currRes = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send(sampleQuiz);
    createdQuizId = currRes.body._id;
  });

  describe("POST /api/quizzes", () => {
    it("should create quiz when teacher is authenticated", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(sampleQuiz);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("_id");
      quizId = res.body._id;
    });

    it("should not allow students to create quizzes", async () => {
      const res = await request(app)
        .post("/api/quizzes")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(sampleQuiz);

      expect(res.status).to.equal(403);
    });
  });

  describe("GET /api/quizzes", () => {
    it("should get all quizzes", async () => {
      const res = await request(app)
        .get("/api/quizzes")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });

    it("should get specific quiz by ID", async () => {
      const res = await request(app).get(`/api/quizzes/${quizId}`);

      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(quizId);
    });
  });

  describe("PUT /api/quizzes/:id", () => {
    const updatedQuiz = {
      title: "Updated Quiz Title",
      description: "Updated Description",
    };
    it("should allow the creator to update the quiz", async () => {
      const res = await request(app)
        .put(`/api/quizzes/${createdQuizId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(updatedQuiz);

      expect(res.status).to.equal(200);
      expect(res.body.title).to.equal(updatedQuiz.title);
    });

    it("should prevent non-creators from updating the quiz", async () => {
      const res = await request(app)
        .put(`/api/quizzes/${createdQuizId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updatedQuiz);

      expect(res.status).to.equal(403);
    });
  });

  describe("DELETE /api/quizzes/:id", () => {
    it("should prevent non-creators from deleting the quiz", async () => {
      const res = await request(app)
        .delete(`/api/quizzes/${createdQuizId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).to.equal(403);
    });

    it("should allow the creator to delete the quiz", async () => {
      const res = await request(app)
        .delete(`/api/quizzes/${createdQuizId}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).to.equal(200);
      expect(res.body.message).to.equal("Quiz deleted successfully");
    });
  });
});
