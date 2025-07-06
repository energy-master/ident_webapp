


import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

// import SpectrogramPlayer from 'react-audio-spectrogram-player';
   

const SpecShow = (parms) => {
    console.log(parms.pathToFile + parms.fileName);
    return (
        <h4>[Spectrogram plugin]</h4>
        // <SpectrogramPlayer src={parms.pathToFile + parms.fileName} />
    )
       
  }



export default SpecShow;