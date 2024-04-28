// Regular Expression Matching
// Retrieve a single segment of a string using Regex match

// More about Regular Expression: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions

// Local functions
function getRegexMatchGlobalAll(text, pattern) {
    const re = new RegExp(pattern, "g");
    let matches = text.matchAll(re);
    return matches;
}

function getRegexMatchGlobal(text, pattern) {
    const re = new RegExp(pattern, "g");
    let matches = text.match(re);
    return matches;
}

function getRegexMatchesString(text, pattern, separator) {
    let realSeparator = separator || "";

    const matches = getRegexMatchGlobal(text, pattern);
    let matchesArray = matches && [...matches];
    let matchesString = matchesArray && matchesArray.join(realSeparator);
    return matchesString;
}

// Encryption functions
function regexMatchSingleGroup(text, pattern, matchId, groupId) {
    const matches = getRegexMatchGlobalAll(text, pattern);
    let matchesArray = matches && [...matches];
    let match = matchesArray[matchId];
    let resultGroup = match && match[groupId];
    return resultGroup;
}

function regexMatchAll(text, pattern) {
    let resultString = getRegexMatchesString(text, pattern, "\n");
    return resultString;
}

function regexReplace(text, pattern, replaceText) {
    const re = new RegExp(pattern, "g");
    let resultText = text.replace(re, replaceText);
    return resultText;
}

// Encrypt node functions
function regexMatchSingleGroupFull(text, nodeInfo) {
    // Get variables
    let pattern = nodeInfo.pattern;
    let matchId = nodeInfo.matchId;
    let groupId = nodeInfo.groupId;

    // Encrypt
    let resultText = regexMatchSingleGroup(text, pattern, matchId, groupId);
    if (!resultText) {
        return {
            result: "Regular expression match failed!",
            success: false,
        };
    }

    // Return
    return {
        result: resultText,
        success: true,
    };
}

function regexMatchAllFull(text, nodeInfo) {
    // Get variables
    let pattern = nodeInfo.pattern;

    // Encrypt
    let resultText = regexMatchAll(text, pattern);
    if (!resultText) {
        return {
            result: "Regular expression match failed!",
            success: false,
        };
    }

    // Return
    return {
        result: resultText,
        success: true,
    };
}

function regexReplaceFull(text, nodeInfo) {
    // Get variables
    let pattern = nodeInfo.pattern;
    let replaceText = nodeInfo.replaceText;

    // Encrypt
    let resultText = regexReplace(text, pattern, replaceText);
    if (!resultText) {
        return {
            result: "Regular expression match failed!",
            success: false,
        };
    }

    // Return
    return {
        result: resultText,
        success: true,
    };
}

function getRegexMatchSingleGroupNodeParameter() {
    return {
        pattern: true,
        matchId: true,
        groupId: true,
    };
}

function getRegexMatchAllNodeParameter() {
    return {
        pattern: true,
    };
}

function getRegexReplaceNodeParameter() {
    return {
        pattern: true,
        replaceText: true,
    };
}

// Function module
let functionModule = {};

functionModule.matchSingleGroup = regexMatchSingleGroupFull;
functionModule.matchAll = regexMatchAllFull;
functionModule.replaceAll = regexReplaceFull;

functionModule.groupNodeParameter = getRegexMatchSingleGroupNodeParameter();
functionModule.allNodeParameter = getRegexMatchAllNodeParameter();
functionModule.replaceNodeParameter = getRegexReplaceNodeParameter();

export { functionModule };
