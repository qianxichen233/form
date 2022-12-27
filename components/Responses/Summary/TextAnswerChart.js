import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import classes from './TextAnswerChart.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

const TextAnswerChart = props => {
    const total = Object.values(props.data).reduce((acc, value) => acc + value, 0);
    const data = {
        labels: Object.keys(props.data),
        datasets: [
            {
                data: Object.values(props.data),
                backgroundColor: 'rgb(103, 58, 183)'
            }
        ],
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        animation: {
            duration: 0,
            animation: {
                onComplete: function (ctx) {
                    console.log(ctx);
                }
              }
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white',
                formatter: (value) => {
                    return `${value} (${(value * 100 / total).toFixed(2) + "%"})`;
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `Count: ${context.raw}`;
                    }
                },
                displayColors: false
            }
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    };

    return <div className={classes.container}>
        <Bar
            data={data}
            options={options}
        />
    </div>
}

export default TextAnswerChart;