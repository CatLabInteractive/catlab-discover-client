const request = require('request');

var DiscoverApiClient = function() {

    this.apiUrl = process.env.DISCOVER_URL || 'https://discover.catlab.eu/';
    this.apiToken = process.env.DISCOVER_KEY;

};

var p = DiscoverApiClient.prototype;

p.registerDevice = async function(name, ip, port) {

    name = name || 'Unknown device';

    return await this.apiRequest('api/v1/devices/register', 'post', {
        name: name,
        ip: ip,
        port: port
    });

};

p.updateDevice = async function(id, key, name, ip, port) {
    name = name || 'Unknown device';

    return await this.apiRequest('api/v1/devices/' + id, 'put', {
        name: name,
        ip: ip,
        port: port
    }, {
        'x-deviceKey' : key
    });
};

p.apiRequest = function(path, method, body, headers) {

    headers = headers || {};

    return new Promise(
        (resolve, reject) => {

            try {
                const requestOptions = {
                    uri: this.apiUrl + path,
                    method: method,
                    json: body,
                    headers: headers
                };

                //console.log(requestOptions);

                request(requestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(body);
                });
            } catch (err) {
                reject(err);
            }

        }
    );
};

module.exports = new DiscoverApiClient();
