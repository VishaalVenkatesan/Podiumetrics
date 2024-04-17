"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import LoadingSpinner from '@/components/LoadingSpinner';
import {Link} from "@nextui-org/react";
import CountryFlag from '@/components/CountryFlag';

interface Circuit {
  CircuitName: string[];
  Location: {
    Locality: string[];
    Country: string[];
    $: {
      lat: string;
      long: string;
    };
  }[];
  $: {
    circuitId: string;
    url: string;
  };
}


const Page = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  var xml2js = require('xml2js');

  const [circuits, setCircuits] = useState<Circuit[]>([]);

const fetchData = async (year : string) => {
  setLoading(true);
  setError('');

  try {
    const response = await axios.get(`https://ergast.com/api/f1/${year}/circuits`);
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(response.data);

    // Extract the circuits data from the parsed JSON
    const circuits = result.MRData.CircuitTable[0].Circuit;
    setCircuits(circuits);
  } catch (error) {
    setError('Error fetching data. Please check your internet connection or try again later.');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

    const handleYearChange= (e: React.ChangeEvent<HTMLSelectElement>)=> {
    e.preventDefault();
    const selectedYear = e.target.value;
  setYear(selectedYear);
    fetchData(selectedYear);
  };

useEffect(() => {
  fetchData(year);
}, []); 
  
  return (
  <div>
     <div className="pt-[80px] flex items-center justify-center flex-col">
            <h1 className='mb-6 font-mono text-4xl font-bold text-center'>CIRCUITS</h1>
              <select 
                value={year} 
                onChange={handleYearChange}
                className='p-2 w-[200px] font-mono text-2xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
          <div className="pt-2 pb-5 text-center">
          {error && <span className="text-red-500 ">{error}</span>}
          </div>
      </div>
      
    {loading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : (
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 font-roboto">
        {circuits.map((circuit, index) => (
          <div key={index} className='p-6 text-center text-xl border-b  rounded-[20px] m-3 flex flex-col gap-y-7 '>
            <h2 className='text-3xl font-bold font-mutuka'>{circuit.CircuitName[0]}</h2>
             <CountryFlag name={circuit.Location[0].Country[0]} />
            <p className="text-3xl font-bold font-mutuka"> {circuit.Location[0].Locality[0]}</p>
            <p className="text-3xl font-bold font-mutuka"> Latitude: {circuit.Location[0].$.lat}, Longitude: {circuit.Location[0].$.long}</p>
            <div className="flex items-center justify-center">
              <Link isExternal href={circuit.$.url} className='font-mono font-bold text-center'
                showAnchorIcon
                isBlock
                >
                More info</Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Page