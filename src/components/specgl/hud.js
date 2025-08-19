






import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'
// import './styles.css'
import { Stats, OrbitControls, Line, Text, useProgress, Loader, Html } from '@react-three/drei';
// import {  } from '@react-three/drei/web';
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
import ConnectedLogger from './logging';

extend({ MeshLineGeometry, MeshLineMaterial })


const GLHud = (params) => {


    let x_start = (params.gl_data.x_width / 2) + 40;
    x_start = 0
    let y_start = (params.gl_data.y_width / 2) + 30;
    y_start = -5 - (params.gl_data.y_width / 2);
    
    let z_start = -30;

    let active_bot_number = params.model_parameters[0]['active_bot_number'];
    let total_bot_number = params.model_parameters[0]['sim_bot_number'];

    let delta_t = params.model_parameters[0]['delta_t'];
    let nfft = params.model_parameters[0]['nfft'];
    let activation_level = params.model_parameters[0]['activation_level'];
    let model_id = params.model_parameters[0]['model_id'];
    let poll_state = params.polling_state['running'];
    console.log(params.polling_state);
    console.log(poll_state);
    let poll_state_str = poll_state ? "Polling" : "Not polling";
    return (
        <>
            <Text
                position={[x_start, y_start, z_start]}
                scale={[15, 15, 15]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                HUD
            </Text>

            <Text
                position={[x_start, y_start-30, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                {active_bot_number} of {total_bot_number} bots run
            </Text>
            <Text
                position={[x_start, y_start - 45, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                Delta T (s) : {delta_t}
            </Text>
            <Text
                position={[x_start, y_start - 60, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                NFFT : {nfft}
            </Text>
            <Text
                position={[x_start, y_start - 75, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                Activation : {activation_level}
            </Text>
        
            <Text
                position={[x_start, y_start - 90, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                Model ID : {model_id}
            </Text>
            <Text
                position={[x_start, y_start - 105, z_start]}
                scale={[10, 10, 10]}
                color="white" // default
                anchorX="left" // default
                anchorY="middle" // default 
            >
                Polling data : {poll_state_str}
            </Text>
        </>


    )
}


const mapStateToProps = (state) => ({

    // spectrogram: state.spectrogram,
    gl_data: state.openGl,
    model_parameters: state.model_parameters,
    polling_state: state.polling_state


})

const ConnectedGLHud = connect(mapStateToProps)(GLHud);
export default ConnectedGLHud;