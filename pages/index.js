import { useRouter } from 'next/router';

import { useSession } from "next-auth/react";

function App() {
    const { data: session, status } = useSession();


    const router = useRouter();

    const createNewQuestionnaire = async (email, id) => {
        await fetch(`api/questionnaire/modify`,{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    creator: email,
                    content: {},
                    id: id,
                    publish: false
                })
            });
    }

    const onClickHandler = async (email) => {
        await fetch('/api/questionnaire/newID')
            .then(res => res.json())
            .then(msg => {
                createNewQuestionnaire(email, msg.id);
                router.push(`/questionnaire/${msg.id}/edit`);
            })
            .catch(console.log);
        
    }

    if(status === 'loading')
        return <p>Loading</p>
    if(status === 'unauthenticated')
        return <p>Please sign in first</p>

    return (
        <p onClick={onClickHandler.bind(null, session.user.email)} style={{cursor: "pointer"}}>Click to create a new questionnaire</p>
    );
}

export default App;
