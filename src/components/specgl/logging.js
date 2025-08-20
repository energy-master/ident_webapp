
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


const Logger = (props) => {

    console.log("LOGGER");
    let messages = props.application_log;
   

    let message_x_start = Math.floor(0 - (props.gl_data['x_width'] / 2));
    let message_y_start = (props.gl_data['y_width']/2) + 30;
    let message_z = -10;

    let message = messages[messages.length - 1];
    
    
    let message_x_start_init = -600;
    let message_y_start_init = -30;
    // console.log(message);
    //console.log(messages);

    message = props.msg;
    return (
        <>
                   {/* <GLMessage 
                        message={message}
                        xpos={message_x_start}
                        ypos={message_y_start}
                        zpos={message_z}
            /> */}
            <GLMessage
                message={message}
                xpos={message_x_start_init}
                ypos={message_y_start_init}
                zpos={message_z}
            />
           
        </>
    );
}




const mapStateToProps = (state) => ({

    application_log: state.applicationLog,
    gl_data: state.openGl,
    msg: state.logMessage
    

})

const ConnectedLogger = connect(mapStateToProps)(Logger);
export default ConnectedLogger;


const GLMessage = ({message, xpos, ypos, zpos}) => {
    
    
    return (
         <Text
                position={[xpos, ypos, zpos]}
                scale={[7, 7,7]}
                color="green" // default
                anchorX="left" // default
                anchorY="middle" // default 
            
            >
                {message}
            </Text>
    )
}