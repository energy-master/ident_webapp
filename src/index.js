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
import Windows from './components/windows/windows';
import ConnectedBuildWorld from './components/build_world/build_world';

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
app_data.model_parameters[0].model_id = parseInt(Math.random() * 10000);
app_data.model_id = app_data.model_parameters[0].model_id;
// console.log(app_data.model_parameters[0].model_id)


const store = createStore((state = app_data, action) => {
  
  // console.log("Running Store");
  // console.log(state);
  //
  if (action.type == ('DECISION_GEOMETRY_UPDATE')) {
    
    return {
      ...state,
      ft_geometry: action.payload
    }
  }



  //STREAM_SELECTED


  if (action.type == ('STREAM_SELECTED')) {

    
    return {
      ...state,
      selected_stream: [action.payload]
    }

  }
  //"

  if (action.type == ('FILE_PATH_SELECTED')) {


    return {
      ...state,
      selected_filepath: [action.payload]
    }

  }
  if (action.type == ('FILE_SELECTED')) {

    let current_p = state.acousticFileData;
    current_p.fileName = action.payload['name'];
    current_p.timestamp = action.payload['timestamp'];

    return {
      ...state,
      acousticFileData: current_p
    }

  }

  if (action.type == ('MODEL_SELECTED')) {

   
    let selectedTag = action.payload;
    let current_models = state.selected_models;
    if (current_models.includes(selectedTag)) {
      // remove model
      const index = current_models.indexOf(selectedTag);
      if (index !== -1) {
        current_models.splice(index, 1);
      }
    }
    else {
      current_models.push(selectedTag);
    }

    console.log(current_models);

    return {
      ...state,
      selected_models: current_models
    }
  }

  //
  if (action.type == ('MODELS_LOADED')) {
    // let rows = action.payload;
    //console.log(action.payload);
    return {
      ...state,
      models: action.payload
    }
  }
  //
  if (action.type == ('STREAMS_LOADED')) {
    // let rows = action.payload;
    //console.log(action.payload);
    return {
      ...state,
      streams: action.payload
    }
  }

  if (action.type == ('STREAM_FILES_LOADED')) {
    // let rows = action.payload;
    //console.log(action.payload);
    return {
      ...state,
      stream_files: action.payload
      
    }
  }






  if (action.type == ('FILE_UPLOAD_COMPLETE')) {
    let fileName = action.payload['file-data'].file.name;
    let current_p = state.acousticFileData;
    
    current_p.fileName = fileName;
    current_p.status = "Upload";
    console.log(current_p);
    return {
      ...state,
      acousticFileData : current_p
        
      
    }
  }
 
  if (action.type == ('SHOW_SPEC')) {
   
    let current_p = state.acousticFileData;
    current_p.SHOW_SPEC_FLAG = 1;
    // current_p.GL_MESH_LOADED = false;
   
    console.log(current_p);
    return {
      ...state,
      acousticFileData: current_p


    }
  }

  if (action.type == ('MESH_LOADED')) {
    // console.log(action.payload)
    console.log("MESH loaded");
    let current_p = state.acousticFileData;
    current_p.GL_MESH_LOADED = true;
    current_p.SHOW_SPEC_FLAG = 0;
    let current_s = state.spectrogram;
    current_s.frequency_vector = action.payload['f_vector'];
    current_s.time_vector = action.payload['t_vector'];
    console.log(current_s);
    return {
      ...state,
      acousticFileData: current_p,
      spectrogram: current_s
    }
  }
  
  if (action.type == ('LOG_UPDATE')) {
    // console.log(action.payload)
    let messages = state.applicationLog;
    // messages.push(action.payload);
    
    //console.log(messages);
    return {
      ...state,
      applicationLog: messages,
      logMessage:action.payload
    }
  }
  
  if (action.type == ('FILE_UPLOAD_START')) {
    // console.log(action.payload)
    let current_p = state.acousticFileData;
    current_p.status = 'Uploading';
    current_p.fileName = 'Transferring'

    return {
      ...state,
      acousticFileData: current_p
    }
  }

  
  if (action.type == ('MODEL_PARMS_UPDATE')) {
    console.log(action.payload)
    let n_model_id = action.payload['model_id'];

    // let nt = action.payload['nfft'];

    // let gl = state.openGl;
    // gl.number_transitions = nt > 10000 ? 1000 : 10000;
    // console.log(gl.number_transitions);
    return {
      ...state,
      model_parameters: [action.payload],
      model_id: n_model_id
     
      
    }
  }
  
  if (action.type == ('ACTIVITY_PLOT_DATA_BUILD')) {
    // console.log(action.payload)
    return {
      ...state,
      plot_activity_data: action.payload
    }
  }

  if (action.type == ('MAX_ITER_UPDATE')) {
    console.log(action.payload)
    let current_p = state.model_parameters[0];
    current_p.max_iter = action.payload;

    return {
      ...state,
      model_parameters: [current_p]
    }
  }
  if (action.type == ('STATUS_UPDATE')) {
    // console.log(action.payload)
    let current_p = state.model_parameters[0];
    current_p.status = action.payload;
    console.log(action.payload);

    return {
      ...state,
      model_parameters: [current_p]
      
    }
  }

 
  if (action.type == ('RUN_UPDATE')) {
    console.log(action.payload)
    let current_p = state.model_parameters[0];

    current_p.active_bot_number = action.payload['active_bot'];
    current_p.sim_bot_number = action.payload['number_bots'];

    return {
      ...state,
      model_parameters: [current_p]
    }
  }

  if (action.type == ('RESULTS_SUMMARY_BUILD')) {
    return {
      ...state,
      results_summary: action.payload
    }
  }
    if (action.type == ('START_POLLING')) {
      return {
        ...state,
        polling_state: {
          "running" : true
        }
      }
    }


  if (action.type == ('REDRAW_SPEC')) {
    let current_p = state.acousticFileData;

    current_p.SHOW_SPEC_FLAG = 1;
    console.log(current_p);
    return {
      ...state,
      acousticFileData: current_p
    }
  }
    if (action.type == ('FILE_BTN_CLICK')){
      let current_p = state.acousticFileData;
      
      current_p.SHOW_SPEC_FLAG = 1;
      console.log(current_p);
      return {
        ...state,
        acousticFileData: current_p
      }
    }
    if (action.type == ('STOP_POLLING')) {
      return {
        ...state,
        polling_state: {
          "running" : false
        }
      }
    }

  if (action.type == ('RUN_STARTED')) {
    // console.log(action.payload)
    let current_p = state.model_parameters[0];
    current_p.run_title = 'Running';
    let running = 1;

    return {
      ...state,
      model_parameters: [current_p],
      sim_running : running
    }
  }
  if (action.type == ('RUN_FINISHED')) {
    // console.log(action.payload)
    let current_p = state.model_parameters[0];
    current_p.run_title = 'Run IDent';


    return {
      ...state,
      model_parameters: [current_p]
    }
  }
  

  
  // state.acousticFileData.fileName = "hello-triiger";
  // updateStore(state, action);
  // console.log(state);
  return state;
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
   
    <NavBar appName="IDent Live"  />
    
    <Provider store={store}>
      <ConnectedPollData />
      <SpecPanel />
      <Windows />

      {/* <PlotterPanel /> */}
      {/* <IDentSpeedMenu /> */}


      {/* <DataPanel /> */}
      {/* <ResultsPanel /> */}
      <ConnectedBuildWorld />
    </Provider>

  </React.StrictMode>
);



// setTimeout(() => {
//   store.dispatch({ type: 'START_POLLING'});
// }, 1000)

// setTimeout(() => {
//   store.dispatch({ type: 'STOP_POLLING' });
// }, 5000)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
