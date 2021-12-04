import React, {useState} from "react"
import ReactDOM from "react-dom"

type Lang = "en" | "ja" | "default"

declare const chrome: any

function App() {
    const [checked, setChecked] = useState<Lang>("default")
    const onChange = (lang: Lang) => {
        setChecked(lang)
        chrome.storage.sync.set({lang}, () => {
            console.log(`Changed to: ${lang}`)
        })

        // Refresh if the current
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: any) => {
            if (tabs.length === 0) return
            const tab = tabs[0]
            if (!tab.id || !tab.active || !tab.url) return
            const url = new URL(tab.url)
            if (url.host !== "www.google.com" && url.host !== "www.google.co.jp") return
            if (url.pathname !== "/search") return

            chrome.tabs.reload(tab.id)
        })
    }

    return (
        <div>
            <div className="form-check">
                <input id="lr_en" className="form-check-input" type="radio" name="lang"
                       checked={checked === "en"}
                       onChange={() => onChange("en")}/>
                <label className="form-check-label" htmlFor="lr_en">English</label>
            </div>
            <div className="form-check">
                <input id="lr_ja" className="form-check-input" type="radio" name="lang"
                       checked={checked === "ja"}
                       onChange={() => onChange("ja")}/>
                <label className="form-check-label" htmlFor="lr_ja">Japanese</label>
            </div>
            <div className="form-check">
                <input id="lr_default" className="form-check-input" type="radio" name="lang"
                       checked={checked === "default"}
                       onChange={() => onChange("default")}/>
                <label className="form-check-label" htmlFor="lr_default">Default</label>
            </div>
        </div>
    )
}

function main() {
    ReactDOM.render(
        <App/>,
        document.getElementById("app")
    )
}

main()


//
// function isLang(arg: any): arg is Lang {
//     return arg === "auto" || arg === "default" || arg === "en" || arg === "ja"
// }
//
// document.addEventListener("DOMContentLoaded", () => {
//
//     const elAuto = document.getElementById("lr_auto") as HTMLInputElement
//     const elDefault = document.getElementById("lr_default") as HTMLInputElement
//     const elEn = document.getElementById("lr_en") as HTMLInputElement
//     const elJa = document.getElementById("lr_ja") as HTMLInputElement
//
//     const langToEl = (lang: Lang) => {
//         return lang === "en" ? elEn :
//             lang === "ja" ? elJa :
//                 lang === "default" ? elDefault :
//                     elAuto
//     }
//
//     const select = (lang: Lang, refresh: boolean = true) => {
//         langToEl(lang).checked = true
//
//         chrome.storage.sync.set({lang}, () => {
//             console.log(`Changed to: ${lang}`)
//         })
//
//         if (refresh) {
//             chrome.tabs.query({active: true, currentWindow: true}, (tabs: any) => {
//                 if (tabs.length === 0) return
//                 const tab = tabs[0]
//                 if (!tab.id || !tab.active || !tab.url) return
//                 const host = new URL(tab.url).host
//                 if (host !== "www.google.com" && host !== "www.google.co.jp") return
//
//                 chrome.tabs.reload(tab.id)
//             })
//         }
//     }
//
//     elAuto.addEventListener("change", () => {
//         select("auto")
//     })
//     elDefault.addEventListener("change", () => {
//         select("default")
//     })
//     elEn.addEventListener("change", () => {
//         select("en")
//     })
//     elJa.addEventListener("change", () => {
//         select("ja")
//     })
//
//     chrome.storage.get("lang", (arg: any) => {
//         const {lang: result} = arg
//         if (!isLang(result)) {
//             console.log(`invalid language: ${result}`)
//             select("auto", false)
//         } else {
//             select(result, false)
//         }
//     })
// })
