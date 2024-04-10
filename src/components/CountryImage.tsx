import { useEffect, useState } from 'react';
import { fetchCountry} from '../app/utils/fetchCountry'
import Image from 'next/image';

interface CountryImageProps {
    nationality: string;
}

const CountryImage: React.FC<CountryImageProps> = ({ nationality }) => {
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
        <div>
            {imageURL && <Image src={imageURL} alt="Country Flag" height={100} width={100} className='block mx-auto'/>}
        </div>
    );
};

export default CountryImage;
