import {Country, Lang, storageKeys} from "./shared"

declare const chrome: any

let prevUrl = ""

async function rewrite(request: any): Promise<any> {

    const url = new URL(request.url)
    const params = url.searchParams
    const result: any = await new Promise(resolve => {
        chrome.storage.sync.get(null, resolve)
    })
    const savedLang: Lang = result ? result[storageKeys.lang] as Lang : "default"
    const savedCountry: Country = result ? result[storageKeys.country] as Country : "default"

    if (savedLang === "en") {
        params.set("lr", "lang_en")
    } else if (savedLang === "ja") {
        params.set("lr", "lang_ja")
    } else {
        params.delete("lr")
    }
    if (savedCountry === "US") {
        params.set("cr", "countryUS")
    } else if (savedCountry === "JP") {
        params.set("cr", "countryJP")
    } else {
        params.delete("cr")
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
