const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../server");

describe("Submission API Tests", () => {
  let teacherToken;
  let studentToken;
  let quizId;
  let firstQuestionId;

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

  before(async () => {
    // Setup teacher and create quiz
    await request(app).post("/api/auth/register").send(teacherData);
    const teacherLogin = await request(app).post("/api/auth/login").send({
      email: teacherData.email,
      password: teacherData.password,
    });
    teacherToken = teacherLogin.body.token;

    // Create a quiz
    const quizRes = await request(app)
      .post("/api/quizzes")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        title: "Test Quiz",
        description: "Test Description",
        questions: [
          {
            question: "Test Question",
            options: ["A", "B", "C", "D"],
            correctOption: 1,
          },
        ],
        duration: 30,
      });
    quizId = quizRes.body._id;
    firstQuestionId = quizRes.body.questions[0]._id;

    // Setup student
    await request(app).post("/api/auth/register").send(studentData);
    const studentLogin = await request(app).post("/api/auth/login").send({
      email: studentData.email,
      password: studentData.password,
    });
    studentToken = studentLogin.body.token;
  });

  describe("POST /api/submissions/:quizId", () => {
    it("should submit quiz answers successfully", async () => {
      const res = await request(app)
        .post(`/api/submissions/${quizId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          answers: [
            {
              questionId: firstQuestionId,
              selectedOption: 1,
            },
          ],
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property("score");
    });

    it("should not allow teacher to submit quiz", async () => {
      const res = await request(app)
        .post(`/api/submissions/${quizId}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({
          answers: [
            {
              questionId: quizId + "_q1",
              selectedOption: 0,
            },
          ],
        });

      expect(res.status).to.equal(403);
    });
  });

  describe("GET /api/submissions/my-submissions", () => {
    it("should get student submissions", async () => {
      const res = await request(app)
        .get("/api/submissions/my-submissions")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an("array");
    });
  });
});
