import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { GridMoreVertIcon, renderActionsCell } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'

import { Stats, OrbitControls, Line, Points } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })


const DrawStreamDetection = (props) => {

    const dispatch = useDispatch();

    

    // if (props.acousticFileData.fileName == "No Active File") {
    //     return;
    // }

    if (props.selected_stream.length < 1){
        return;
    }

    // if (props.spectrogram.data_present == false) {
    //     return;
    // }

    dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Annotating any detections. ' })


    let dataSetArray = [];
    let dataPresent = false;

    const get_y_from_f = (frequency) => {
        // console.log(props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1]);
        let f_y_ratio = props.gl_data.y_width / props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1];
        let freq_vector = props.spectrogram.frequency_vector;
        let gl_y_range = props.gl_data.y_width;
        let y_zero = 0 - (props.gl_data.y_width / 2);
        // console.log(f_y_ratio);
        let gly = y_zero + (frequency * f_y_ratio);
        // console.log(gly, frequency);
        return gly;
    }

    const get_x_from_iter = (number_iter) => {
        // console.log(props.model_parameters);
        let start_x = 0 - (props.gl_data.x_width / 2);
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        // console.log(delta_x);
        let glx = start_x + (number_iter * delta_x);
        return glx;
    }

    const get_delta_x_from_t = (time_s,filename) => {

        // // iter delta x
        // // console.log(props.model_parameters.max_iter);
        // let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        // console.log(delta_x);
        // // console.log(time_s, props.model_parameters.delta_t);
        // let number_iters = (time_s / props.model_parameters.delta_t);
        // // console.log(number_iters);
        // number_iters = 1;
        // let gl_delta_x = delta_x * number_iters;
        // // console.log(gl_delta_x);

        let gl_delta_x = 0;
        gl_delta_x = ((time_s / props.file_data[props.selected_stream][filename].elapsed_time)) * props.gl_data.x_width;
        console.log(time_s, props.file_data[props.selected_stream][filename].elapsed_time,gl_delta_x)
        return (gl_delta_x);

    }

    const buildGeometry = (detection) => {
        console.log(detection);
        let points = [];
        
        let geom_points = [];
      

        //ger x start & x_offstet
        let x_0 = 0 - (props.gl_data.x_width/2); // start of first spec
        let x_offset = 0
        let fidx = 0;
        console.log(props.ordered_stream_files[props.selected_stream]);
        for (let i = 0; i < props.ordered_stream_files[props.selected_stream].length; i++){
            let det_fn = detection['body']['filename'];
            let o_fn = props.ordered_stream_files[props.selected_stream][i]['filename'];
            console.log(det_fn,o_fn)
            if (props.ordered_stream_files[props.selected_stream][i]['filename'] == detection['body']['filename']) {
                console.log(detection['body']['filename']);
                break;
            }
            fidx += 1;
        }
        console.log(fidx);
        x_offset = fidx * props.gl_data.x_width;
        let start_time = detection['body']['chunk_start'];
       
        let end_time = detection['body']['chunk_end'];

        let xgl_start = x_0 + x_offset + get_delta_x_from_t(start_time, detection['body']['filename']);
        console.log(x_0, x_offset, xgl_start, start_time);
        let xgl_end = x_0 + x_offset + get_delta_x_from_t(end_time, detection['body']['filename']);
        let ygl_max = 300;
        let ygl_min = 60;

       
        // points
        points.push(xgl_start, ygl_min, 40, xgl_start, ygl_max, 40, xgl_end, ygl_max, 40, xgl_end, ygl_min, 40, xgl_start, ygl_min, 40);
       
        dataSetArray.push({
            'points': points,
            'label': 'interesting'
        });

    }

    // *** Grab detections ***
    // let active_file_root = props.acousticFileData.fileName.split('.')[0];
    let active_detections = [];
    console.log(props.detections);

    if (props.detections.hasOwnProperty(props.selected_stream[0])) {
        for (let i = 0; i < props.detections[props.selected_stream[0]].length; i++) {
            let detection_file_root = props.detections[props.selected_stream[0]][i].file_root;
            if (props.selected_view_models["interesting"].includes(props.detections[props.selected_stream[0]][i].model)) {
                active_detections.push(props.detections[props.selected_stream[0]][i].detections);
            }

        }
    }

   

    console.log(active_detections);
    // *** Build Geometry ***
    for (let i = 0; i < active_detections.length; i++){
        for (let j = 0; j < active_detections[i].length; j++){

            buildGeometry(active_detections[i][j]);

        }
        

    }
    

    if (dataSetArray.length > 0) {
        dataPresent = true;
    }



    if (dataPresent) {
        return (


            <>
                {
                    dataSetArray.map((item, key) => (
                        <PlotGeo points={item.points} color='white' label={item.label} width={2.0} />
                    ))
                }
            </>





        );
    }
    else {

        return (
            // <>
            //     <PlotLine points={points} color='green' label='waiting' width={2.0} />
            // </>
            <></>
        );

    }

}




const mapStateToProps = (state) => ({

    
    gl_data: state.openGl,
    selected_view_models: state.selected_view_models,
    detections: state.detections,
    selected_stream: state.selected_stream,
    ordered_stream_files: state.ordered_stream_files,
    file_data: state.file_data
    
    
})

const ConnectedDrawStreamDetection = connect(mapStateToProps)(DrawStreamDetection);
export default ConnectedDrawStreamDetection;

// function Rectangle(props) {
//     return (
//         <mesh {...props}>
//             <boxGeometry args={[props.width, props.height, props.depth || 0.01]} /> {/* width, height, and a small depth for 2D appearance */}
//             <meshStandardMaterial color={props.color || 'hotpink'} />
//         </mesh>
//     );
// }


const PlotGeo = ({
    color,
    zdim,
    points,
    width,
    label
}) => {
    let s = 2;
    const ref = useRef()
 

    return (
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={width} color={color} wireframe={false} />
        </mesh>
    )
}

