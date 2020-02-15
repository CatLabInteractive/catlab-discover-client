// make sure the environment variables are loaded/set
require('dotenv').config();

const Controller = require('./src/Controller');

setInterval(() => {
    Controller.updateIpAddress();
}, 5 * 60 * 1000);

Controller.updateIpAddress();
