import FormTitleCart from '../QuestionCart/FormTitleCart';
import QuestionCartDisplay from '../QuestionCart/QuestionCartDisplay';
import classes from './Questionnaire.module.css';

const QuestionnaireDisplay = (props) => {
    const questions = props.questions;
    const responses = props.responses;
    
    let transformedResponse = [];
    for(const question of questions)
    {
        if(question.key === 0) continue;
        const response = responses.find(response => response.key === question.key);
        transformedResponse.push(response?.content);
    }

    return (
    <div className={classes.questionnaire}>
        <div className={classes.container}>
            {questions && questions.map((question, index) => {
                if(question.content.type === 'title')
                {
                    return <FormTitleCart
                        key={question.key}
                        display={true}
                        title={question.content.title}
                        description={question.content.description}
                    />
                }
                else
                {
                    return <QuestionCartDisplay
                        key={question.key}
                        value={transformedResponse[index]}
                        display={true}
                        {...question.content}
                    />
                }
            })}
        </div>
    </div>
    )
}

export default QuestionnaireDisplay;