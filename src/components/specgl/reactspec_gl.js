


import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend } from '@react-three/fiber'
import { GridMoreVertIcon } from '@mui/x-data-grid'
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
import ConnectedLogger from './logging';

extend({ MeshLineGeometry, MeshLineMaterial })



const SpecGL = ({ }) => {

    const { autoRotate, mipmapBlur, luminanceThreshold, luminanceSmoothing, intensity } = useControls({
        autoRotate: !0,
        mipmapBlur: !0,
        luminanceThreshold: { value: 0.0, min: 0, max: 2, step: 0.01 },
        luminanceSmoothing: { value: 0.025, min: 0, max: 1, step: 0.001 },
        intensity: { value: 10.0, min: 0, max: 10, step: 0.01 }
    })

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
        
        <OrbitControls dampingFactor={0.05} />
        <EffectComposer>
            <Bloom
                mipmapBlur={mipmapBlur}
                luminanceThreshold={luminanceThreshold}
                luminanceSmoothing={luminanceSmoothing}
                intensity={intensity}
            />
        </EffectComposer>
            
            /* Scene */
        
        <ConnectedPlotLines />
        <ConnectedSpectrogramMesh />
            <ConnectedPlotActiveGeometry />
            <ConnectedLogger />
        <Text
                            // position={[20, 20, -10]}
                            scale={[40, 40, 10]}
                            color="red" // default
                            anchorX="center" // default
                            anchorY="middle" // default
                        >
                            M A R L I N  AI
        </Text>
            
        
            
        </Canvas>
      


    )
}

export default SpecGL;



function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={(event) => setActive(!active)}
            onPointerOver={(event) => setHover(true)}
            onPointerOut={(event) => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}
