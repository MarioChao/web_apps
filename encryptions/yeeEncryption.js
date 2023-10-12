// Constants
const minAscii = '!'.charCodeAt(); // 33
const maxAscii = '~'.charCodeAt(); // 126
const spaceReplace = '€';

// Function module
let functionModule = {};
let keySequence = [0];

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
    console.log("yee sequence:", keySequence);
}

function rangeMod(number, minNum, maxNum) {
    let range = maxNum - minNum + 1;
    let mod = (number - minNum) % range;
    let ret = (mod < 0 ? mod + range : mod) + minNum;
    return ret;
}

function yeeEncrypt(plaintext, repeatedCount, decrypt) {
    if (plaintext == null) {
        return;
    }
    decrypt = (decrypt == true);
    // Encrypt / decrypt text
    let ciphertext = "";
    let keySize = keySequence.length;
    let sequenceId = 0;
    for (let c of plaintext.toString().split('')) {
        let cFinal = c;
        if (c == ' ') cFinal = (repeatedCount % 2 == 0 ? ' ' : spaceReplace);
        else if (c == spaceReplace) cFinal = (repeatedCount % 2 == 1 ? ' ' : spaceReplace);
        else if (minAscii <= c.charCodeAt() && c.charCodeAt() <= maxAscii) {
            let charNum;
            if (decrypt == false) {
                charNum = rangeMod(c.charCodeAt() + keySequence[sequenceId % keySize] * repeatedCount, minAscii, maxAscii);
            } else {
                charNum = rangeMod(c.charCodeAt() - keySequence[sequenceId % keySize] * repeatedCount, minAscii, maxAscii);
            }
            cFinal = String.fromCharCode(charNum);
        }
        ciphertext += cFinal;
        sequenceId = (sequenceId + 1) % keySize;
    }
    return ciphertext;
}

function yeeEncryptFull(text, key, repeatCount) {
    parseKey(key);
    return yeeEncrypt(text, repeatCount);
}

function yeeDecryptFull(text, key, repeatCount) {
    parseKey(key);
    return yeeEncrypt(text, repeatCount, true);
}

functionModule.yeeEncrypt = yeeEncryptFull;
functionModule.yeeDecrypt = yeeDecryptFull;

export {functionModule};