import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { GridMoreVertIcon, renderActionsCell } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'

import { Stats, OrbitControls, Line } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })


const PlotActiveGeometry = (props) => {

    let dataSetArray = [];

    let dataPresent = false;

        const get_y_from_f = (frequency) => {
        let f_y_ratio = props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1] / props.gl_data.y_width;
        let freq_vector = props.spectrogram.frequency_vector;
        let gl_y_range = props.gl_data.y_width;
        let y_zero = 0 - (props.gl_data.y_width / 2);
        let gly = y_zero + (frequency * f_y_ratio);
        console.log(gly, frequency);
        return gly;
    }

    const get_x_from_iter = (number_iter) => {
        let start_x = 0 - (props.gl_data.x_width / 2);
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        console.log(delta_x);
        let glx = start_x + (number_iter * delta_x);

    }

    const get_delta_x_from_delta_t = (time_s) => {

        // iter delta x
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        let number_iters = Math.floor(time_s.props.model_parameters.delta_t);
        let gl_delta_x = delta_x * number_iters;

        return (gl_delta_x);

    }

    const buildGeometry = (geo) => {



    }
    console.log('plot geometry');
    console.log(props.active_geometry);
    for (const [key, value] of Object.entries(props.active_geometry)) {
        // console.log(`${key}: ${value}`);
        for (const [iter, structure] of Object.entries(value)) {
            // console.log(`${iter}: ${structure.f_min}`);
            buildGeometry(structure);
        }

    }


    
    if (dataPresent) {
        return (


            // <>
            //     {
            //         dataSetArray.map((item, key) => (
            //             <PlotLine points={item.points} color={color} label={item.label} width={2.0} />
            //         ))
            //     }
            // </>

<></>



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

    active_geometry: state.ft_geometry,
    gl_data: state.openGl,
    spectrogram: state.spectrogram,
    model_parameters : state.model_parameters[0]

})

const ConnectedPlotActiveGeometry = connect(mapStateToProps)(PlotActiveGeometry);
export default ConnectedPlotActiveGeometry;

// const PlotLine = ({
//     color,
//     zdim,
//     points,
//     width,
//     label
// }) => {
//     let s = 2;
//     const ref = useRef()
//     useFrame((state) => {

//         for (let i = 0; i < points.length; i++) {
//             // ref.current.position.x = x + Math.sin((state.clock.getElapsedTime() * s) / 2)
//             let idx = (i + 2) * i;
//             // ref.current.position.y = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2);
//             points[idx + 1] = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2)
//             i = idx;
//             // ref.current.position.z = z + Math.sin((state.clock.getElapsedTime() * s) / 2)
//         }



//     })


//     return (
//         <mesh ref={ref}>
//             <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
//             <meshLineMaterial emissive lineWidth={width} color={color} />
//         </mesh>
//     )
// }

