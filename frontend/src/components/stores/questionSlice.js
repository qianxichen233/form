import { createSlice } from '@reduxjs/toolkit'

export const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: []
  },
  reducers: {
    setQuestionStore: (state, action) => {
      for(const question of state.questions)
      {
        if(question.key === action.payload.id)
        {
          question.content = action.payload.content;
          return state;
        }
      }
      state.questions.push(
        {
            key: action.payload.id,
            content: action.payload.content
        }
      )
      return state;
    },

    deleteQuestionStore: (state, action) => {
      state.questions = state.questions.filter(question => {
        return question.key !== action.payload.id;
      })
      return state;
    },

    test: (state, action) => {
        console.log('test');
    }
  },
})

export const { setQuestionStore, deleteQuestionStore, test } = questionSlice.actions

export default questionSlice.reducer