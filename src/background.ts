function awaiting<T>(f: (cb: (result: T) => void) => void): T {
    let result = null
    f(r => {
        result = r
    })

    while(!result) {
        // NOP
    }

    return result
}

let savedLang: Lang

const regAscii = /^[\x00-\x7F]*$/

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

        const query = params.get("q") || ""
        const detectedLang = awaiting<any>(cb => chrome.i18n.detectLanguage(query, (l: any) => cb(l)))
        console.log(detectedLang)
        if (detectedLang.languages[0]) {
            const code = detectedLang.languages[0].language
            // After few tries, I found detectLanguage() is unreliable,
            // Assumes it's english if not ja.
            // Kanjis are often detected as chinese falsely, force setting japanese.
            if (code !== 'ja' && code !== 'zh') {
                params.set("lr", "lang_en")
            } else {
                params.set("lr", `lang_${code}`)
            }
        } else {
            if (regAscii.test(query)) {
                params.set("lr", "lang_en")
            } else {
                params.set("lr", "lang_ja")
            }
        }
    }

    return {redirectUrl: url.toString()}
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

chrome.storage.sync.onChanged.addListener((result: any) => {
    if (result && result.lang && result.lang.newValue) {
        savedLang = result.lang.newValue
    }
})
