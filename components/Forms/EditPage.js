import QuestionnaireMaking from '../Questionnaire/QuestionnaireMaking';
import Header from '../header/header';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

let key = 0;
const getKey = () => {
    return ++key;
}

function EditPage() {
    const { data: session, status } = useSession();
    const [ authenticated, setAuthenticated ] = useState(false);

    const [questions, setQuestions] = useState([]);
    const [titleContent, setTitleContent] = useState();
    const [formTitle, setFormTitle] = useState('');

    const router = useRouter();

    useEffect(() => {
        if(!session) return;
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/fetch`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: router.query.questionnaireID
            })
        }).then(data => {
            if(!data.ok)
                return Promise.reject('unauthenticated');
            return data.json();
        })
        .then(questionnaire => {
            const content = JSON.parse(questionnaire.content);
            if(Object.keys(content).length === 0)
            {
                const key = getKey();
                setQuestions([
                    {
                        key: key,
                        id: key
                    }
                ]);
                setTitleContent({content: {}});
                setFormTitle(questionnaire.title);
                setAuthenticated(true);
            }
            else
            {
                let questions = [];
                for(const question of content)
                {
                    if(question.content.type === 'title')
                    {
                        setTitleContent(question.content);
                        continue;
                    }
                    const key = getKey();
                    questions.push({
                        key: key,
                        id: key,
                        content: question.content
                    });
                }
                setFormTitle(questionnaire.title);
                setQuestions(questions);
                setAuthenticated(true);
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [session]);

    const onFormTitleChange = e => {
        setFormTitle(e.target.value);
    }

    if(status === 'loading')
        return <p>Loading</p>
    if(!authenticated || status === 'unauthenticated')
        return <p>Prohibited!</p>
    if(!titleContent) return <div></div>;

    return (
        <>
            <Header
                title={formTitle}
                onChange={onFormTitleChange}
            />
            <QuestionnaireMaking
                id={router.query.questionnaireID}
                questions={questions}
                titleContent={titleContent}
                currentKey={key}
                formTitle={formTitle}
                getKey={getKey}
            />
        </>
    );
}

export default EditPage;
