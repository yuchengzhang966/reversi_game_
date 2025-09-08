# PlayReversi


## Description

We are developing a multiplayer web-based Reversi Game that college students can utilize to compete against each other in their spare time. Users can log in to the webpage with their usernames and passwords and view the ranking list with the top players who are holding the highest accumulated scores in the current season. User can choose to compete with another player who is currently online by joining the same game room. They can also choose to compete with bots, however, the score will not be accumulated. At any given time, users can join a game room through a specific room ID and watch the match as the spectator role, and they can view their own and others' game history. 

## How to Run

We strongly recommand that you go straight to our website reversi.pro instead of running it on your local machine.

Steps for running on local machine:

To Initialize the project, type in the terminal

```
$ npm install
$ cd client 
$ npm install
```

Before starting the project, you have to create **.env** file in folder, it should have the following

```js
DB_CONNECT = { YOUR CONNECTION STRING }
TOKEN_SECRET = { TOKEN SECRET }
```

You have to connect to redis, by typing this in another terminal （after you installed redis on your computer）

```
$ redis-server
```
And Mongodb should also be installed in the local machine.

To start the backend, run

```
$ npm start
```

To start the frontend, run

```
$ cd client
$ npm start
```

To run test:
```
$ npm install mocha chai  
$ ./node_modules/mocha/bin/mocha test.js
```




