

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


const CameraAction = (params) => {
    const { camera } = useThree();
    console.log(params);
    if (params.currentFileName == "No Active File") {
        return;
    }

    // get fileName
    let fileName = params.currentFileName;

    // get file index in order
    let ordered_list = params.ordered_file_list[params.stream_tag];
    let file_index = 0;
    for (let i = 0; i < ordered_list.length; i++){
        if (ordered_list[i].filename == params.currentFileName) {
            break;
        }
        file_index += 1;
    }

    // caluclate x,y,z and move camera
    let x_offset = file_index * params.openGl.x_width;
    console.log(x_offset);

    // const targetPosition = useRef(new THREE.Vector3());
    // targetPosition.current.set(5, 5, 5); 
    // useFrame(() => {
    //     // Animate camera towards the target position
    //     camera.position.lerp(targetPosition.current, 0.05);
    //     camera.lookAt(0, 0, 0); // Optional: keep looking at the origin
    // });
    const targetPoint = new Vector3(x_offset, 0, 0); // Example target
    console.log(camera.position);
    
    console.log(targetPoint);
    console.log(camera.lookAt);
    camera.lookAt(targetPoint);
    gsap.to(camera.position, { x: x_offset, y:0, z:800, duration: 1 });
    // gsap.to(camera.lookAt, { targetPoint, duration: 1 });
    //gsap.to(camera.rotation, { x: Math.PI / 4, duration: 1 });


}


const mapStateToProps = (state) => ({

    currentFileName: state.acousticFileData.fileName,
    ordered_file_list: state.ordered_stream_files,
    stream_tag : state.selected_stream,
    openGl: state.openGl

})


const ConnectedCameraAction = connect(mapStateToProps)(CameraAction);
export default ConnectedCameraAction;

