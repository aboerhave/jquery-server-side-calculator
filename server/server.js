// require express - gives us a function
const express = require('express');
// require body-parser to parse through data
const bodyParser = require('body-parser');

// creates instance of express by calling the function
// returned above - gives us an object
const app = express();
const PORT = 5000;

app.use(express.static('server/public'));

app.use(bodyParser.urlencoded({extended: true}));















app.listen(PORT, () => {
    console.log('Up and running on port: ', PORT);
    
});