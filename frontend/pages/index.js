//import './App.css';

import Questionnaire from '../components/Questionnaire/Questionnaire';
import Header from '../components/header/header';

import store from '../components/stores/questionStore';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className='App'>
        <Header/>
        <Questionnaire/>
      </div>
    </Provider>
  );
}

export default App;
