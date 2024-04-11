export const handleYearChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setYear: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = e.target.value;
  if (value === '' || (!isNaN(parseInt(value)))) {
    setError('');
    setYear(value);
  } else {
    setError('Please enter a valid year.'); 
  }
};