# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Clone Database

In terminal run:
```node -v```
Should be at least 19.1.0

```psql -V```
Should be at least 15.1

1. Fork this repository.

In your terminal:
2. git clone <your_repo_url>
4. cd <your_repo_name>
5. code .

## Database Connection

In order to successfully connect with the database, run:

```npm install```

Create a new file with the name .env.test and insert the following:
PGDATABASE: nc_news_test

Create a new with the name .env.development and insert the following:
PGDATABASE: nc_news

## Database Setup

Run once at the beginning:
```npm run setup-dbs```

To seen the database run:
```npm run seed```

To test database run:
```npm test app.test.js``` 

## Hosted API

This API is available through Elephant SQL and Render: https://be-review-news.onrender.com/
