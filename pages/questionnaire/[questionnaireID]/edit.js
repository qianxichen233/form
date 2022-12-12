import store from '../../../components/stores/questionStore';
import { Provider } from 'react-redux';

import EditPage from '../../../components/Forms/EditPage';

function App() {
    return (
        <Provider store={store}>
            <div className='App'>
                <EditPage />
            </div>
        </Provider>
    );
}

export default App;
