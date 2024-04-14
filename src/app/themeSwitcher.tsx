import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { IoMdSunny, IoMdMoon } from 'react-icons/io';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <div className="pt-[17px]">
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{ transition: 'color 0.5s', background: 'none', border: 'none' }}
      >
        {theme === 'dark' ? <IoMdSunny size={24} /> : <IoMdMoon size={24} />}
      </button>
    </div>
  )
};