import { useState } from 'react'
import useTheme from '@/hooks/useTheme';
import { DarkModeSwitch } from 'react-toggle-dark-mode'

const defaultProperties = {
    dark: {
        circle: {
            r: 9,
        },
        mask: {
            cx: '50%',
            cy: '23%',
        },
        svg: {
            transform: 'rotate(40deg)',
        },
        lines: {
            opacity: 0,
        },
    },
    light: {
        circle: {
            r: 5,
        },
        mask: {
            cx: '100%',
            cy: '0%',
        },
        svg: {
            transform: 'rotate(90deg)',
        },
        lines: {
            opacity: 1,
        },
    },
    springConfig: { mass: 4, tension: 250, friction: 35 },
  };

const darkMode = ({classes = ''}: {classes?: string}) => {
    const {colorTheme, setTheme} = useTheme()
    const [darkSide, setDarkSide] = useState(
        colorTheme === "light" ? true : false
    )
 
    const toggleDarkMode = (checked: any) => {
        setTheme(colorTheme)
        setDarkSide(checked)
    }
    return (
        <DarkModeSwitch
            checked={darkSide}
            onChange={toggleDarkMode}
                size={25}
                animationProperties={defaultProperties}
                moonColor='white'
                sunColor='black'
            className={classes}
        />
    )
}

export default darkMode