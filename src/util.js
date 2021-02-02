import React from "react";
import{Circle,Popup} from "react-leaflet";
import numeral from "numeral";

const casesTypeColors={

    cases:{
        hex:"#CC1034",
        multiplier: 500,
    },
    recovered:{
        hex:"#7dd71d",
        multiplier: 800,
    },
    deaths:{
        hex:"#fb4443",
        multiplier: 1600,
    },
};

export const sortData=(data)=>{
    const sortedData = [...data];

    return sortedData.sort((a,b)=> (a.cases>b.cases ? -1:1));
    // sortedData.sort((a,b)=>{
    //     if(a.cases>b.cases){
    //         return -1;
    //     }else{
    //         return 1;
    //     }
    // })
    // return sortedData;
};



export const prettyPrint =(stat)=>stat?`+${numeral(stat).format("0.0a")}`:"+0";

export const showDataOnMap=(data,casesType='cases') =>(

    data.map(country=>(
        <Circle
            center={[country.countryInfo.lat,country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
            }
             
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.cases).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);