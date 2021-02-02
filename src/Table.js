import React from 'react';
import './Table.css';
import numeral from "numeral"

function Table({countries}) {
    return (
        <div>
             <div className="table">
            {countries.map(({country,cases})=>(
                <tr>
                    <td>{country}</td>
                    <td><strong>{numeral(cases).format(",")}</strong></td>
                </tr>
            ))}
        </div>
        </div>
    );
}

export default Table
