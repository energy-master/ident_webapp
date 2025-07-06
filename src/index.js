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
import ConnectedPollData from './api/poller';

// import { configureStore } from 'react-redux';
import ResultsPanel from './components/results_panel/results_panel';
import { createStore } from 'redux';

function addFilename(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}





// Set application state and store
var app_data = require('./app_data.json');
const store = createStore((state = app_data, action) => {
  // console.log(state);
  // console.log(action);
 

  if (action.type == ('fileupload')) {
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

  
  if (action.type == ('RESULTS_SUMMARY_BUILD')) {
    return {
      ...state,
      results_summary: action.payload
    }
  }
    if (action.type == ('start_polling')) {
      return {
        ...state,
        polling_state: {
          "running" : true
        }
      }
    }
    if (action.type == ('stop_polling')) {
      return {
        ...state,
        polling_state: {
          "running" : false
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
      <ConnectedPollData />
      <SpecPanel />
      <PlotterPanel />
      <IDentSpeedMenu />
      <DataPanel />
      <ResultsPanel />
    </Provider>

  </React.StrictMode>
);



setTimeout(() => {
  store.dispatch({ type: 'start_polling'});
}, 3000)

setTimeout(() => {
  store.dispatch({ type: 'stop_polling' });
}, 6000)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
