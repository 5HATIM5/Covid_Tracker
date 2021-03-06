import React , {useState,useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData,prettyPrint} from "./util";
import "leaflet/dist/leaflet.css";
import {MenuItem,FormControl,Select} from "@material-ui/core";
import {Card,CardContent} from "@material-ui/core";


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["Worldwide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80746,lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
   fetch( "https://disease.sh/v3/covid-19/all").then(response=>response.json())
   .then(data =>{
     setCountryInfo(data);
   })
  }, [])

  useEffect(() => {
    //async -> send a request , wait for it, do something with imput
  
  const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {

        const countries = data.map((country)=>(
        {
          name: country.country,
          value:country.countryInfo.iso2
        }));
      
        const sortedData = sortData(data)
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });

  };

  getCountriesData();
  }, []);
 
  const onCountryChange = async (event) => {
    const countrycode = event.target.value;
    setCountry(countrycode);

    const url = countrycode ==='Worldwide' ?
    "https://disease.sh/v3/covid-19/all":
    `https://disease.sh/v3/covid-19/countries/${countrycode}`;

    await fetch(url).then(response=>response.json())
    .then(data=>{
      setCountry(countrycode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    })
  };
  

  return (
        <div className="App">

<div className="app_left">

  <div className="app_header">
    <h1>COVID 19 TRACKER</h1>
      <FormControl className="app_dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="Worldwide">Worldwide</MenuItem>
            {
              countries.map(country=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
        </Select>
      </FormControl>
  </div>

  <div className="app_stats">
    <InfoBox 
      isRed
      active={casesType==="cases"}
      onClick={(e)=>setCasesType('cases')}
      title="Coronavirus Cases" 
      total={prettyPrint(countryInfo.todayCases)+` Total`} 
      cases={prettyPrint(countryInfo.cases)}
    /> 
    <InfoBox 
    active={casesType==="recovered"}
     onClick={(e)=>setCasesType('recovered')}
      title="Recovered" 
      total={prettyPrint(countryInfo.todayRecovered)+` Total`} 
      cases={prettyPrint(countryInfo.recovered)}
    />
    <InfoBox 
    isRed
    active={casesType==="deaths"}
     onClick={(e)=>setCasesType('deaths')}
      title="Deaths" 
      total={prettyPrint(countryInfo.todayDeaths)+` Total`} 
      cases={prettyPrint(countryInfo.deaths)}
    />               
  </div>

  <Map
    casesType={casesType}
    center={mapCenter}
    Zoom={mapZoom}
    countries={mapCountries}
  />
</div>

<Card className="app_right">
  <CardContent>
    <h3>Live Cases By Country</h3>
    <Table countries={tableData}/>
    <h3>Worldwide new casesType</h3>
    <LineGraph casesType={casesType} />
  </CardContent>
</Card>
</div>
  )
}

export default App;
