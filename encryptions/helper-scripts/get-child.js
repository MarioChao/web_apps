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

export { hasClass, getChildWithClass };
