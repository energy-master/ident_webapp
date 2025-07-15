


import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { GridMoreVertIcon } from '@mui/x-data-grid'
import * as THREE from 'three';
import { DoubleSide } from 'three'
// import './styles.css'
import { Stats, OrbitControls, Line } from '@react-three/drei';
import { useControls } from 'leva';
import { columnResizeStateInitializer, escapeRegExp, useGridParamsApi } from '@mui/x-data-grid/internals';
import { getListItemSecondaryActionClassesUtilityClass } from '@mui/material/ListItemSecondaryAction';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FirstPersonControls } from '@react-three/drei';
import ConnectedSpectrogramMesh from './spec_mesh';
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })



const SpecGL = ({ }) => {

    return (
        
        <Canvas
            dpr={Math.min(window.devicePixelRatio, 2)}
            camera={{
                fov: 40,
                position: [0, 0, 250],
                near: 0.1,
                far: 2000
            }}

        >
        <color attach="background" args={['black']}/>
        {/* <FirstPersonControls movementSpeed={3}/> */}
        {/* <Lights /> */}
        <OrbitControls dampingFactor={0.05} />
        <ConnectedSpectrogramMesh />
            <TestLine></TestLine>
        
        </Canvas>
      


    )
}

export default SpecGL;

const TestLine = () => {
    return (
        <mesh>
            <meshLineGeometry points={
                [-250, -50, 30,
                -50, -50, 30,
                -50, -9, 30,
                -50, -50, 30,
                250, -50, 30]} />
            
            <meshLineMaterial lineWidth={2} color="green" /> 
        </mesh>
    )
}