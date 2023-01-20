const app = require('./app');
// const dotenv = require("dotenv");
// dotenv.config()
require('dotenv').config({ path: __dirname + '/./../../.env' })


// database configuration
const db = require('./db/db');


// server configurations
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})