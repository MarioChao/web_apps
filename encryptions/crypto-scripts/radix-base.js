// Convert between Radix Base

// Constants
const digitValueString = "0123456789abcdefghijklmnopqrstuvwxyz";
const digitToDecimal = createDigitObject(digitValueString);
const decimalToDigit = invertObject(digitToDecimal);


// Local functions
function createDigitObject(string) {
    let resultObject = {};
    let value = 0;
    for (let digit of string) {
        resultObject[digit.toLowerCase()] = value;
        resultObject[digit.toUpperCase()] = value;
        value++;
    }
    return resultObject;
}

function invertObject(object) {
    let resultObject = {};
    for (let key of Object.keys(object)) {
        resultObject[object[key]] = key.toUpperCase();
    }
    return resultObject;
}

function decimalToBase(number, radix) {
    // Convert decimal to radix base
    let resultText = "";
    let tmpDecimal = number;
    while (tmpDecimal > 0) {
        resultText = decimalToDigit[tmpDecimal % radix] + resultText;
        tmpDecimal = Math.floor(tmpDecimal / radix);
    }
    return resultText;
}

// Encryption functions
function radixEncrypt(text, radixFrom, radixTo) {
    let resultText = "";
    
    // Go through numbers
    const pattern = `\\b[${digitValueString.substring(0, radixFrom)}]+\\b`
    const regex = new RegExp(pattern, "g");
    let match;
    let lastIndex = 0;
    match = regex.exec(text);
    while (match !== null) {
        // Convert matched number
        const matchText = match[0];
        const matchNumber = parseInt(matchText, radixFrom);
        const newNumber = decimalToBase(matchNumber, radixTo);

        // Update result text
        resultText += text.slice(lastIndex, match.index);
        resultText += newNumber.toString();
        lastIndex = match.index + matchText.length;
        
        // Next number
        match = regex.exec(text);
    }
    resultText += text.slice(lastIndex);

    return resultText;
}

// Encrypt node functions
function radixEncryptFull(text, nodeInfo) {
    // Get variables
    const radixFrom = parseInt(nodeInfo.radixFrom);
    const radixTo = parseInt(nodeInfo.radixTo);

    // Validate
    let isValid = (2 <= radixFrom && radixFrom <= 36);
    isValid &= (2 <= radixTo && radixTo <= 36);
    if (!isValid) {
        return {
            result: "Radix should be between 2 and 36 (inclusive)!",
            success: false,
        }
    }

    // Encrypt
    let resultText = radixEncrypt(text, radixFrom, radixTo);
    
    // Return
    return {
        result: resultText,
        success: true,
    };
}

function getRadixEncryptNodeParameter() {
    return {
        "radixTo": true,
        "radixFrom": true,
    };
}

// Function module
let functionModule = {};

functionModule.encrypt = radixEncryptFull;

functionModule.encryptNodeParameter = getRadixEncryptNodeParameter();

export { functionModule };
