"use client";
import f1bg from '../../public/f1bg.webp'
import Image from 'next/image';
import gsap from 'gsap';
import TextPlugin from 'gsap/dist/TextPlugin';
import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';


gsap.registerPlugin(TextPlugin);

export default function Home(){
  const { theme } = useTheme();
  const textRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none'} });
    tl.to(textRef.current, { duration: 10, text: 'Welcome to Podiumetrics, your one stop destination for Formula 1 legacy statistics.' });
  }, []);
  return(
    <div className="relative min-h-screen">
      {theme === 'dark' ? (
      <Image src={f1bg} alt="F1 background" layout="fill" objectFit="cover" quality={100} className="absolute z-0 opacity-10"  />
      ):(
        <div className=""></div>
      )}
      <div className="relative z-10 pt-10 ml-6 mr-6 md:pr-14 md:pl-14">
        <h1 className='font-serif text-6xl pt-[30px] font-bold md:text-9xl md:pt-[30px]' ref={textRef}></h1>
      </div>
    </div>
  ); 
};