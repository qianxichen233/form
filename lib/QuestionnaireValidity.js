const checkRichTextEmpty = (content) => {
    if(!content) return true;
    if(typeof(content) === 'string') return false;
    return content['blocks'][0]['text'] === '';
}

export const checkQuestionValidity = (questions) => {
    if(!questions.length) return false;
    for(const question of questions)
    {
        if(question.content.type === 'title')
        {
            if(checkRichTextEmpty(question.content.title))
                return false;
            if(checkRichTextEmpty(question.content.description))
                return false;
            continue;
        }

        if(checkRichTextEmpty(question.content.description))
            return false;
        
        if(question.content.options)
        {
            for(let i = 0; i < question.content.options.length; ++i)
                if(!question.content.options[i].content)
                    return false;
        }
    }
    return true;
}

const isEmpty = (answer) => {
    if(!answer) return true;
    if(typeof(answer) === 'string') return false;
    if(Array.isArray(answer))
        return answer.length === 0;
    return answer['blocks'][0]['text'] === '';
}

export const checkAnswerValidity = (questions, answers) => {
    for(let i = 0; i < questions.length; ++i)
    {
        if(questions[i].content.type === 'title') continue;
        if(questions[i].content.required && !answers[i].content)
            return false;
        if(questions[i].content.subtype === 'multichoice' && answers[i].content && answers[i].content.length > 1)
            return false;
        if(!questions[i].content.required) continue;
        if(isEmpty(answers[i].content))
            return false;
    }
    return true;
}
