// Convert between Radix Base

// Constants
const digitValueString = "0123456789abcdefghijklmnopqrstuvwxyz";
const digitToDecimal = createDigitObject(digitValueString);
const decimalToDigit = invertObject(digitValues);

// Local functions
function createDigitObject(string) {
    let resultObject = {};
    let value = 0;
    for (let digit of string) {
        resultObject[digit] = value++;
        if (digit.toUpperCase()) {

        }
    }
}

function invertObject(object) {
    let resultObject = {};
    for (let key of Object.keys(object)) {
        resultObject[object[key]] = key;
    }
    return resultObject;
}

// Encryption functions
function radixEncrypt() {

}

// Encrypt node functions
function radixEncryptFull(text, nodeInfo) {
    // Get variables
    // Validate
    // Encrypt
    let resultText;
    
    // Return
    return {
        result: resultText,
        success: true,
    };
}

function getRadixEncryptNodeParameter() {
    return {
        "radix-to": true,
        "radix-from": true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = radixEncryptFull;

functionModule.encryptNodeParameter = getRadixEncryptNodeParameter();

export { functionModule };
