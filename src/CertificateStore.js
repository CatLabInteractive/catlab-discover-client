const fs = require('fs');

var CertificateStore = function() {

    if (process.env.SSL_CERTIFICATE_DIR) {
        this.directory = process.env.SSL_CERTIFICATE_DIR;
    } else {
        this.directory = null;
    }

};

var p = CertificateStore.prototype;

p.store = function(privateKey, publicKey, certificate) {

    if (!this.directory) {
        console.log('No directory set, not storing certificates.');
        return;
    }

    var hasChanged = false;
    hasChanged = this.storeFile('private.key', privateKey) || hasChanged;
    hasChanged = this.storeFile('public.key', publicKey) || hasChanged;
    hasChanged = this.storeFile('certificate.crt', certificate) || hasChanged;

    return hasChanged;
};

p.storeFile = function(file, value) {

    if (!this.directory) {
        return;
    }

    var filename = this.directory + file;

    // check if file has changed
    var currentData;
    try {
        currentData = fs.readFileSync(filename).toString();
    } catch {
        currentData = '';
    }

    if (currentData !== value) {
        fs.writeFileSync(filename, value);
        return true;
    }
    return false;
};

module.exports = new CertificateStore();
