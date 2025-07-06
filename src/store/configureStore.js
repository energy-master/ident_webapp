
// import { createStore, combineReducers } from 'redux';
// import fileReducer from '../components/reducers/file_reducer.js';



export const updateStore = (state,action) => {
   
    // console.log(state);
    // console.log(action);

    
    
    switch (action.type) {
        case ('fileupload'):
            state.acousticFileData.fileName = action.payload['file-data'].file.name;
        
        
    }


    return state

}