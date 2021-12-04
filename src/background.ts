export {}

type Lang = "en" | "ja" | "default"

declare const chrome: any

let savedLang: Lang

let prevUrl = ""

function rewrite(request: any): any | void {

    const url = new URL(request.url)
    const params = url.searchParams

    if (savedLang === "en") {
        params.set("lr", "lang_en")
    } else if (savedLang === "ja") {
        params.set("lr", "lang_ja")
    } else if (savedLang === "default") {
        params.delete("lr")
    } else {  // Auto detect
        return
    }

    const urlStr = url.toString()
    if (urlStr === prevUrl) {
        // If the url is the same as previous one, don't redirect to it so to prevent infinite redirecting.
        return
    }

    prevUrl = urlStr
    return {redirectUrl: urlStr}
}

chrome.webRequest.onBeforeRequest.addListener(rewrite,
    {
        urls: [
            "*://www.google.com/search?*",
            "*://www.google.co.jp/search?*"
        ],
        types: ["main_frame", "sub_frame"]
    },
    ["blocking"]
)

chrome.storage.onChanged.addListener((changes: any) => {
    if (changes && changes.lang && changes.lang.newValue) {
        savedLang = changes.lang.newValue
    }
})
