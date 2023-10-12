import { functionModule as yeeEncryption } from "./yeeEncryption.js";
import { functionModule as asciiEncryption } from "./asciiEncryption.js";

let inputTextElement, inputKeyElement, inputRepeatedCountElement;
let encryptionTypeElement, encryptionResultElement;
let functionTable = {}

function setupEncryptTable() {
    functionTable["Yee Encrypt"] = yeeEncryption.yeeEncrypt;
    functionTable["Yee Decrypt"] = yeeEncryption.yeeDecrypt;
    functionTable["Hex ASCII to Text"] = asciiEncryption.hexAsciiToText;
    functionTable["Text to Hex ASCII"] = asciiEncryption.textToHexAscii;
}

function getElements() {
    inputTextElement = document.getElementById("inputText");
    inputKeyElement = document.getElementById("inputKey");
    inputRepeatedCountElement = document.getElementById("inputRepeatedCount");

    encryptionTypeElement = document.getElementById("encryptionType");
    encryptionResultElement = document.getElementById("encryptionResult");
}

function updateEncryption() {
    getElements();
    let text = inputTextElement.value;
    let key = inputKeyElement.value;
    let repeatCount = inputRepeatedCountElement.value;
    
    let encryptionType = encryptionTypeElement.value;
    if (Object.keys(functionTable).includes(encryptionType)) {
        let encryptionResult = functionTable[encryptionType](text, key, repeatCount);
        encryptionResultElement.innerText = encryptionResult;
    }
}

setupEncryptTable();

function onDOMContentLoaded() {
    document.getElementById("encryptButton").addEventListener("click", updateEncryption);
}
window.addEventListener("DOMContentLoaded", onDOMContentLoaded)