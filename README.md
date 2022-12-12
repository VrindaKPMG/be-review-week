# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Database Connection

In order to successfully connect with the database, run:

```npm init -y```
```npm install dotenv```

Create a new file with the name .env.test and insert the following:
PGDATABASE: nc_news_test

Create a new with the name .env.development and insert the following:
PGDATABASE: nc_news


