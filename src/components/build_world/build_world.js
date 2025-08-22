
/*
*   Build world when a file input has been selected. This can be a saved file or a file from a streamed source.
*   This will also involve loading all associated data with the audio file, e.g. model outputs.
*   Models acan also be run against this dataset.
*/


import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const BuildWorld = (params) => {

    const dispatch = useDispatch();

    console.log("Building World")
    if (params.activeFileName == "No Active File"){
        return;
    }
    console.log(params.activePath);
    console.log(params.activeFileName);

    let active_file_path = params.activePath + '/' + params.activeFileName;
    console.log(active_file_path);

    //RUN FFT & TRIGGER SPECTROGRAM
    const formData = new FormData();
    let sampling = 5;
    let id = params.model_id;
    formData.append('run_id', id);
    formData.append('fileName', active_file_path);
    formData.append('sampling', sampling);
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
    };


    dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Acoustic data analysis begins.' })
    let fft_url = 'https://marlin-network.hopto.org/cgi-bin/live_fft.php';

    axios.post(fft_url, formData, config).then((response_) => {
        console.log('fft should be built!');
        console.log(response_.data);

        //show spectrogram
        //dispatch({ type: 'SHOW_SPEC', payload: 1 });
        //dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Spectrogram rendering has started. This may take some time.' });

        //dipatch show spec
        console.log(params);
        return (1);


    });


    return(
        <>
            
        </>
    );

}




const ConnectedBuildWorld = connect((state) => {
    // console.log('building ');
    return {
        activePath: state.selected_filepath,
        activeFileName: state.acousticFileData.fileName,
        model_id: state.model_parameters[0].model_id,
        detections: state.detections
     };
})(BuildWorld);



export default ConnectedBuildWorld;

