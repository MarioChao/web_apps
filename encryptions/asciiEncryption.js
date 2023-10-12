// Constants & functions
function invertObject(object) {
    let ret = {};
    for (let key in object) {
        ret[object[key]] = key;
    }
    return ret;
}

const hexValues = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4,
    '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'a': 10, 'A': 10, 'b': 11, 'B': 11, 'c': 12, 'C': 12,
    'd': 13, 'D': 13, 'e': 14, 'E': 14, 'f': 15, 'F': 15
};
const decimalValuesHex = invertObject(hexValues);

// Function module
let functionModule = {};

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

function hexAsciiToText(plaintext) {
    // Encrypt (decrypt)
    let ciphertext = "";
    let tmpHex = "";
    for (let c of plaintext.toString().split('')) {
        // Get character if is hex
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

function hexAsciiToTextFull(text, key, repeatCount) {
    let plaintext = text;
    for (let i = 0; i < repeatCount; i++) {
        plaintext = hexAsciiToText(plaintext);
    }
    return plaintext;
}

function textToHexAsciiFull(text, key, repeatCount) {
    if (repeatCount > 15) {
        return "Repeat count too big! (>15)";
    }
    let ciphertext = text;
    for (let i = 0; i < repeatCount; i++) {
        ciphertext = textToHexAscii(ciphertext);
    }
    return ciphertext;
}

functionModule.hexAsciiToText = hexAsciiToTextFull;
functionModule.textToHexAscii = textToHexAsciiFull;

export {functionModule};