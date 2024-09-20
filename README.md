# FIT5163 - Topic 13 (Secure Voting App)

Built upon the Blockchain project from https://github.com/syedmuhamaddanish/React-Voting-Application/tree/main/src


## 1. Setup

### backend

```
$ cd backend
$ npm init -y
$ npm install express mysql cors nodemon
$ npm install bcrypt
```

### react-voting-app

```
$ cd react-voting-app
$ npm install -D tailwindcss postcss autoprefixer
$ npx tailwindcss init -p
$ npm install axios
```

### HARDHAT-CONTRACT

```
$ npm install hardhat
$ npx hardhat compile
$ npx hardhat run --network volta scripts/deploy.js
```


## 2. Boot Local SQL Servers

Ensure that your XAMPP servers (MySQL Database and Apache Web Server) are running.



## 3. Run Project

### backend

```
$ npm start
```

### react-voting-app

```
$ npm start
```
