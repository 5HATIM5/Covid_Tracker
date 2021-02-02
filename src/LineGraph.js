import React,{useState,useEffect} from 'react'
import {Line} from "react-chartjs-2";
import numeral from "numeral";

const options ={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:{
            gridLines:{
                display:false,
            },
            tricks:{
                callback:function(value,index,values){
                    return numeral(value).format("0a");
                },
            },
        },
    },
}

function LineGraph(casesType="cases") {
    const [data, setData] = useState({});

    const builldChartData = (data, casesType) =>{
        const chartData = [];
        let lastDatapoint;

        for(let date in data.cases) {
            if(lastDatapoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date]-lastDatapoint
                };
                chartData.push(newDataPoint);
            }
            lastDatapoint = data[casesType][date];
        }
        return chartData;
    };

    useEffect(() => {
    const fetchData=async()=>{
       await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then(response => response.json())
        .then((data) => {
          let chartData=builldChartData(data,'cases');
          setData(chartData);
      });
    }
      fetchData(casesType);
    }, [casesType]);

    
    return (
        <div>
            {data?.length>0 && (
                 <Line
                options={options}
                data={{
                    datasets:[{
                        data:data,
                        backgroundColor:"rgba(204,16,52,0.5)",
                        borderColor:"#CC1034",
                    },
                ],
                }}
            />
            )}
        </div>
    )
}

export default LineGraph
