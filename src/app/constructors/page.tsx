"use client"

import axios from 'axios';
import { useState, useEffect } from "react";
import CountryImage from "../../components/NationalityFlag"; 
import {Link} from "@nextui-org/react";
import LoadingSpinner from '@/components/LoadingSpinner';

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

const fetchData = async (year : string) => {
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
  },[])


  return (
    <div>
      <div className="pt-[80px]">
          <h1 className='mb-6 font-mono text-4xl font-bold text-center '>CONSTRUCTORS</h1>
          <div className="flex items-center justify-center mb-4">
               <select 
                value={year} 
                onChange={handleYearChange}
                className='w-[200px] p-2 mb-1 border-b font-mono text-2xl font-bold text-center rounded-md focus:outline-none border-black'
                >
              {Array.from({length: new Date().getFullYear() - 1950 + 1},
               (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
               ))}
            </select>
        </div>
          
          {error && <span className="mb-4 ml-2 text-xl text-center text-red-600 font-mutuka">{error}</span>}
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
      ) : (
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid md:grid-cols-3 font-roboto">
        {constructors.map((constructor, index) => (
          <div key={index} className='p-6 text-center text-xl border-b  rounded-[20px] m-3 flex flex-col gap-y-7 '
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