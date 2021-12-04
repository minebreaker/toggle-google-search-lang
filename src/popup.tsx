import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import {createUseStyles} from "react-jss"
import {Country, Lang, storageKeys} from "./shared"

declare const chrome: any

const useStyles = createUseStyles({
    "body": {
        "margin": "1rem"
    }
})

function App() {
    const classes = useStyles()

    const [lang, setLang] = useState<Lang>("default")
    const [country, setCountry] = useState<Country>("default")
    const onChange = (lang: Lang, country: Country) => {
        setLang(lang)
        setCountry(country)
        chrome.storage.sync.set({[storageKeys.lang]: lang, [storageKeys.country]: country}, () => {
            console.log(`Changed to: ${lang}, ${country}`)
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

    // Load saved settings
    useEffect(() => {
        chrome.storage.sync.get(null, ({lang, country}: any) => {
            if (lang) {
                setLang(lang)
            }
            if (country) {
                setCountry(country)
            }
        })
    }, [chrome, setLang, setCountry])

    return (
        <div className={classes.body}>
            <h4>Language</h4>
            <div className="form-check">
                <input id="lr_en" className="form-check-input" type="radio" name="lang"
                       checked={lang === "en"}
                       onChange={() => onChange("en", country)}/>
                <label className="form-check-label" htmlFor="lr_en">English</label>
            </div>
            <div className="form-check">
                <input id="lr_ja" className="form-check-input" type="radio" name="lang"
                       checked={lang === "ja"}
                       onChange={() => onChange("ja", country)}/>
                <label className="form-check-label" htmlFor="lr_ja">Japanese</label>
            </div>
            <div className="form-check">
                <input id="lr_default" className="form-check-input" type="radio" name="lang"
                       checked={lang === "default"}
                       onChange={() => onChange("default", country)}/>
                <label className="form-check-label" htmlFor="lr_default">Default</label>
            </div>

            <h4>Country</h4>
            <div className="form-check">
                <input id="cr_US" className="form-check-input" type="radio" name="country"
                       checked={country === "US"}
                       onChange={() => onChange(lang, "US")}/>
                <label className="form-check-label" htmlFor="cr_US">US</label>
            </div>
            <div className="form-check">
                <input id="cr_JP" className="form-check-input" type="radio" name="country"
                       checked={country === "JP"}
                       onChange={() => onChange(lang, "JP")}/>
                <label className="form-check-label" htmlFor="cr_JP">Japan</label>
            </div>
            <div className="form-check">
                <input id="cr_default" className="form-check-input" type="radio" name="country"
                       checked={country === "default"}
                       onChange={() => onChange(lang, "default")}/>
                <label className="form-check-label" htmlFor="cr_default">Default</label>
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
