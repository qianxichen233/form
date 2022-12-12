import QuestionnaireMaking from '../../../components/Questionnaire/QuestionnaireMaking';
import Header from '../../../components/header/header';

import store from '../../../components/stores/questionStore';
import { Provider } from 'react-redux';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function App() {
    const { data: session, status } = useSession();

    const router = useRouter();
    return (
        <Provider store={store}>
            <div className='App'>
                <Header/>
                <QuestionnaireMaking id={router.query.questionnaireID}/>
            </div>
        </Provider>
    );
}

export default App;
