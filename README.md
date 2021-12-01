# GratiBox Backend

## About
In this app you can make a subscription to receive teas, incenses and organic products, monthly or weekly.

## Tools
The backend part was made using NodeJS and Postgres, with some libs like [express](https://www.npmjs.com/package/express) and [pg](https://www.npmjs.com/package/pg).

## Preparing
First, you need to have node and npm installed!\
\
Then, clone this repository to your computer: 
#### `git clone https://github.com/lfelipelizeu/gratibox-backend`
\
Now to install the dependencies, access the cloned folder by the terminal and use:
#### `npm i`
\
I've uploaded a dump file to this repository, use it to create the needed database to the app work.\
\
I've also uploaded a `.env.example` file, an environment example file, you need to replace the variables based on your postgres configurations, the rename the file for `.env`.\
\
If you want a better experience, you can download also the frontend part [here](https://github.com/lfelipelizeu/gratibox-frontend).

## Running
This server has 3 different scripts, you can run them based on which database you want to use.\
- If you want to run the production database, set the `.env` file with the production database credentials and use:
#### `npm run start`
- If you want to run the development database, create a `.env.dev` file, based on the `.env` and fill with the development database credentials and use:
#### `npm run dev`
- If you want to run the tests, create a `.env.test` file, based on the `.env` and fill with the test database credentials and use:
#### `npm run test`
