const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET - api/topics", () => {
  test("status: 200 - responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
test("status: 404 - with an error message", () => {
  return request(app)
    .get("/api/not-a-path")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("path not found");
    });
});
describe("/api/articles/:article_id(comment count)", () => {
  test("status: 200 & an article with the id coming from client", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          comment_count: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
});
describe("/api/users", () => {
  test("GET status 200 - responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET status 200 & comments of the article id requested by the client", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(11);
      });
  });
});
describe("/api/articles", () => {
  test("GET status 200 - responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeInstanceOf(Array);
        expect(response.body.articles).toHaveLength(5);
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("return status: 204 and no content", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: returns a copy of a new comment", () => {
    const body = {
      username: "butter_bridge",
      body: "testing",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(body)
      .expect(201)
      .then((res) => {
        console.log(res.body);
        expect(res.body.comment).toMatchObject({
          comment_id: 19,
          body: "testing",
          author: "butter_bridge",
          article_id: 3,
        });
      });
  });
});

it("PATCH status:404, when passed an invalid article_id", async () => {
  const { body } = await request(app)
    .patch("/api/articles/not-an-id")
    .send({})
    .expect(404);
  expect(body.msg).toBe("path not found");
});
