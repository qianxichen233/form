import { useSession } from "next-auth/react";

import DisplayQuestionnaire from '../Questionnaire/DisplayQuestionnaire';

import Header from './Header';
import CreateNewQuestionnaire from './CreateNewQuestionnaire';

import classes from './Profile.module.css';
import { useRouter } from "next/router";

const Profile = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    if(status === 'loading')
        return <p>Loading</p>

    return (
        <>
            <Header
                session={session}
                status={status}
            />
            <div className={classes.placeholder}></div>
            {status !== 'unauthenticated' ? <div className={classes.container}>
                <div className={classes.QuestionnaireContainer}>
                    <CreateNewQuestionnaire />
                    <DisplayQuestionnaire />
                </div>
            </div> : null}
        </>
    );
}

export default Profile;
