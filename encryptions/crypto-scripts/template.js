// Constants

// Variables

// Local functions

// Encryption functions
function someEncrypt() {

}

function someDecrypt() {

}

function someEncryptFull(text, nodeInfo) {
    // Get variables
    // Validate
    // Encrypt
    // Return
}

function someDecryptFull(text, nodeInfo) {
    // Get variables
    // Validate
    // Encrypt
    // Return
}

function getSomeEncryptNodeParameter() {
    return {
        repeatCount : true,
    };
}

function getSomeDecryptNodeParameter() {
    return {
        repeatCount : true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = someEncryptFull;
functionModule.decrypt = someDecryptFull;

functionModule.encryptNodeParameter = getSomeEncryptNodeParameter();
functionModule.decryptNodeParameter = getSomeDecryptNodeParameter();

export { functionModule };
