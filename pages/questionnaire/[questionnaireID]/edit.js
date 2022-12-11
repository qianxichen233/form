import QuestionnaireMaking from '../../../components/Questionnaire/QuestionnaireMaking';
import Header from '../../../components/header/header';

import store from '../../../components/stores/questionStore';
import { Provider } from 'react-redux';

import { useRouter } from 'next/router';

function App() {
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
