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

    useEffect(() => {
        if(props.hide)
        {
            setLoading(true);
            return;
        }
        setQuestions(props.getQuestions().filter(e => e.key !== 0));
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`)
        .then(res => res.json())
        .then(data => {
            if(data) setResponses(data);
            setLoading(false);
        })
        .catch(console.log)
    }, [props.hide]);

    const deleteAllResponses = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${props.id}/answer`, {
            method: 'DELETE',
        });
        if(!response.ok)
            console.log(await response.json());
    };

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
                    />
                }
            })(responseStatus)}
        </div>
    );
}

export default Responses;