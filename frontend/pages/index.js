import QuestionnaireMaking from '../components/Questionnaire/QuestionnaireMaking';
import Header from '../components/header/header';

import store from '../components/stores/questionStore';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <Header/>
        <QuestionnaireMaking/>
      </div>
    </Provider>
  );
}

export default App;
