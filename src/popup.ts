type Lang = "auto" | "default" | "en" | "ja"

function isLang(arg: any): arg is Lang {
    return arg === "auto" || arg === "default" || arg === "en" || arg === "ja"
}

document.addEventListener("DOMContentLoaded", () => {

    const elAuto = document.getElementById("lr_auto") as HTMLInputElement
    const elDefault = document.getElementById("lr_default") as HTMLInputElement
    const elEn = document.getElementById("lr_en") as HTMLInputElement
    const elJa = document.getElementById("lr_ja") as HTMLInputElement

    const langToEl = (lang: Lang) => {
        return lang === "en" ? elEn :
            lang === "ja" ? elJa :
                lang === "default" ? elDefault :
                    elAuto
    }

    const select = (lang: Lang, refresh: boolean = true) => {
        langToEl(lang).checked = true

        chrome.storage.sync.set({lang}, () => {
            console.log(`Changed to: ${lang}`)
        })

        if (refresh) {
            chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                if (tabs.length === 0) return
                const tab = tabs[0]
                if (!tab.id || !tab.active || !tab.url) return
                const host = new URL(tab.url).host
                if (host !== "www.google.com" && host !== "www.google.co.jp") return

                chrome.tabs.reload(tab.id)
            })
        }
    }

    elAuto.addEventListener("change", () => {
        select("auto")
    })
    elDefault.addEventListener("change", () => {
        select("default")
    })
    elEn.addEventListener("change", () => {
        select("en")
    })
    elJa.addEventListener("change", () => {
        select("ja")
    })

    chrome.storage.sync.get("lang", ({lang: result}) => {
        if (!isLang(result)) {
            console.log(`invalid language: ${result}`)
            select("auto", false)
        } else {
            select(result, false)
        }
    })
})
