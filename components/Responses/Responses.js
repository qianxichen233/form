import { useState, useEffect } from 'react';

import ResponseHeader from './Header/ResponseHeader';
import Summary from './Summary/Summary';
import Question from './Question/Question';
import Individual from './Individual/Individual';

import classes from './Responses.module.css';

const Responses = props => {
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState();
    const [loading, setLoading] = useState(true);

    const [responseStatus, setResponseStatus] = useState('Summary');

    const loadResponses = () => {
        setLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`)
        .then(res => res.json())
        .then(data => {
            if(data)
            {
                for(const response of data)
                    response.content = JSON.parse(response.content);
                setResponses(data);
            }
            setLoading(false);
        })
        .catch(console.log);
    }

    useEffect(() => {
        if(props.hide)
        {
            setLoading(true);
            return;
        }
        setQuestions(props.getQuestions().filter(e => e.key !== 0));
        loadResponses();
        
    }, [props.hide]);

    const deleteAllResponses = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`, {
            method: 'DELETE',
        });
        if(!response.ok)
            console.log(await response.json());
        else loadResponses();
    };

    const deleteOneResponse = async (id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            })
        });
        if(!response.ok)
            console.log(await response.json());
        else loadResponses();
    }

    if(props.hide) return null;

    if(loading)
    {
        return (
            <div
                className={classes.container}
            >
                <p>Loading...</p>
            </div>
        );
    }
    if(!responses?.length)
    {
        return (
            <div
                className={classes.container}
            >
                <p>No Responses Yet</p>
            </div>
        );
    }

    return (
        <div
            className={classes.container}
        >
            <ResponseHeader
                status={responseStatus}
                setStatus={setResponseStatus}
                deleteResponses={deleteAllResponses}
                responseNumber={responses.length}
                published={props.published}
            />
            {((status) => {
                if(status === 'Summary')
                {
                    return <Summary
                        responses={responses}
                        questions={questions}
                    />
                }
                if(status === 'Question')
                {
                    return <Question
                        responses={responses}
                        questions={questions}
                    />
                }
                if(status === 'Individual')
                {
                    return <Individual
                        responses={responses}
                        questions={questions}
                        delete={deleteOneResponse}
                    />
                }
            })(responseStatus)}
        </div>
    );
}

export default Responses;