import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';


import { updateStore } from './store/configureStore';


/* IDent Components */

import NavBar from './components/nav';
import SpecPanel from './components/spec_panel/spec_panel';
import IDentSpeedMenu from './components/speed_menu/speed_menu';
import DataPanel from './components/data_panel/data_panel';
import PlotterPanel from './components/plotter_panel/plotter_panel';

// import { configureStore } from 'react-redux';
import ResultsPanel from './components/results_panel/results_panel';
import { createStore } from 'redux';

function addFilename(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

// Set application state
var app_data = require('./app_data.json');

const store = createStore((state = app_data, action) => {
  console.log(state);
  console.log(action);
  if (action.type == 'ADD_TODO') {
    console.log("f");
    // fileName = "hello-triiger";
  }
  if (action.type == ('fileupload')){
    let fileName = action.payload['file-data'].file.name;
    return {
      ...state,
      acousticFileData: {
        fileName: action.payload['file-data'].file.name,
        fileType: 'wav',
        location: 'unknown',
        sampleRate: 'unknown'
       }
    }
  }

  
  // state.acousticFileData.fileName = "hello-triiger";
  // updateStore(state, action);
  console.log(state);
  return state;
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
   
    <Provider store={store}>
      <SpecPanel />
      <PlotterPanel />
      <IDentSpeedMenu />
      <DataPanel />
      <ResultsPanel />
    </Provider>

  </React.StrictMode>
);



setTimeout(() => {
  store.dispatch(addFilename('fs'));
}, 5000)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
