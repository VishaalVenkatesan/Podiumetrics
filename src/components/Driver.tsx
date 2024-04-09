const Driver = ({drivers}) => {
  return (
      {drivers.map((driver, index) => (
        <div key={index}>
          <h2>{driver.GivenName[0]} {driver.FamilyName[0]}</h2>
          <p>Nationality: {driver.Nationality[0]}</p>
          <p>Date of Birth: {driver.DateOfBirth[0]}</p>
          <a href={driver.$.url}>More info</a>
          </div>
      ))}
        
  )
}

export default Driver