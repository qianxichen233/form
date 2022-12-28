import Cart from "../../UI/Cart/Cart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Pie } from "react-chartjs-2";
import RichTextEditorDisplay from '../../UI/RichTextEditor/RichTextEditorDisplay';

import { generateRandomColor, copyToClipBoard } from './utils';

import classes from './MultipleChoiceCart.module.css';

import { CopyButton } from '../../UI/Icons';
import { useRef, useState, useCallback } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

let colors = [
    {r: 51, g: 102, b: 204}, //blue
    {r: 220, g: 57, b: 18},  //red
    {r: 255, g: 153, b: 0},  //yellow
    {r: 16, g: 150, b: 24},  //green
    {r: 153, g: 0, b: 153}   //purple
];

const mergeResponse = (responses, question) => {
    let mergedResponse = {};
    let total = 0;
    for(const option of question.options)
    {
        const content = option.content;
        if(mergedResponse[content] === undefined || mergedResponse[content] === null)
            mergedResponse[content] = 0;
    }
    if(!responses) return mergedResponse;
    for(const response of responses)
    {
        for(const choice of response)
        {
            if(mergedResponse[choice] === undefined || mergedResponse[choice] === null)   
                mergedResponse[choice] = 0;
            ++mergedResponse[choice];
            ++total;
        }
    }
      
    return [mergedResponse, total];
}

const MultipleChoiceCart = props => {
    const responses = props.responses?.filter(response => {
        if(response) return true;
    }) || [];
    const [mergedResponse, total] = mergeResponse(responses, props.question);

    const ChartRef = useRef();
    const [CartRef, setCartRef] = useState();

    const colorOrder = ['blue', 'red', 'yellow', 'green', 'purple'];
    for(let i = 5; i < Object.keys(mergedResponse).length; ++i)
        colors.push(generateRandomColor(colorOrder[i % colorOrder.length]));

    const measuredRef = useCallback(node => {
        if (node !== null)
            setCartRef(node);
    }, []);

    const getColor = (length, opacity = 1) => {
        return colors.slice(0, length).map((color) => {
            return `rgba(${color.r},${color.g},${color.b},${opacity})`;
        })
    };

    const getSingleColor = (pos, opacity = 1) => {
        return `rgba(${colors[pos].r},${colors[pos].g},${colors[pos].b},${opacity})`;
    }

    const responseCount = Object.values(mergedResponse).reduce(
        (acc, response) => acc + (response > 0 ? 1 : 0),
        0
    );

    const DeHighlight = () => {
        ChartRef.current.setActiveElements([]);
        ChartRef.current.update();
    }

    const Highlight = (index) => {
        ChartRef.current.setActiveElements([
            {
                datasetIndex: 0,
                index
            }
        ]);
        ChartRef.current.update();
    }

    const ChartData = {
        labels: Object.keys(mergedResponse),
        datasets: [
            {
                data: Object.values(mergedResponse),
                backgroundColor: getColor(mergedResponse.length, 1),
                borderColor: getColor(mergedResponse.length, 1),
                borderWidth: 1,
                borderAlign: 'inner',
                hoverOffset: 10,
            }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: false,
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                formatter: (value, ctx) => {
                    if(value === 0) return null;
                    const percentage = (value * 100 / total).toFixed(2) + "%";
                    return percentage;
                },
                color: '#fff',
                font: {
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.parsed} (${(context.parsed * 100 / total).toFixed(2) + "%"})`;
                    }
                },
                displayColors: false
            }
        },
        layout: {
            padding: {
                 bottom(ctx) {
                    const chart = ctx.chart;
                    let pb = 0;
                    chart.data.datasets.forEach(function(el) {
                        const hOffset = el.hoverOffset || 0;
                        pb = Math.max(hOffset / 2 + 5, pb)
                    });
                    return pb;
                },
                top(ctx) {
                    const chart = ctx.chart;
                    let pb = 0;
                    chart.data.datasets.forEach(function(el) {
                        const hOffset = el.hoverOffset || 0;
                        pb = Math.max(hOffset / 2 + 5, pb)
                    });
                    return pb;
                }
            },
        },
    };

    return <Cart ref={measuredRef}>
        <header className={classes.header}>
            <div>
                <RichTextEditorDisplay
                    value={props.question.description}
                    size='big'
                    width={'100%'}
                    placeholder="Question Statement"
                    paddingVertical='20px'
                    paddingHorizontal='0'
                />
                <p>{`${responses.length} response${responses.length === 1 ? '' : 's'}`}</p>
                {responseCount === 0 && <p>No responses yet for this question</p>}
            </div>
            <div data-html2canvas-ignore="true" onClick={() => {
                props.setHint('Chart Copied to Clipboard.');
                copyToClipBoard(CartRef);
            }}>
                <div>
                    <CopyButton size={25} color="blue"/>
                </div>
                <p>Copy</p>
            </div>
        </header>
        {responseCount !== 0 && <div className={classes.ChartContainer}>
            <Pie
                data={ChartData}
                height={200}
                options={options}
                ref={ChartRef}
            />
            <ul>
                {Object.keys(mergedResponse).map((option, index) => {
                    return <li key={index} onMouseEnter={Highlight.bind(null, index)} onMouseLeave={DeHighlight}>
                        <div style={{backgroundColor: getSingleColor(index, 1)}}></div>
                        <p>{option}</p>
                    </li>
                })}
            </ul>
        </div>}
    </Cart>
}

export default MultipleChoiceCart;