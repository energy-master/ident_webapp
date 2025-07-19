import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
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


const PlotLines = (props) => {
 
    let points = [];
    let color = 'blue';
    let xAxis = props.activityPlotData['labels'];
    let dataSetArray = Array.from((props.activityPlotData['datasets']));
    let dataPresent = true;
    if (xAxis.length < 5) {
        dataPresent = false;
        let start_x = 0 - (props.gl_data.x_width / 2);
        let y_zero = 0 - (props.gl_data.y_width / 2);
        let delta_x = props.gl_data.x_width / 500;

        for (let ij = 0; ij < 500; ij++) {
            let start_idx = (ij + 2) * ij;
            points[start_idx] = start_x + (ij * delta_x);
            points[start_idx + 1] = y_zero;
            points[start_idx + 2] = 15;
        }
    }
   

if (dataPresent) {
    return (
            
            
        <>
            {
                dataSetArray.map((item, key) => (
                    <PlotLine points={item.points} color={color} label={item.label} width={2.0} />
                ))
            }
                </>
            
            
           
    
     
        );
}
else {
   
    return (
        <>
            <PlotLine points={points} color='green' label='waiting' width={2.0} />
        </>
    );

    }
   
}


const mapStateToProps = (state) => ({

    activityPlotData: state.plot_activity_data,
    gl_data : state.openGl

})

const ConnectedPlotLines = connect(mapStateToProps)(PlotLines);
export default ConnectedPlotLines;

const PlotLine = ({
    color,
    zdim,
    points,
    width,
    label
}) => {
    let s = 2;
    const ref = useRef()
    useFrame((state) => {
     
        for (let i = 0; i < points.length; i++){
            // ref.current.position.x = x + Math.sin((state.clock.getElapsedTime() * s) / 2)
            let idx = (i + 2) * i;
            // ref.current.position.y = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2);
            points[idx + 1] = points[idx + 1] + Math.sin((state.clock.getElapsedTime() * s) / 2)
            i = idx;
           // ref.current.position.z = z + Math.sin((state.clock.getElapsedTime() * s) / 2)
        }
        
        

    })
    

    return (
        <mesh ref={ref}>
            <meshLineGeometry points={points} widthCallback={(p) => p>0.8 ? 1.5 : 0.4} />
            <meshLineMaterial emissive lineWidth={width} color={color} />
        </mesh>
    )
}

