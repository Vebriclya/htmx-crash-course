# HTMX Crash Course from Traversy Media

## Quick Start

In your project folder:<br>

- `npm init -y`
- `npm i express`
- `npm install axios`
- `npm i -D nodemon`
- Inside package.json:<br>

```
{
  "name": "htmx-crash-course",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",                     <- ADDED THIS
  "scripts": {
    "dev": "nodemon server.js"          <- CHANGED THIS
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.6.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

- `touch server.js`
- Inside server.js:

```
import express from "express";
import axios from "axios";

const app = express();

// Set static folder
app.use(express.static("public"));
// Parse URL-encoded bodies (as sent by HTML forms) - this is what allows you to get fahrenhiet. This is your middleware
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

<!-- ALL YOUR SERVER STUFF WILL GO HERE -->

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

```

- `npm run dev`
- `mkdir public` <- All your files that you'll use will go in here
- put `index.html` inside public folder
- <a href="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js">Download</a> and put `htmx.min.js` in your public folder
- Put `<script src="/path/to/htmx.min.js"></script>` in your `<head>` in `index.html`
