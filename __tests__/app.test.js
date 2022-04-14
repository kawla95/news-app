const { response } = require("express");
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

describe("/api/articles(queries)", () => {
  test("GET status:200 - responds with an array of article objects where the default order is created_at DESC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=DESC")
      .expect(200)
      .then((res) => {
        return res.body.articles;
      });
  });
});
describe("/api/articles(queries)", () => {
  test("GET status:200 - responds with an array of article objects where the order is ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=ASC")
      .expect(200)
      .then((res) => {
        return res.body.articles;
      });
  });
});

describe("/api/articles?topic)", () => {
  test("GET status 200 & requested articles from user topic queries", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toBeInstanceOf(Array);
        expect(res.body.articles).toHaveLength(1);
        expect(res.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: status 400 & error message for invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200: responds with the updated article", async () => {
    const patchVotes = {
      inc_votes: 1,
    };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(patchVotes)
      .expect(200);
    expect(body.article).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100 + patchVotes.inc_votes,
    });
  });
});
test("status: 404 - with an error message", async () => {
  const patchVotes = {
    inc_votes: 100,
  };
  const { body } = await request(app).patch("/").send(patchVotes).expect(404);
  expect(body.msg).toBe("path not found");
});
test("status: 400, returns an error", () => {
  const patchVotes = {
    inc_votes: "",
  };
  return request(app)
    .patch("/api/articles/1")
    .send(patchVotes)
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Bad request");
    });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("return status: 204 and no content", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
});
describe("/api", () => {
  test("GET: status 200 & description of all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.apiDescription).toEqual({
          "DELETE /api/articles/:articleId/comments": {
            description:
              "deletes a comments object relating to an article when provided a valid comment ID",
          },
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/articles": {
            description: "serves an array of all topics",
            exampleResponse: {
              articles: [
                {
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                },
              ],
            },
            queries: ["author", "topic", "sort_by", "order"],
          },
          "GET /api/articles/:articleId": {
            description:
              "serves an article object when provided a valid article ID",
          },
          "GET /api/articles/:articleId/comments": {
            description:
              "serves a comments object relating to an article when provided a valid article ID",
          },
          "GET /api/topics": { description: "serves an array of all topics" },
          "POST /api/articles/:articleId/comments": {
            description:
              "posts a comments object relating to an article when provided a valid body and article ID",
          },
        });
      });
  });
});
