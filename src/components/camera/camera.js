

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
// import './stream_data.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propsStateInitializer } from '@mui/x-data-grid/internals';
import { gsap } from "gsap";
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Stats, OrbitControls, Line, Text, useProgress, Loader, Html } from '@react-three/drei';

const CameraAction = (params) => {
    const { camera } = useThree();
    const { controls } = useThree();
    // const { get } = useThree();
    // const control = get().controls

    console.log(params);

    // if (params.app_init['camera'] == true) {

    //     //controls.enabled = false;
    //     gsap.to(camera.position, { x: x_offset - 200, y: 400, z: 1200, duration: 1 });
    //     gsap.to(camera.lookAt, { x: x_offset - 200, y: 400, z: 0, duration: 0.5 });
    //     // controls.enabled = true;
    //     // controls.update();

    // }



    if (params.currentFileName == "No Active File") {
        return;
    }

    // get fileName
    let fileName = params.currentFileName;
    console.log(fileName);
    console.log(params.ordered_file_list);
    // get file index in order
    let ordered_list = params.ordered_file_list[params.stream_tag];
    let file_index = 0;
    console.log(params.stream_tag);
    console.log(params.currentFileName);
    console.log(ordered_list);
    if (params.ordered_file_list.hasOwnProperty(params.stream_tag)) {
        
    
        for (let i = 0; i < ordered_list.length; i++) {
            console.log(ordered_list[i].filename)
            if ((ordered_list[i].filename == params.currentFileName) || (ordered_list[i].filename.split('.')[0] == params.currentFileName)) {
                break;
            }
            file_index += 1;
        }
    }
    // caluclate x,y,z and move camera
    let x_offset = file_index * params.openGl.x_width;
    console.log(x_offset);
    console.log(controls);

    const targetPoint = new Vector3(x_offset+200, 400, 0); // Example target
    
    controls.enabled = false;
    gsap.to(camera.position, { x: x_offset + 200, y: 400, z: 1200, duration: 1 });
    gsap.to(camera.lookAt, { x: x_offset + 200, y: 400, z: 0, duration: 0.5 });
    controls.enabled = true;
    controls.update();

   

    return (
        <>
            <OrbitControls target={targetPoint} position={[x_offset + 200, 400, 1200]} dampingFactor={0.05} />
        </>
    )

}


const mapStateToProps = (state) => ({

    currentFileName: state.acousticFileData.fileName,
    ordered_file_list: state.ordered_stream_files,
    stream_tag : state.selected_stream,
    openGl: state.openGl,
    app_init : state.app_init

})


const ConnectedCameraAction = connect(mapStateToProps)(CameraAction);
export default ConnectedCameraAction;

