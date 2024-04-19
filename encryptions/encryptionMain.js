import { functionModule as yeeEncryption } from "./encode-scripts/yeeEncryption.js";
import { functionModule as asciiEncryption } from "./encode-scripts/asciiEncryption.js";

// Variables
let inputTextElement, encryptionResultElement, encryptionListElement;
let defaultEncryptionNode;

let functionTable = {};
let nodeParameterTable = {};

// Functions
function hasClass(element, className) {
    return element.classList.contains(className);
}

function getChildWithClass(element, className) {
    let childElements = element.children;
    for (let i = 0; i < childElements.length; i++) {
        if (hasClass(childElements[i], className)) {
            return childElements[i];
        }
    }
    return null;
}

function setUpEncryptTable() {
    functionTable["yee"] = yeeEncryption.yeeEncrypt;
    functionTable["-yee"] = yeeEncryption.yeeDecrypt;
    functionTable["hexascii"] = asciiEncryption.textToHexAscii;
    functionTable["-hexascii"] = asciiEncryption.hexAsciiToText;
}

function setUpNodeInfoTable() {
    nodeParameterTable["yee"] = yeeEncryption.yeeEncryptNodeParameter;
    nodeParameterTable["-yee"] = yeeEncryption.yeeDecryptNodeParameter;
    nodeParameterTable["hexascii"] = asciiEncryption.textToHexAsciiNodeParameter;
    nodeParameterTable["-hexascii"] = asciiEncryption.hexAsciiToTextNodeParameter;
}

function setUpEncryptionMain() {
    setUpEncryptTable();
    setUpNodeInfoTable();
}

function getMainElements() {
    inputTextElement = document.getElementById("start-input-text");
    encryptionResultElement = document.getElementById("final-output-result");
    encryptionListElement = document.getElementById("encryption-list");
}

function activateEncryptionNode(inputText, nodeElement) {
    // Get node's child elements
    let nodeChildren = nodeElement.children;
    console.log(nodeChildren);
    let nodeTypeElement = nodeChildren[0];
    let nodeInfoElement = nodeChildren[1];
    
    // Validate encryption type
    let encryptionTypeElement = getChildWithClass(nodeTypeElement, "input-encryptionType");
    let encryptionType = encryptionTypeElement && encryptionTypeElement.value;
    let isValidEncryptType = encryptionType && Object.keys(functionTable).includes(encryptionType);
    if (!isValidEncryptType) {
        // Failed encryption
        return inputText;
    }

    // Get the node info (parameter values) for the encryption type
    let nodeInfo = {};
    for (let infoName of Object.keys(nodeParameterTable[encryptionType])) {
        let infoElement = getChildWithClass(nodeInfoElement, infoName);
        let infoInputElement = infoElement && getChildWithClass(infoElement, "input-" + infoName.toString());
        if (!infoInputElement) {
            console.warn("Failed to get element " + infoName.toString() + "!");
            continue;
        }
        nodeInfo[infoName] = infoInputElement.value;
    }

    // Run node encryption
    let nodeResult = functionTable[encryptionType](inputText, nodeInfo);
    return nodeResult;
}

function updateEncryption() {
    // Get contents
    getMainElements();
    let text = inputTextElement.value;
    let encryptionNodes = encryptionListElement.children;
    console.log(encryptionNodes);

    let encryptionResult = text;
    for (let i = 0; i < encryptionNodes.length; i++) {
        let node = encryptionNodes[i];
        if (!hasClass(node, "encryption-node")) {
            continue;
        }
        encryptionResult = activateEncryptionNode(encryptionResult, node);
    }
    
    // Result
    encryptionResultElement.innerText = encryptionResult;
}

function addEncryptionNode(amount) {
    getMainElements();
    while (amount != 0) {
        if (amount > 0) {
            // Append node
            encryptionListElement.appendChild(defaultEncryptionNode.cloneNode(true));
            amount--;
        } else if (amount < 0) {
            // Check if there are at least 2 nodes
            if (encryptionListElement.children.length < 2) {
                break;
            }
            // Remove last node
            encryptionListElement.removeChild(encryptionListElement.lastElementChild);
            amount++;
        } else {
            // Never
            break;
        }
    }
}

function setUpDefaultEncryptionNode() {
    encryptionListElement = document.getElementById("encryption-list");
    let defaultNode = getChildWithClass(encryptionListElement, "encryption-node");
    defaultEncryptionNode = defaultNode && defaultNode.cloneNode(true);
    if (!defaultNode) {
        warn("Default node not found!");
    }
}

function onDOMContentLoaded() {
    document.getElementById("encrypt-button").addEventListener("click", updateEncryption);
    document.getElementById("add-encryption-node").addEventListener("click", function() { addEncryptionNode(1); });
    document.getElementById("remove-encryption-node").addEventListener("click", function() { addEncryptionNode(-1); });
    setUpDefaultEncryptionNode();
}

// Calling / connecting functions
window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
setUpEncryptionMain();
