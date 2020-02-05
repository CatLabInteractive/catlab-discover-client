const IfSniffer = require('./IfSniffer');
const ConfigStore = require('./ConfigStore');
const DiscoverApiClient = require('./DiscoverApiClient');
const CertificateStore = require('./CertificateStore');

async function updateIpAddress() {

    console.log('--- Updating catlab-discover ---');
    console.log((new Date).toISOString());

    var ip = IfSniffer.findIpAddress(process.env.IF_DEVICE);
    if (!ip) {
        console.log('No ip found.');
        return;
    }

    console.log('Using ip: \x1b[32m' + ip + '\x1b[0m.');

    let deviceData;

    let config = ConfigStore.get();
    if (config && config.deviceId) {
        console.log('Updating existing device');
        try {
            deviceData = await DiscoverApiClient.updateDevice(
                config.deviceId,
                config.deviceKey,
                process.env.ADVERTISE_NAME,
                ip,
                process.env.ADVERTISE_PORT
            );
        } catch (e) {
            console.error(e);
            return;
        }
    } else {
        // we don't have a configuration yet... let's tell the server who we are.
        console.log('Registering new device');

        try {
            deviceData = await DiscoverApiClient.registerDevice(
                process.env.ADVERTISE_NAME,
                ip,
                process.env.ADVERTISE_PORT,
                process.env.DESIRED_DOMAIN
            );
        } catch (e) {
            console.error(e);
            return;
        }

        // store the credentials.
        ConfigStore.setDeviceId(deviceData.id, deviceData.key);
    }

    console.log('Got domain name: \x1b[32m' + deviceData.domain + '\x1b[0m.');

    if (deviceData.certificate) {
        console.log('Storing certificate');
        var hasChanged = CertificateStore.store(
            deviceData.certificate.private_key,
            deviceData.certificate.public_key,
            deviceData.certificate.certificate
        );

        if (hasChanged) {
            console.log('Certificates have changed, restarting some services?');

            // restart some services?
            var cmd = process.env.CMD_CERTIFICATE_CHANGE;
            if (cmd) {
                console.log('Calling ' + cmd);
                const shell = require('shelljs')
                shell.exec(cmd);
            }
        } else {
            console.log('Certificates have not changed.');
        }
    }

}

exports.updateIpAddress = updateIpAddress;
