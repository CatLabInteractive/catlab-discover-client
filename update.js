// make sure the environment variables are loaded/set
require('dotenv').config();

const Controller = require('./src/Controller');

Controller.updateIpAddress();
