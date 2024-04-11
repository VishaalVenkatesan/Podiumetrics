import { useEffect, useState } from 'react';
import { fetchCountry } from '../app/utils/fetchCountry'
import Image from 'next/image';

interface CountryImageProps {
  nationality: string;
  size?: number; // Add a size prop
}

const CountryImage: React.FC<CountryImageProps> = ({ nationality, size = 100 }) => { // Set a default size
  const [imageURL, setImageURL] = useState<string>('');

  useEffect(() => {
    fetchCountry(nationality)
      .then(flags => {
        if (flags) {
          setImageURL(flags.svg);
        }
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });
  }, [nationality]); 

  return (
    <div className='flex justify-center'> 
      {imageURL && <Image src={imageURL} alt="Country Flag" height={size} width={size} />} 
    </div>
  );
};

export default CountryImage;