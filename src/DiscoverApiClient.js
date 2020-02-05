const request = require('request');

var DiscoverApiClient = function() {

    this.apiUrl = process.env.DISCOVER_URL || 'https://discover.catlab.eu/';
    this.apiToken = process.env.DISCOVER_KEY;

};

var p = DiscoverApiClient.prototype;

p.registerDevice = async function(name, ip, port, desiredDomain) {

    name = name || 'Unknown device';

    const body = {
        name: name,
        ip: ip
    };

    if (port) {
        body.port = port;
    }

    if (desiredDomain) {
        body.desiredDomain = desiredDomain;
    }

    return await this.apiRequest('api/v1/devices/register', 'post', body, {
        'Authentication' : 'Token ' + this.apiToken
    });

};

p.updateDevice = async function(id, key, name, ip, port) {
    name = name || 'Unknown device';

    const body = {
        name: name,
        ip: ip
    };

    if (port) {
        body.port = port;
    }

    return await this.apiRequest('api/v1/devices/' + id, 'put', body, {
        'X-DeviceKey' : key,
        'Authentication' : 'Token ' + this.apiToken
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

                    if (response.statusCode > 300) {
                        reject(body);
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
