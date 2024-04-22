// Imports
import { hasClass, getChildWithClass } from "./helper-scripts/get-child.js";
import { functionModule as yeeEncryption } from "./crypto-scripts/yee-encryption.js";
import { functionModule as asciiEncryption } from "./crypto-scripts/ascii-encryption.js";
import { functionModule as spiralEncryption } from "./crypto-scripts/spiral-encryption.js";
import { functionModule as regexEncryption } from "./crypto-scripts/regex-match.js";
import { functionModule as vigenereEncryption } from "./crypto-scripts/vigenere-encryption.js";

// Variables
let encryptionListElement;
let defaultEncryptionNode;

let nodeParameterTable = {};
let functionTable = {};

// Local functions
function getMainElements() {
    if (!encryptionListElement) {
        encryptionListElement = document.getElementById("encryption-list");
    }
}

function setUpFunctionTable() {
    functionTable["yee"] = yeeEncryption.encrypt;
    functionTable["-yee"] = yeeEncryption.decrypt;
    functionTable["hexascii"] = asciiEncryption.textToHexAscii;
    functionTable["-hexascii"] = asciiEncryption.hexAsciiToText;
    functionTable["spiral"] = spiralEncryption.encrypt;
    functionTable["-spiral"] = spiralEncryption.decrypt;
    functionTable["regexmatch"] = regexEncryption.match;
    functionTable["vigenere"] = vigenereEncryption.encrypt;
    functionTable["-vigenere"] = vigenereEncryption.decrypt;
}

function setUpNodeParameterTable() {
    nodeParameterTable["yee"] = yeeEncryption.encryptNodeParameter;
    nodeParameterTable["-yee"] = yeeEncryption.decryptNodeParameter;
    nodeParameterTable["hexascii"] = asciiEncryption.textToHexAsciiNodeParameter;
    nodeParameterTable["-hexascii"] = asciiEncryption.hexAsciiToTextNodeParameter;
    nodeParameterTable["spiral"] = spiralEncryption.encryptNodeParameter;
    nodeParameterTable["-spiral"] = spiralEncryption.decryptNodeParameter;
    nodeParameterTable["regexmatch"] = regexEncryption.nodeParameter;
    nodeParameterTable["vigenere"] = vigenereEncryption.encryptNodeParameter;
    nodeParameterTable["-vigenere"] = vigenereEncryption.decryptNodeParameter;
}

// Node functions
function updateEncryptionNodeInfo(nodeInfoElement, encryptionTypeElement) {
    // Get contents
    let encryptionType = encryptionTypeElement.value;
    let nodeParameter = nodeParameterTable[encryptionType];

    // Validate parameter
    if (!nodeParameter) {
        nodeParameter = {};
    }

    // Show / hide the node parameters
    let nodeInfoChildren = nodeInfoElement.children;
    for (let i = 0; i < nodeInfoChildren.length; i++) {
        let infoElement = nodeInfoChildren[i];
        let infoName = infoElement.className;
        let isDiv = (infoElement.nodeName == "DIV");

        if (!isDiv || nodeParameter[infoName]) {
            infoElement.style.display = "block";
        } else {
            infoElement.style.display = "none";
        }
    }
}

function setUpEncryptionNode(nodeElement) {
    // Get contents
    let nodeChildren = nodeElement.children;
    let nodeTypeElement = nodeChildren[0];
    let nodeInfoElement = nodeChildren[1];

    let encryptionTypeElement = getChildWithClass(nodeTypeElement, "input-encryptionType");

    // Set up event
    encryptionTypeElement.addEventListener("change", function() { updateEncryptionNodeInfo(nodeInfoElement, encryptionTypeElement) });
    updateEncryptionNodeInfo(nodeInfoElement, encryptionTypeElement);
    nodeInfoElement.style.display = "block";
}

function addEncryptionNode(amount) {
    getMainElements();
    while (amount != 0) {
        if (amount > 0) {
            // Append node
            let newNode = defaultEncryptionNode.cloneNode(true);
            encryptionListElement.appendChild(newNode);
            setUpEncryptionNode(newNode);
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
    getMainElements();
    let defaultNode = getChildWithClass(encryptionListElement, "encryption-node");
    setUpEncryptionNode(defaultNode);
    
    defaultEncryptionNode = defaultNode && defaultNode.cloneNode(true);
    if (!defaultNode) {
        console.warn("Default node not found!");
    }
}

// Node encryption function
function activateEncryptionNode(nodeElement, inputText) {
    // Get node's child elements
    let nodeChildren = nodeElement.children;
    // console.log(nodeChildren);
    let nodeTypeElement = nodeChildren[0];
    let nodeInfoElement = nodeChildren[1];
    
    // Validate encryption type
    let encryptionTypeElement = getChildWithClass(nodeTypeElement, "input-encryptionType");
    let encryptionType = encryptionTypeElement && encryptionTypeElement.value;
    let isValidEncryptType = encryptionType && Object.keys(functionTable).includes(encryptionType);
    if (!isValidEncryptType) {
        // Failed encryption
        return {
            result : "Invalid encryption type (" + encryptionType.toString() + ")",
            success : false,
        };
    }

    // Get the node info (parameter values) for the encryption type
    let nodeParameter = nodeParameterTable[encryptionType];
    let nodeInfo = {};
    for (let infoName of Object.keys(nodeParameter)) {
        if (!nodeParameter[infoName]) {
            continue;
        }
        
        let infoElement = getChildWithClass(nodeInfoElement, infoName);
        let infoInputElement = infoElement && getChildWithClass(infoElement, "input-" + infoName.toString());
        if (!infoInputElement) {
            console.warn("Failed to get element " + infoName.toString() + "!");
            continue;
        }
        if (infoInputElement.type == "checkbox") {
            nodeInfo[infoName] = infoInputElement.checked;
        } else {
            nodeInfo[infoName] = infoInputElement.value;
        }
    }

    // Run node encryption
    let nodeResult = functionTable[encryptionType](inputText, nodeInfo);
    return nodeResult;
}

// Set up functions
function initialSetUpNodeModule() {
    setUpFunctionTable();
    setUpNodeParameterTable();
}

function loadedSetUpNodeModule() {
    setUpDefaultEncryptionNode();
}

// Node module
let nodeModule = {};

nodeModule.initialSetUp = initialSetUpNodeModule;
nodeModule.loadedSetUp = loadedSetUpNodeModule;
nodeModule.addNode = addEncryptionNode;
nodeModule.activate = activateEncryptionNode;

export { nodeModule };
