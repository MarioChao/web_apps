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
    functionTable["regexmatch"] = regexEncryption.matchAll;
    functionTable["regexmatchsingle"] = regexEncryption.matchSingleGroup;
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
    nodeParameterTable["regexmatch"] = regexEncryption.allNodeParameter;
    nodeParameterTable["regexmatchsingle"] = regexEncryption.groupNodeParameter;
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
        let isDiv = (infoElement.nodeName === "DIV");

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
    let nodeTypeElement = nodeChildren[1];
    let nodeInfoElement = nodeChildren[2];

    let encryptionTypeElement = getChildWithClass(nodeTypeElement, "input-encryptionType");

    // Set up event
    encryptionTypeElement.addEventListener("change", function() { updateEncryptionNodeInfo(nodeInfoElement, encryptionTypeElement) });
    updateEncryptionNodeInfo(nodeInfoElement, encryptionTypeElement);
    nodeInfoElement.style.display = "block";
    setUpNodeState(nodeElement);
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

// Node state functions
function getNodeStates(nodeElement) {
    // Get state elements
    let nodeChildren = nodeElement.children;
    let nodeStatesElement = nodeChildren[0];
    let nodeDisabledButton = getChildWithClass(nodeStatesElement, "node-disabled-state");
    let nodeBreakpointButton = getChildWithClass(nodeStatesElement, "node-breakpoint-state");
    
    // Get state
    let resultStates = {};
    resultStates.disabled = (nodeDisabledButton.value === "true");
    resultStates.breakpoint = (nodeBreakpointButton.value === "true");
    return resultStates;
}

function switchNodeState(stateButton) {
    // Change / toggle state
    let buttonClassList = stateButton.classList;
    let isPressed = buttonClassList.toggle("state-pressed");
    let newState;
    if (isPressed) {
        newState = "true";
    } else {
        newState = "false";
    }
    stateButton.value = newState;
}

function updateNodeState(nodeElement) {
    // Get states
    let nodeStates = getNodeStates(nodeElement);
    let nodeClassList = nodeElement.classList;

    // Update node's state visually
    nodeClassList.remove("state-default", "state-disabled", "state-breakpoint");
    if (nodeStates.disabled) {
        nodeClassList.add("state-disabled");
    } else if (nodeStates.breakpoint) {
        nodeClassList.add("state-breakpoint");
    } else {
        nodeClassList.add("state-default");
    }
}

function setUpNodeState(nodeElement) {
    // Get state element
    let nodeChildren = nodeElement.children;
    let nodeStatesElement = nodeChildren[0];

    // Go through states
    let nodeStatesChildren = nodeStatesElement.children;
    for (let i = 0; i < nodeStatesChildren.length; i++) {
        // Validate button
        let stateButton = nodeStatesChildren[i];
        if (stateButton.nodeName != "BUTTON") {
            continue;
        }

        // Set up event
        stateButton.addEventListener("click", function() {
            switchNodeState(stateButton);
            updateNodeState(nodeElement);
        });
    }
}

// Node encryption function
function activateEncryptionNode(nodeElement, inputText) {
    // Get node's child elements
    let nodeChildren = nodeElement.children;
    let nodeTypeElement = nodeChildren[1];
    let nodeInfoElement = nodeChildren[2];
    
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
        if (infoInputElement.type === "checkbox") {
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
nodeModule.getNodeStates = getNodeStates;
nodeModule.activate = activateEncryptionNode;

export { nodeModule };
