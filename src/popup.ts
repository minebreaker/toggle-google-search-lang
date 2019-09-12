type Lang = "auto" | "en" | "ja"

function isLang(arg: any): arg is Lang {
    return arg === "auto" || arg === "en" || arg === "ja"
}

document.addEventListener("DOMContentLoaded", () => {

    const elAuto = document.getElementById("lr_auto") as HTMLInputElement
    const elEn = document.getElementById("lr_en") as HTMLInputElement
    const elJa = document.getElementById("lr_ja") as HTMLInputElement

    const langToEl = (lang: Lang) => {
        return lang === "en" ? elEn :
            lang === "ja" ? elJa :
                elAuto
    }

    const select = (lang: Lang) => {
        langToEl(lang).checked = true
        chrome.storage.sync.set({lang}, () => {
            console.log(`Changed to: ${lang}`)
        })
    }

    elAuto.addEventListener("change", () => {
        select("auto")
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
            select("auto")
        } else {
            select(result)
        }
    })
})
