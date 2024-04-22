// Ascii Encode
// Encode characters into ASCII numbers

// Constants
const hexValues = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'a': 10, 'A': 10, 'b': 11, 'B': 11, 'c': 12, 'C': 12,
    'd': 13, 'D': 13, 'e': 14, 'E': 14, 'f': 15, 'F': 15,
};
const decimalValuesHex = invertObject(hexValues);

// Local functions
function invertObject(object) {
    let ret = {};
    for (let key of Object.keys(object)) {
        ret[object[key]] = key;
    }
    return ret;
}

function hexToDecimal(hex) {
    // Convert hex to decimal
    let ret = 0;
    for (let c of hex.toString().split('')) {
        if (Object.keys(hexValues).includes(c)) {
            ret *= 16;
            ret += hexValues[c];
        }
    }
    return ret;
}

function decimalToHex(decimal) {
    // Convert decimal to hex
    let ret = "";
    let tmpDecimal = decimal;
    while (tmpDecimal > 0) {
        ret = decimalValuesHex[tmpDecimal % 16] + ret;
        tmpDecimal = Math.floor(tmpDecimal / 16);
    }
    return ret;
}

// Encryption functions
function textToHexAscii(plaintext) {
    // Encrypt (decrypt)
    let ciphertext = "";
    for (let c of plaintext.toString().split('')) {
        // Get the ASCII code in hex (2-digits)
        let tmpDecimal = c.charCodeAt();
        let tmpHex = decimalToHex(tmpDecimal);
        if (tmpHex.length < 2) {
            tmpHex = "0" + tmpHex;
        } else if (tmpHex.length > 2) {
            return "Invalid (" + JSON.stringify(c) + ")";
        }
        // Add to ciphertext
        ciphertext += tmpHex + " ";
    }
    return ciphertext;
}

function hexAsciiToText(plaintext) {
    // Encrypt (decrypt)
    let ciphertext = "";
    let tmpHex = "";
    for (let c of plaintext.toString().split('')) {
        // Get character if it's hex
        if (Object.keys(hexValues).includes(c)) {
            tmpHex += c;
        }
        // When hex is complete (2 digits)
        if (tmpHex.length == 2) {
            // Get decimal
            let tmpDecimal = hexToDecimal(tmpHex);
            // Add to ciphertext
            ciphertext += String.fromCharCode(tmpDecimal);
            // Reset hex
            tmpHex = "";
        }
    }
    return ciphertext;
}

function textToHexAsciiFull(text, nodeInfo) {
    // Get variables
    let repeatCount = parseInt(nodeInfo.repeatCount);
    
    // Validate repeat count
    if (repeatCount > 10) {
        return {
            result : "Repeat count too big! (>10)",
            success : false,
        };
    }
    
    // Encrypt
    let ciphertext = text;
    for (let i = 0; i < repeatCount; i++) {
        ciphertext = textToHexAscii(ciphertext);
    }

    // Return
    return {
        result : ciphertext,
        success : true,
    };
}

function hexAsciiToTextFull(text, nodeInfo) {
    // Get variables
    let repeatCount = parseInt(nodeInfo.repeatCount);

    // Encrypt
    let plaintext = text;
    for (let i = 0; i < repeatCount; i++) {
        plaintext = hexAsciiToText(plaintext);
    }
    
    // Return
    return {
        result : plaintext,
        success : true,
    };
}

function getTextToHexAsciiNodeParameter() {
    return {
        repeatCount : true,
    };
}

function getHexAsciiToTextNodeParameter() {
    return {
        repeatCount : true,
    };
}

// Function module
let functionModule = {};

functionModule.textToHexAscii = textToHexAsciiFull;
functionModule.hexAsciiToText = hexAsciiToTextFull;

functionModule.textToHexAsciiNodeParameter = getTextToHexAsciiNodeParameter();
functionModule.hexAsciiToTextNodeParameter = getHexAsciiToTextNodeParameter();

export { functionModule };
