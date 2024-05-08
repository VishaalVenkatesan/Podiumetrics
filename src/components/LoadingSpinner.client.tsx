"use client"
import { useTheme } from 'next-themes';
import { helix } from "ldrs"

const LoadingSpinner: React.FC = () => {
   const { theme } = useTheme();
  helix.register()
  return(
  <div className='flex justify-center h-screen pt-[40px]'>
    {theme === 'dark' ? (
      <l-helix
      size="45"
      speed="2.5" 
      color="white" 
      ></l-helix>
    ) : (
        <l-helix
      size="45"
      speed="2.5" 
      color="black" 
      ></l-helix>
    )
}
  </div>
  )
}

export default LoadingSpinner;