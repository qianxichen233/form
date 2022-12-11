import QuestionnaireAnswer from '../../../components/Questionnaire/QuestionnaireAnswer';

import { useRouter } from 'next/router';

const App = () => {
    const router = useRouter();
    return (
        <div className='App'>
            <QuestionnaireAnswer id={router.query.questionnaireID}/>
        </div>
    )
}

export default App;