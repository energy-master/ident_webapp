
import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { DEFAULT_GRID_AUTOSIZE_OPTIONS, GridMoreVertIcon } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'
// import './styles.css'
import { Stats, OrbitControls, Line, Text } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, propsStateInitializer, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import ConnectedSpectrogramMesh from './spec_mesh';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ConnectedPlotLines from './plot_lines';
import ConnectedPlotActiveGeometry from './plot_geometry';
extend({ MeshLineGeometry, MeshLineMaterial })


const PlotLabels = ({
    frequencyVector,
    timeVector,
    gl_y,
    gl_x,
    max_iter,
    offset
    
}) => {

    // console.log(frequencyVector);
    // console.log(timeVector);
    // console.log(gl_y);
    let f_max = frequencyVector[frequencyVector.length - 1];
    let total_time_s = Math.floor(timeVector[timeVector.length - 1]);
    let total_time_str = total_time_s.toString() + '.0';
    console.log(total_time_s);
    let f_min = 0;
    
    let f_max_x = (0 - gl_x / 2) - 20;
    let f_max_y = (0 + gl_y / 2);
    let f_max_z = 20;
    f_max_x = f_max_x + offset;
    let f_min_x = (0 - gl_x / 2) - 20;
    let f_min_y = (0 - gl_y / 2);
    let f_min_z = 20;
    f_min_x = f_min_x + offset;
   
    let mid_time_s = Math.floor(total_time_s / 2);

   
    let mid_x = 0;
    let end_x = 0 + Math.floor((gl_x / 2));
    let start_x = 0 - Math.floor((gl_x / 2));
    end_x = end_x + offset;
    start_x = start_x + offset;
    let hud_x = gl_x + 30;
    let hud_y = gl_y / 2;
    let hud_z = -50;


    return (
        <>
            <Text
                position={[f_max_x, f_max_y, f_max_z]}
                scale={[10, 10,10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {f_max}
            </Text>
            <Text
                position={[f_min_x, f_min_y, f_min_z]}
                scale={[10, 10, 10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {f_min}
            </Text>
            <Text
                position={[f_min_x, 0.0, f_min_z]}
                scale={[10, 10, 10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                f(Hz)
            </Text>

            <Text
                position={[start_x, f_min_y-10, f_min_z]}
                scale={[10, 10, 10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                0.0
            </Text>

            <Text
                position={[end_x, f_min_y - 10, f_min_z]}
                scale={[10, 10, 10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                {total_time_str}
            </Text>

            <Text
                position={[start_x+20, f_min_y - 10, f_min_z]}
                scale={[10, 10, 10]}
                color="green" // default
                anchorX="center" // default
                anchorY="middle" // default 
            >
                time (s)
            </Text>
            
         
        </>
    );
}

const mapStateToProps = (state) => ({

    spectrogram: state.spectrogram,
    gl_data: state.openGl,
    model_parameters: state.model_parameters
    

})

const ConnectedPlotLabels = connect(mapStateToProps)(PlotLabels);
export default ConnectedPlotLabels;

