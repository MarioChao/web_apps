// Imports
import { nodeModule } from "./encryption-node.js";
import { hasClass, getChildWithClass } from "./helper-scripts/get-child.js";

// Variables
let inputTextElement, encryptionResultElement, encryptionListElement;

// Functions
function setUpEncryptionMain() {
    nodeModule.initialSetUp();
}

function getMainElements() {
    inputTextElement = document.getElementById("start-input-text");
    encryptionResultElement = document.getElementById("final-output-result");
    encryptionListElement = document.getElementById("encryption-list");
}

function startEncryption() {
    // Get contents
    getMainElements();
    let text = inputTextElement.value;
    let encryptionNodes = encryptionListElement.children;

    // Encrypt
    let startText = text;
    let encryptionResult;
    for (let i = 0; i < encryptionNodes.length; i++) {
        let node = encryptionNodes[i];
        if (!hasClass(node, "encryption-node")) {
            continue;
        }
        encryptionResult = nodeModule.activate(node, startText);
        startText = encryptionResult.result;
        if (!encryptionResult.success) {
            break;
        }
    }
    
    // Result
    encryptionResultElement.innerText = encryptionResult.result;
}

function onDOMContentLoaded() {
    document.getElementById("encrypt-button").addEventListener("click", startEncryption);
    document.getElementById("add-encryption-node").addEventListener("click", function() { nodeModule.addNode(1); });
    document.getElementById("remove-encryption-node").addEventListener("click", function() { nodeModule.addNode(-1); });
    nodeModule.loadedSetUp();
}

// Calling / connecting functions
window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
setUpEncryptionMain();
