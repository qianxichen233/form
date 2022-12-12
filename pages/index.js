import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";

import DisplayQuestionnaire from '../components/Questionnaire/DisplayQuestionnaire';

function App() {
    const { data: session, status } = useSession();

    const router = useRouter();

    const createNewQuestionnaire = async (id) => {
        await fetch(`api/questionnaire/modify`,{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Untitled Form',
                    content: {},
                    id: id,
                    publish: false
                })
            });
    }

    const onClickHandler = async () => {
        await fetch('/api/questionnaire/newID')
            .then(res => res.json())
            .then(msg => {
                createNewQuestionnaire(msg.id);
                router.push(`/questionnaire/${msg.id}/edit`);
            })
            .catch(console.log);
    }

    if(status === 'loading')
        return <p>Loading</p>
    if(status === 'unauthenticated')
        return <p>Please sign in first</p>

    return (
        <>
            <p onClick={onClickHandler} style={{cursor: "pointer"}}>Click to create a new questionnaire</p>
            <DisplayQuestionnaire />
        </>
    );
}

export default App;
