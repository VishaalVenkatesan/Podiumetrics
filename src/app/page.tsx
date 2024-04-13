"use client";
import f1bg from '../../public/f1bg.webp'
import Image from 'next/image';
import gsap from 'gsap';
import TextPlugin from 'gsap/dist/TextPlugin';
import { useRef, useEffect } from 'react';

gsap.registerPlugin(TextPlugin);

export default function Home(){
  const textRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'none', repeat: 2} });
    tl.to(textRef.current, { duration: 10, text: 'Welcome to Podiumetrics, your one stop destination for Formula 1 statistics' });
  }, []);
  return(
    <div className="relative min-h-screen">
      <Image src={f1bg} alt="F1 background" layout="fill" objectFit="cover" quality={100} className="absolute z-0 opacity-10"  />
      <div className="relative z-10 mt-10 ml-6 mr-6 md:mt-20 md:mr-14 md:ml-14">
        <h1 className='font-serif text-6xl font-bold md:text-8xl' ref={textRef}></h1>
      </div>
    </div>
  ); 
};