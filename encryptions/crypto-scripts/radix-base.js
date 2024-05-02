// Convert between Radix Base

// Constants
const digitValueString = "0123456789abcdefghijklmnopqrstuvwxyz";
const digitToBigInt = createDigitObject(digitValueString);
const bigIntToDigit = invertObject(digitToBigInt);


// Local functions
function createDigitObject(string) {
    let resultObject = {};
    let value = BigInt(0);
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

function parseBigInt(string, radix = 10) {
    // Validate
    if (typeof radix !== "number" || isNaN(radix) || !(2 <= radix && radix <= 36)) {
        throw new Error(`parseBigInt doesn't support radix ${radix}.`);
    }

    // Convert string in radix base to BigInt number
    let resultBigInt = BigInt(0);
    let base = BigInt(radix);
    for (let digit of string) {
        resultBigInt *= base;
        resultBigInt += digitToBigInt[digit];
    }
    return resultBigInt;
}

function bigIntToBase(bigIntNumber, radix) {
    // Validate
    if (typeof radix !== "number" || isNaN(radix) || !(2 <= radix && radix <= 36)) {
        throw new Error(`parseBigInt doesn't support radix ${radix}.`);
    }

    // Convert BigInt number to radix base
    let resultText = "";
    let oldNumber = BigInt(bigIntNumber);
    let base = BigInt(radix);
    while (oldNumber > 0) {
        resultText = bigIntToDigit[oldNumber % base] + resultText;
        oldNumber = oldNumber / base; // BigInt division will floor
    }
    return resultText;
}

// Encryption functions
function radixEncrypt(text, radixFrom, radixTo) {
    // Create regex
    let numberPattern = digitValueString.slice(0, Math.min(10, radixFrom));
    let letterPattern = digitValueString.slice(10, radixFrom).toLowerCase();
    letterPattern += letterPattern.toUpperCase();
    const pattern = `\\b[${numberPattern}${letterPattern}]+\\b`
    const regex = new RegExp(pattern, "g");
    
    // Go through numbers
    let resultText = "";
    let match;
    let lastIndex = 0;
    match = regex.exec(text);
    while (match !== null) {
        // Convert matched number
        const matchText = match[0];
        const matchNumber = parseBigInt(matchText, radixFrom);
        const newNumber = bigIntToBase(matchNumber, radixTo);

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
