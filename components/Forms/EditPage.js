import QuestionnaireMaking from '../Questionnaire/QuestionnaireMaking';
import Header from '../header/header';

import lodash from 'lodash';
import { useSelector } from 'react-redux';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

let key = 0;
const getKey = () => {
    return ++key;
}

const TitleKey = 0;

const checkRichTextEmpty = (content) => {
    if(!content) return true;
    if(typeof(content) === 'string') return false;
    return content['blocks'][0]['text'] === '';
}

const checkValidity = (questions) => {
    for(const question of questions)
    {
        if(question.content.type === 'title')
        {
            if(checkRichTextEmpty(question.content.title))
                return {
                    id: question.key,
                    type: 'title'
                }
            if(checkRichTextEmpty(question.content.description))
                return {
                    id: question.key,
                    type: 'description'
                }
            continue;
        }

        if(checkRichTextEmpty(question.content.description))
            return {
                id: question.key,
                type: 'description'
            };
        
        if(question.content.options)
        {
            for(let i = 0; i < question.content.options.length; ++i)
                if(!question.content.options[i].content)
                    return {
                        id: question.key,
                        type: 'option',
                        index: i
                    }
        }
    }
    return null;
}

let saveTimeoutIdentifier;

function EditPage() {
    const { data: session, status } = useSession();
    const [ authenticated, setAuthenticated ] = useState(false);
    const [ errorState, setErrorState ] = useState();

    const [questions, setQuestions] = useState([]);
    const [titleContent, setTitleContent] = useState();
    const [formTitle, setFormTitle] = useState('');

    const [save, setSave] = useState(false);
    const [saveHint, setSaveHint] = useState({
        msg: '',
        timeout: null
    });

    const [subpage, setSubpage] = useState('questions');

    const questionRef = useRef();
    questionRef.current = questions;

    const questionContent = useSelector((state) => state.question.questions);

    const router = useRouter();

    useEffect(() => {
        if(status !== 'authenticated') return;
        if(questions.length > 0) return;
        
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`)
        .then(data => {
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
    }, [status]);

    const getQuestionContent = () => {
        let orderArray = questionRef.current.map(elem => elem.id);
        orderArray.unshift(TitleKey);

        let CloneQuestion = lodash.cloneDeep(questionContent);
        CloneQuestion.sort((a, b) => {
            return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
        });

        CloneQuestion = CloneQuestion.map((question, index) => {
            question.order = index;
            return question;
        });

        return CloneQuestion;
    }

    const OnSubmitHandler = async (e) => {
        e.preventDefault();

        let storedQuestion = getQuestionContent();

        const missingPart = checkValidity(storedQuestion);
        if(missingPart)
        {
            setErrorState(missingPart);
            return;
        }

        storedQuestion = storedQuestion.map(question => {
            delete question.key;
            return question;
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formTitle,
                content: storedQuestion,
                publish: true
            })
        });
    }

    const OnSaveHandler = async (e) => {
        if(e) e.preventDefault();

        let storedQuestion = getQuestionContent();

        storedQuestion = storedQuestion.map(question => {
            delete question.key;
            return question;
        });
        
        setSaveHint((pre) => {
            if(pre.timeout) clearTimeout(pre.timeout);
            return {
                msg: 'Saving...',
                timeout: null
            }
        });
        
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaire/${router.query.questionnaireID}`,{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formTitle,
                content: storedQuestion,
                publish: false
            })
        });

        setSaveHint({
            msg: 'Saved',
            timeout: setTimeout(() => {
                setSaveHint({msg: ''});
            }, 3000)
        });
    }

    if(save)
    {
        OnSaveHandler();
        setSave(false);
    }

    const SaveTimeOut = () => {
        if(saveTimeoutIdentifier)
            clearTimeout(saveTimeoutIdentifier);
        saveTimeoutIdentifier = setTimeout(setSave.bind(null, true), 2000);
    }

    const onFormTitleChange = value => {
        SaveTimeOut();
        setFormTitle(value);
    }

    const onPreviewHandler = () => {
        router.push(`/questionnaire/${router.query.questionnaireID}/answer`);
    }

    const onPageChangeHandler = (name) => {
        setSubpage(name);
    }

    if(status === 'loading')
        return <p>Loading</p>
    if(status === 'unauthenticated')
        return <p>Prohibited!</p>
    if(!titleContent || !authenticated) return <div></div>;

    return (
        <>
            <Header
                title={formTitle}
                onChange={onFormTitleChange}
                submit={OnSubmitHandler}
                preview={onPreviewHandler}
                username={session.user.username}
                saveHint={saveHint.msg}
                changePage={onPageChangeHandler}
                subpage={subpage}
            />
            <QuestionnaireMaking
                id={router.query.questionnaireID}
                questions={questions}
                questionsChange={setQuestions}
                titleContent={titleContent}
                currentKey={key}
                getKey={getKey}
                error={errorState}
                clearError={() => setErrorState(null)}
                save={SaveTimeOut}
                hide={subpage !== 'questions'}
            />
            
        </>
    );
}

export default EditPage;
