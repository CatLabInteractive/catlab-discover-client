const fs = require('fs');

var ConfigStore = function() {

    // check if config file exists
    this.config = null;
    try {
        let configContent = fs.readFileSync('config.json');
        this.config = JSON.parse(configContent);
    } catch (e) {
        // config store doesn't exist yet.
        return;
    }

};

var p = ConfigStore.prototype;

p.get = function() {
    return this.config;
};

p.setDeviceId = function(deviceId, deviceKey) {
    this.config = {
        deviceId: deviceId,
        deviceKey: deviceKey
    };

    this.store();
};

p.store = function() {
    fs.writeFileSync('config.json', JSON.stringify(this.config));
};

module.exports = new ConfigStore();
