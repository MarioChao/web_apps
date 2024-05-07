// Fetch might be blocked by CORS policy

// Fetch functions
async function fetchUrl(apiUrl, urlParameters) {
    // Put parameters
    const searchParams = new URLSearchParams(urlParameters);
    apiUrl += "?" + searchParams.toString();
    // apiUrl = apiUrl;
    console.log(apiUrl);
    console.log("Fetching");

    let init = null;

    // Fetch
    try {
        const response = await fetch(apiUrl, init);
        if (!response.ok) {
            throw new Error("Could not fetch resources");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function module
const functionModule = {
    fetchUrl : fetchUrl,
}

export { functionModule };
