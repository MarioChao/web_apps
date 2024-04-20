// More about Regular Expression: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

// Local functions
function getRegexMatchAll(text, pattern) {
    const re = new RegExp(pattern, "g");
    return text.matchAll(re);
}

// Encryption functions
function regexMatch(text, pattern, matchId, groupId) {
    const matches = getRegexMatchAll(text, pattern);
    let matchesArray = [...matches];
    let match = matchesArray[matchId];
    let group = match && match[groupId];
    return group;
}

function regexMatchFull(text, nodeInfo) {
    // Get variables
    let pattern = nodeInfo.pattern;
    let matchId = nodeInfo.matchId;
    let groupId = nodeInfo.groupId;

    // Encrypt
    let resultText = regexMatch(text, pattern, matchId, groupId);
    if (!resultText) {
        return {
            result : "Regular expression match failed!",
            success : false,
        };
    }

    // Return
    return {
        result : resultText,
        success : true,
    };
}

function getRegexMatchNodeParameter() {
    return {
        pattern : true,
        matchId : true,
        groupId : true,
    };
}

// Function module
let functionModule = {};

functionModule.match = regexMatchFull;

functionModule.nodeParameter = getRegexMatchNodeParameter();

export { functionModule };
