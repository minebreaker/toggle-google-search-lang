import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"
import {createUseStyles} from "react-jss"

type Lang = "en" | "ja" | "default"

declare const chrome: any

const useStyles = createUseStyles({
    "body": {
        "margin": "1rem"
    }
})

function App() {
    const classes = useStyles()

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

    // Load saved settings
    useEffect(() => {
        chrome.storage.sync.get("lang", (result: any) => {
            if (result && result["lang"]) {
                setChecked(result["lang"])
            }
        })
    }, [chrome, setChecked])

    return (
        <div className={classes.body}>
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
