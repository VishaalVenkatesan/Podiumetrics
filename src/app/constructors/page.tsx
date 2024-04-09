"use client"

import axios from 'axios';
import { useState, useEffect } from "react";

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
    const constructorData = result.MRData.ConstructorTable[0].Constructor.map((constructor: any) => ({
      constructorId: constructor.$.constructorId,
      name: constructor.Name[0],
      nationality: constructor.Nationality[0],
      $: {
        url: constructor.$.url,
      },
    }));

    setConstructors(constructorData);
  } catch (error) {
    setError('Error fetching data. Please try again later.');
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const parsedYear = parseInt(year);
  if (parsedYear < 1950 || parsedYear > new Date().getFullYear()) {
    setError('Please enter a valid year between 1950 and the current year.');
  } else {
    setError('');
    fetchData();
  }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (value === '' || (!isNaN(parseInt(value)))) {
    setError('');
    setYear(value);
  } else {
    setError('Please enter a valid year.'); 
  }
};

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150" width="200" height="150">
          <path fill="none" stroke="#1118FF" strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z">
            <animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate>
          </path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="pt-[40px]">
        <h1>ENTER YOUR DESIRED YEAR</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={year}
            name="year"
            onChange={handleChange}
            className='w-auto p-2 text-xl text-black rounded'
          />
          {error && <span className="ml-2 text-red-500">{error}</span>}
          <button type="submit" className='w-auto p-2 ml-3 text-xl font-extrabold text-black bg-blue-200 border-white rounded hover:bg-blue-400'>SUBMIT</button>
        </form>
      </div>
      <div className="grid grid-cols-3 gap-4 font-roboto">
        {constructors.map((constructor, index) => (
          <div key={index} className='p-6 text-center text-xl text-black bg-white rounded-[20px] m-3 flex flex-col gap-y-7'>
            <h2 className=''>{constructor.name.toUpperCase()}</h2>
            <p>{constructor.nationality}</p>
            <a href={constructor.$.url} className='text-blue-700'>More info</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page;