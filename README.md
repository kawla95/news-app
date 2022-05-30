A News API Project

Background
This is an news app that works in a way similar to Reddit. The app allows several articles where you can leave comment. You can access the app using the link below:

https://backend-of-news-app.herokuapp.com/api

The link above describes the various URLs (endpoints) which will provide relative information.

**Please remember to start any URLs with '/api' **

Available URLs (Endpoints)
/api/topics - serves an array of all topics

/api/articles - serves an array of all topics

/api/articles/:articleId - serves an article object when provided a valid article ID

/api/articles/:articleId/comments - serves a comments object relating to an article when provided a valid article ID

There are also POST and DELETE Endpoints
POST /api/articles/:articleId/comments - posts a comments object relating to an article when provided a valid body and article ID

DELETE /api/articles/:articleId/comments - deletes a comments object relating to an article when provided a valid comment ID

Cloning this project
Above the list of files, click Code. "Code" button

To clone the repository using HTTPS, under "Clone with HTTPS", click . To clone the repository using an SSH key, including a certificate issued by your organization's SSH certificate authority, click Use SSH, then click . To clone a repository using GitHub CLI, click Use GitHub CLI, then click . The clipboard icon for copying the URL to clone a repository

The clipboard icon for copying the URL to clone a repository with GitHub CLI

Open Terminal.

Change the current working directory to the location where you want the cloned directory.

Type git clone, and then paste the URL you copied earlier.

$ git clone {paste the URL of this repository}. This will clone it.
Navigate (using the cd command) into the new folder and type. $ npm install This installs the required dependencies listed at the bottom of this page.
You will need to install Node.js version 17 or later if you have not already.
You will also need to install Postgres version 14 or later.
Finally, to run the React project type $ npm start.
Further Instructions
Create a file called .env.test and write PGDATABASE=<nc_news_test> inside.

Create another file called .env.development and write PGDATABASE=<nc_news> inside.

To set-up and seed your database with the correct data run the commands: $ npm run setup-dbs then $ npm run seed

To run tests for the project the command is:

$ npm test

This will run jest tests which can be viewed in the test folder.

Dependencies installed with the npm install command: express 4.x pg 8.x pg-format 1.x dotenv 14.x nodemon 2.x Developer only dependencies: jest 27.x jest-sorted 1.x supertest 6.x
