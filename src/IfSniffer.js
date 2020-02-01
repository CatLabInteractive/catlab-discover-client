// fetch local ip
var os = require('os');
var ifaces = os.networkInterfaces();

var IfSniffer = function() {

};

var p = IfSniffer.prototype;

/**
 * @param name
 */
p.findIpAddress = function(name) {

    var ipAddress = null;
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        if (name && name !== ifname.fname) {
            return;
        }

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            ipAddress = iface.address;

            /*
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
            }*/
            ++alias;
        });
    });
    return ipAddress;
};

module.exports = new IfSniffer();
