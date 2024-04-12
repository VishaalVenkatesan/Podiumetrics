"use client"

import axios from 'axios';
import { useState, useEffect } from "react";
import CountryImage from "../../components/CountryImage"; 
import {Link} from "@nextui-org/react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { handleYearChange } from '../utils/handleYearChange';

interface Constructor {
  constructorId: string[];
  name: string;
  nationality: string;
  $: {
    url: string;
  };
}

const Page = () => {
  var xml2js = require('xml2js'); 
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const currentYear = new Date().getFullYear();
  //Type array that will store the constructor data fetched from the API
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const fetchData = async () => {
  setLoading(true);
  setError('');

  try {
    // Sends a GET request to the API endpoint with the specified year.
    const response = await axios.get(`https://ergast.com/api/f1/${year}/constructors`);
    //new instance of xm2js parser.
    const parser = new xml2js.Parser();
    // parses the response data from the API using the xml2js library.
    const result = await parser.parseStringPromise(response.data);
    //any type for now, since we don't know its exact structure yet.
    const constructorData = result.MRData.ConstructorTable[0].Constructor.map((constructor: any) => {
  return {
    constructorId: constructor.$.constructorId,
    name: constructor.Name[0],
    nationality: constructor.Nationality[0],
    $: {
      url: constructor.$.url,
    },
  };
  });
    setConstructors(constructorData);
  } catch (error) {
    setError('Error fetching data. Please try again later.');
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
  },[])


  return (
    <div>
      <div className="pt-[40px]">
        <form onSubmit={handleSubmit}  className="flex flex-col max-w-md p-8 mx-auto rounded-lg shadow-md">
          <h1 className='mb-6 text-3xl font-bold text-center font-mutuka'>CONSTRUCTORS</h1>
          <div className="mb-4">
               <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className='w-full p-2 mb-3 font-mono text-xl font-bold text-center rounded-md focus:outline-none focus:shadow-outline'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1},
               (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
        </div>
          
          {error && <span className="ml-2 text-red-500">{error}</span>}
         <button
          type="submit"
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
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
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 font-roboto">
        {constructors.map((constructor, index) => (
          <div key={index} className='p-6 text-center text-xl bg-gray-900 rounded-[20px] m-3 flex flex-col gap-y-7 '
           >
            <h2 className='text-3xl font-bold font-mutuka'>{constructor.name.toUpperCase()}</h2>
            <p className='font-semibold font-carlson'>{constructor.nationality}</p>
            <CountryImage nationality={constructor.nationality} />
            <div className='flex items-center justify-center'>
            <Link isExternal href={constructor.$.url} className='font-mono font-bold text-center' 
                isBlock 
                showAnchorIcon>
              More info</Link>
              </div>
          </div>
        ))}
      </div>
      )
  }
    </div>
  );
}

export default Page;