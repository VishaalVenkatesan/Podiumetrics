"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import LoadingSpinner from '@/components/LoadingSpinner';
import {Link} from "@nextui-org/react";

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

const fetchData = async () => {
  setLoading(true);
  setError('');

  try {
    const response = await axios.get(`http://ergast.com/api/f1/${year}/circuits`);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedYear = parseInt(year);
    fetchData();
  };

useEffect(() => {
  fetchData();
}, []); 
  
  return (
  <div>
     <div className="pt-[40px]">
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md">
            <h1 className='mb-6 text-3xl font-bold text-center font-mutuka'>CIRCUITS</h1>
              <select 
                value={year} 
                onChange={(e) => {setYear(e.target.value)}}
                className='p-2 font-mono text-xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1}, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
          <div className="pt-2 pb-5 text-center">
          {error && <span className="text-red-500 ">{error}</span>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded ont-bold hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>
      
    {loading ? (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    ) : (
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 font-roboto">
        {circuits.map((circuit, index) => (
          <div key={index} className='p-6 text-center text-xl bg-gray-900 rounded-[20px] m-3 flex flex-col gap-y-7 focus:outline-none focus:shadow-outline'>
            <h2 className='text-3xl font-bold font-mutuka'>{circuit.CircuitName[0]}</h2>
            <p>Location: {circuit.Location[0].Locality[0]}, {circuit.Location[0].Country[0]}</p>
            <p>Latitude: {circuit.Location[0].$.lat}, Longitude: {circuit.Location[0].$.long}</p>
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