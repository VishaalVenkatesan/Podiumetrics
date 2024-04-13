import { useEffect, useState } from 'react';
import { fetchCountry} from "../app/utils/fetchCountry";
import Image from 'next/image';

interface CountryImageProps {
  name: string;
  size?: number; // Add a size prop
}

const CountryImage: React.FC<CountryImageProps> = ({ name, size = 100 }) => { // Set a default size
  const [imageURL, setImageURL] = useState<string>('');

  useEffect(() => {
    fetchCountry(name)
      .then(flags => {
        if (flags) {
          setImageURL(flags.svg);
        }
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });
  }, [name]); 

  return (
    <div className='flex justify-center'> 
      {imageURL && <Image src={imageURL} alt="Country Flag" height={size} width={size} />} 
    </div>
  );
};

export default CountryImage;