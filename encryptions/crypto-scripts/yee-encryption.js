// Yee Cipher
// Custom type of Vigenère cipher, with numeral keys and ascii characters
// The key sequence won't skip over any character (unlike non-letters in Vigenère)

// Constants
const minAscii = '!'.charCodeAt(); // 33
const maxAscii = '~'.charCodeAt(); // 126
const spaceReplace = '€';

// Variables
let keySequence = [0];

// Local functions
function getDefaultKey() {
    return [1, -2, 1, -3, 3, -2, 1, -2, 5, -5, 2, -3, 2, -4, 4, -5, 6, -5];
}

function parseKey(key) {
    if (key == '') {
        keySequence = getDefaultKey();
    } else {
        // Turn key into a number array
        let tmpInputSequence = key.toString().split(' ');
        let tmpKeySequence = [];
        for (let i = 0; i < tmpInputSequence.length; i++) {
            if (!isNaN(tmpInputSequence[i]) && tmpInputSequence[i] != '') {
                tmpKeySequence.push(+tmpInputSequence[i]);
            }
        }
        if (tmpKeySequence.length == 0) {
            tmpKeySequence = [0];
        }
        keySequence = tmpKeySequence;
    }
    // console.log("yee sequence:", keySequence);
}

function rangeMod(number, minNum, maxNum) {
    let range = maxNum - minNum + 1;
    let mod = (number - minNum) % range;
    let ret = (mod < 0 ? mod + range : mod) + minNum;
    return ret;
}

// Encryption functions
function yeeEncrypt(plaintext, repeatCount, isDecrypt) {
    // Validate paraemters (for when isDecrypt == null)
    isDecrypt = (isDecrypt == true);

    // Reduce repeat count
    repeatCount %= (maxAscii - minAscii + 1);

    // Encrypt / decrypt text
    let ciphertext = "";
    let keySize = keySequence.length;
    let sequenceId = 0;
    for (let c of plaintext.toString().split('')) {
        let cFinal = c;
        if (c == ' ') {
            // Swap space with spaceReplace
            cFinal = (repeatCount % 2 == 0 ? ' ' : spaceReplace);
        } else if (c == spaceReplace) {
            // Swap spaceReplace with space
            cFinal = (repeatCount % 2 == 1 ? ' ' : spaceReplace);
        } else if (minAscii <= c.charCodeAt() && c.charCodeAt() <= maxAscii) {
            // Shift the character in the ASCII range
            let charNum;
            if (isDecrypt == false) {
                charNum = rangeMod(c.charCodeAt() + keySequence[sequenceId % keySize] * repeatCount, minAscii, maxAscii);
            } else {
                charNum = rangeMod(c.charCodeAt() - keySequence[sequenceId % keySize] * repeatCount, minAscii, maxAscii);
            }
            cFinal = String.fromCharCode(charNum);
        }
        ciphertext += cFinal;
        sequenceId = (sequenceId + 1) % keySize;
    }
    return ciphertext;
}

// Encrypt node functions
function yeeEncryptFull(text, nodeInfo) {
    // Get variables
    parseKey(nodeInfo.key);
    let repeatCount = parseInt(nodeInfo.repeatCount);
    
    // Encrypt
    let resultText = yeeEncrypt(text, repeatCount);

    // Return
    return {
        result: resultText,
        success: true,
    };
}

function yeeDecryptFull(text, nodeInfo) {
    // Get variables
    parseKey(nodeInfo.key);
    let repeatCount = parseInt(nodeInfo.repeatCount);

    // Encrypt
    let resultText = yeeEncrypt(text, repeatCount, true);
    
    // Return
    return {
        result: resultText,
        success: true,
    };
}

function getYeeEncryptNodeParameter() {
    return {
        key: true,
        repeatCount: true,
    };
}

function getYeeDecryptNodeParameter() {
    return {
        key: true,
        repeatCount: true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = yeeEncryptFull;
functionModule.decrypt = yeeDecryptFull;

functionModule.encryptNodeParameter = getYeeEncryptNodeParameter();
functionModule.decryptNodeParameter = getYeeDecryptNodeParameter();

export { functionModule };
