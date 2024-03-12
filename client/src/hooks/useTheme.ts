import { useState, useEffect } from "react";
 
export default function useTheme() {
    const [theme, setTheme] = useState(localStorage.theme)
    const colorTheme = theme === "dark" ? "light" : "dark"
    localStorage.setItem("theme", theme)
    
    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove(colorTheme)
        root.classList.add(theme);
        if (localStorage.theme == "dark")
            localStorage.setItem("theme", "dark")
        else localStorage.setItem("theme", theme)
    }, [theme, colorTheme]);
 
    return {
        colorTheme, setTheme
    }
}