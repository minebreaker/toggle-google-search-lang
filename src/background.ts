import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails
import BlockingResponse = chrome.webRequest.BlockingResponse


let savedLang: string

const regEnglish = /^[a-zA-Z0-9\s]*$/

function rewrite(request: WebRequestBodyDetails): BlockingResponse | void {

    const url = new URL(request.url)
    const params = url.searchParams

    if (savedLang === "en") {
        params.set("lr", "lang_en")
    } else if (savedLang === "ja") {
        params.set("lr", "lang_ja")
    } else {  // Auto detect


        // If the language is already set, leave it as is.
        if (params.get("lr")) {
            return
        }

        const query = params.get("q")
        if (regEnglish.test(query || "")) {
            params.set("lr", "lang_en")
        } else {
            params.set("lr", "lang_ja")
        }
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

namespace chrome.storage {
    export interface StorageArea {
        onChanged: StorageChangedEvent
    }
}

chrome.storage.sync.onChanged.addListener(result => {
    if (result && result.lang && result.lang.newValue) {
        savedLang = result.lang.newValue
    }
})
