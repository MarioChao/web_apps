// Vigenère Cipher
// Encrypt each English letter with a Caesar cipher according to a key

// Constants
const alphabetSize = 26;

// Local functions
function parseKey(key) {
    // Make sure the key contains only letteres
    let resultKey = "";
    for (let char of key) {
        if (getLetterPosition(char) == -1) {
            continue;
        }
        resultKey += char;
    }
    return resultKey;
}

function isLowercase(c) {
    let char = c.charAt(0);
    return ('a' <= char) && (char <= 'z');
}

function isUppercase(c) {
    let char = c.charAt(0);
    return ('A' <= char) && (char <= 'Z');
}

function getLetterPosition(c) {
    // Get the position of the letter in the English alphabet (a=0, b=1, ...)
    let char = c.charAt(0);
    let charAscii = char.charCodeAt();
    if (isLowercase(char)) {
        return charAscii - 'a'.charCodeAt();
    } else if (isUppercase(char)) {
        return charAscii - 'A'.charCodeAt();
    } else {
        return -1;
    }
}

function positiveMod(number, divisor) {
    let resultNumber = number % divisor;
    if (resultNumber < 0) {
        resultNumber += Math.abs(divisor);
    }
    return resultNumber;
}

function shiftLetter(c, shiftIndex) {
    // Get character information
    let char = c.charAt(0);
    let charPosition = getLetterPosition(char);

    // Shift letter
    let newPosition = positiveMod(charPosition + shiftIndex, alphabetSize);
    let resultChar = '\0';
    if (isLowercase(char)) {
        let newAscii = 'a'.charCodeAt() + newPosition;
        resultChar = String.fromCharCode(newAscii);
    } else if (isUppercase(char)) {
        let newAscii = 'A'.charCodeAt() + newPosition;
        resultChar = String.fromCharCode(newAscii);
    }
    return resultChar;
}

// Encryption functions
function vigenereEncrypt(text, key, repeatCount) {
    // Reduce repeat count
    repeatCount %= alphabetSize;
    
    // Go through each letter
    let keyIndex = 0;
    let resultText = "";
    for (let char of text) {
        // Validate English letter
        let charPosition = getLetterPosition(char);
        if (charPosition == -1) {
            /* Not an English letter */
            resultText += char;
            continue;
        }
        
        // Get key position, 0 if key is empty
        let keyPosition = 0;
        if (key.length > 0) {
            keyPosition = getLetterPosition(key.charAt(keyIndex));
            keyIndex++;
            if (keyIndex >= key.length) {
                keyIndex = 0;
            }
        }

        // Append the shifted letter
        let shiftIndex = (keyPosition * repeatCount) % alphabetSize;
        let newChar = shiftLetter(char, shiftIndex);
        resultText += newChar;
    }

    // Return
    return resultText;
}

function vigenereDecrypt(text, key, repeatCount) {
    // Vigenère decrypt is just encrypting with a negative key
    return vigenereEncrypt(text, key, -repeatCount);
}

// Encrypt node functions
function vigenereEncryptFull(text, nodeInfo) {
    // Get variables
    let key = parseKey(nodeInfo.key);
    let repeatCount = parseInt(nodeInfo.repeatCount);

    // Encrypt
    let resultText = vigenereEncrypt(text, key, repeatCount);

    // Return
    return {
        result : resultText,
        success : true,
    };
}

function vigenereDecryptFull(text, nodeInfo) {
    // Get variables
    let key = parseKey(nodeInfo.key);
    let repeatCount = parseInt(nodeInfo.repeatCount);
    
    // Encrypt
    let resultText = vigenereDecrypt(text, key, repeatCount);

    // Return
    return {
        result : resultText,
        success : true,
    };
}

function getVigenereEncryptNodeParameter() {
    return {
        key : true,
        repeatCount : true,
    };
}

function getVigenereDecryptNodeParameter() {
    return {
        key : true,
        repeatCount : true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = vigenereEncryptFull;
functionModule.decrypt = vigenereDecryptFull;

functionModule.encryptNodeParameter = getVigenereEncryptNodeParameter();
functionModule.decryptNodeParameter = getVigenereDecryptNodeParameter();

export { functionModule };
