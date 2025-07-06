import React from 'react';
import './activity_plotter.css';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bubble, Line, Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    BarElement,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend);


const buildData = (data) => {
    let dataSets = [];
    let labels = Array.from(Array(100).keys());
    console.log('Building datasets');

    let y_data = [];
    for (let i = 0; i < 100; i++){
        y_data.push(Math.random()/10);
    }
    dataSets = [
        {
            label: 'InitData',
            data : y_data,
            backgroundColor: 'green'
        }
    ]

    data = {labels:labels, datasets:dataSets}
    return data;
}

const ActivityPlotter = (parms) => {
    const options = {
        maintainAspectRatio: false,
        aspectRatio: 1,
        responsive: true,
        plugins: {
            legend: {
                display:false
            },
            title: {
                display: false,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            y: {
                min: 0,
                max: 1,
            }
        }
    };
      
    const data = buildData();

    console.log(data);
    return (
        <div className='activity_plot'>
            <Bar options = {options} data = {data} />
        </div>
    )

}



export default ActivityPlotter;