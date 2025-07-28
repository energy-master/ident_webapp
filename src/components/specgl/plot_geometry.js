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


const PlotActiveGeometry = (props) => {

    let dataSetArray = [];

    let dataPresent = false;

    const get_y_from_f = (frequency) => {
        // console.log(props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1]);
        let f_y_ratio = props.gl_data.y_width / props.spectrogram.frequency_vector[props.spectrogram.frequency_vector.length - 1] ;
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

    const get_delta_x_from_delta_t = (time_s) => {

        // iter delta x
        // console.log(props.model_parameters.max_iter);
        let delta_x = props.gl_data.x_width / props.model_parameters.max_iter;
        console.log(delta_x);
        // console.log(time_s, props.model_parameters.delta_t);
        let number_iters = (time_s / props.model_parameters.delta_t);
        // console.log(number_iters);
        number_iters = 1;
        let gl_delta_x = delta_x * number_iters;
        // console.log(gl_delta_x);

        return (gl_delta_x);

    }

    const buildGeometry = (geo, iter) => {

        let points = [];
        // console.log(geo);
        let geom_points = [];
        // console.log(iter);
        // points at iter:
        // iter x:
        let xgl_iter = get_x_from_iter(iter);
        let ygl_max = get_y_from_f(geo.f_max);
        let ygl_min = get_y_from_f(geo.f_min);
        


        // memory x
        let delta_xgl_memory = get_delta_x_from_delta_t(geo.max_memory/1000);
        // console.log(xgl_iter, ygl_max, ygl_min, delta_xgl_memory)

        // points
        points.push(xgl_iter, ygl_max, 10, xgl_iter, ygl_min, 10, xgl_iter - delta_xgl_memory, ygl_min, 10, xgl_iter - delta_xgl_memory, ygl_max, 10);
        // console.log(points);
        // console.log(geo.max_memory/1000);
        // console.log(geo.f_max,geo.f_min);
        // console.log(props.gl_data.x_width,props.model_parameters.max_iter);

        dataSetArray.push({
            'points': points,
            'label' : 'interesting'
        });

      


        
        
        


    }

    // console.log('plot geometry');
    // console.log(props.active_geometry);
    for (const [key, value] of Object.entries(props.active_geometry)) {
        // console.log(`${key}: ${value}`);
        for (const [iter, structure] of Object.entries(value)) {
            // console.log(`${iter}: ${structure.f_min}`);
            buildGeometry(structure, iter);
        }

    }

    if (dataSetArray.length > 0) {
        dataPresent = true;
    }
   
    // dataSetArray = dataSetArray[1];
   
    

    if (dataPresent) {
        return (


            <>
                {
                    dataSetArray.map((item, key) => (
                        <PlotGeo points={item.points} color= 'red' label={item.label} width={4.0} />
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

    active_geometry: state.ft_geometry,
    gl_data: state.openGl,
    spectrogram: state.spectrogram,
    model_parameters : state.model_parameters[0]

})

const ConnectedPlotActiveGeometry = connect(mapStateToProps)(PlotActiveGeometry);
export default ConnectedPlotActiveGeometry;

const PlotGeo = ({
    color,
    zdim,
    points,
    width,
    label
}) => {
    let s = 2;
    const ref = useRef()
    // useFrame((state) => {

    //     for (let i = 0; i < points.length; i++) {
    //         // ref.current.position.x = x + Math.sin((state.clock.getElapsedTime() * s) / 2)
    //         let idx = (i + 2) * i;
    //         // ref.current.position.y = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2);
    //         points[idx + 1] = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2)
    //         i = idx;
    //         // ref.current.position.z = z + Math.sin((state.clock.getElapsedTime() * s) / 2)
    //     }



    // })


    return (
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p > 0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={width} color={color} wireframe={true} />
        </mesh>
    )
}

