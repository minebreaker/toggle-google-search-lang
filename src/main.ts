import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails
import BlockingResponse = chrome.webRequest.BlockingResponse


const regEnglish = /^[a-zA-Z0-9\s]*$/

function rewrite(request: WebRequestBodyDetails): BlockingResponse | void {

    const url = new URL(request.url)
    const params = url.searchParams

    // If the language is already set, leave it as is.
    if (params.get("lr")) {
        return
    }

    const query = params.get("q")
    console.log(query)
    if (regEnglish.test(query || "")) {
        params.set("lr", "lang_en")
    }

    return {redirectUrl: url.toString()}
}

chrome.webRequest.onBeforeRequest.addListener(rewrite,
    {
        urls: [
            "*://www.google.com/*",
            "*://www.google.co.jp/*"
        ],
        types: ["main_frame", "sub_frame"]
    },
    ["blocking"]
)
