const IfSniffer = require('./IfSniffer');
const ConfigStore = require('./ConfigStore');
const DiscoverApiClient = require('./DiscoverApiClient');

async function updateIpAddress() {

    var ip = IfSniffer.findIpAddress(process.env.IF_DEVICE);
    if (!ip) {
        console.log('No ip found.');
        return;
    }

    console.log(ip);
    console.log(ConfigStore.get());

    let deviceData;

    let config = ConfigStore.get();
    if (config && config.deviceId) {
        console.log('Updating existing device');
        deviceData = await DiscoverApiClient.updateDevice(
            config.deviceId,
            config.deviceKey,
            process.env.ADVERTISE_NAME,
            ip,
            process.env.ADVERTISE_PORT
        );
    } else {
        // we don't have a configuration yet... let's tell the server who we are.
        console.log('Registering new device');
        deviceData = await DiscoverApiClient.registerDevice(
            process.env.ADVERTISE_NAME,
            ip,
            process.env.ADVERTISE_PORT
        );

        // store the credentials.
        ConfigStore.setDeviceId(deviceData.id, deviceData.key);
    }

    // Now check if we need to update our certificate.
    // @todo download certificate, install it and restart the webservice (if different)

}

exports.updateIpAddress = updateIpAddress;
