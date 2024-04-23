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
        // Validate node
        let node = encryptionNodes[i];
        if (!hasClass(node, "encryption-node")) {
            continue;
        }

        // Check node state
        let nodeStates = nodeModule.getNodeStates(node);
        if (nodeStates.disabled == true) {
            continue;
        } else if (nodeStates.breakpoint == true) {
            break;
        }

        // Encrypt
        encryptionResult = nodeModule.activate(node, startText);
        startText = encryptionResult.result;
        if (!encryptionResult.success) {
            break;
        }
    }
    
    // Result
    encryptionResultElement.value = startText;
}

function onDOMContentLoaded() {
    let encryptButton = document.getElementById("encrypt-button");
    let addNodeButton = document.getElementById("add-encryption-node");
    let removeNodeButton = document.getElementById("remove-encryption-node");

    encryptButton.addEventListener("click", startEncryption);
    addNodeButton.addEventListener("click", function() { nodeModule.addNode(1); });
    removeNodeButton.addEventListener("click", function() { nodeModule.addNode(-1); });

    nodeModule.loadedSetUp();
}

// Calling / connecting functions
window.addEventListener("DOMContentLoaded", onDOMContentLoaded);
setUpEncryptionMain();
