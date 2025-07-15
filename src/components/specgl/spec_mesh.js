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
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline'
extend({ MeshLineGeometry, MeshLineMaterial })





class SpectrogramMesh extends React.Component{
    
    constructor(props) {

        super(props);
        this.initialised = false;
        console.log(this.initialised);

        

        // *** Paramters ***
        this.props = props;
        this.s_data = [];
        this.y_dim = 0;
        this.x_dim = 0;
        this.min_val = 100;
        this.max_max = 0;
        this.range_min = 0;
        this.range_max = 255;
        this.frequency_samples = 0;
        this.time_samples = 0;

        // *** Vectors ***
        // height vector
        this.heights_vec = new THREE.Uint8BufferAttribute(new THREE.Uint8BufferAttribute([]), 1)
        // indices vector
        this.indices32 = new Uint32Array([]);
        // vertices vector
        this.vertices = new Float32Array([]);
        // normal vector
        this.normals = new Float32Array([]);

        // *** Attributes ***
        // geometry attributes
        this.positionsAttribute = new THREE.BufferAttribute(new Float32Array([]), 3);
        // normal attribute
        this.normalAttribute = new THREE.BufferAttribute(this.normals, 3);


        // *** Shaders ***
        this.uniforms = {};

        this.init();
    }


    scaleData = (value) => {

        let range = this.max_val - this.min_val;
        let scale = (value - this.min_val) / range;
        let new_value = ((scale) * (this.range_max - this.range_min)) + this.range_min;
        return new_value;

    }

    init() {
     
        // load data
        const getData = () => {
                fetch('/marlin_live_data/101_f.json'
                    , {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    }
                )
                    .then(function (response) {
                        // console.log(response)
                        return response.json();
                    })
                    .then(function (myJson) {
                        // console.log(myJson);
                        buildSpecData(myJson);
                    });
        }
        
        // build data for spectrogram
        const buildSpecData = (specJsonData) => {
            
            console.log('building data');

            for (const [key, value] of Object.entries(specJsonData)) {
               
                for (let i = 0; i < value.length; i++) {
                    this.max_val = Math.max(this.max_val, value[i]);
                    this.min_val = Math.min(this.min_val, value[i]);
                }
                this.s_data.push(value);
                this.y_dim += 1;
                this.x_dim = value.length;
            }

         
            this.frequency_samples = this.y_dim;
            this.time_samples = this.x_dim;

            let xsegments = this.time_samples;
            let ysegments = this.frequency_samples;

            /* OpenGL stuff */
            let xsize = 600;
            let ysize = 100;
            let xhalfSize = xsize / 2;
            let yhalfSize = ysize / 2;
            let xsegmentSize = xsize / xsegments;
            let ysegmentSize = ysize / ysegments;

            let _v_index = 0;
            console.log(xsegments, ysegments);
            let heights = [];
            let v = [];
            let c = [];
            let n = [];
            for (let i = 0; i <= xsegments; i++) {

                let x = (i * xsegmentSize) - xhalfSize; //midpoint of mesh is 0,0
                // console.log(i,x);
                for (let j = 0; j <= ysegments; j++) {
                    let y = (j * ysegmentSize) - yhalfSize;
                    let height = 0;
                    // if (i < (xsegments / 2)) {
                    //     height = Math.random() * 190;
                    // }
                    // else {
                    //     height = Math.random() * 255;
                    // }
                    //console.log(j,y)
                    // console.log(j, i);
                    try {
                        height = this.scaleData(this.s_data[j][i]);

                    }
                    catch {
                        height = this.scaleData(this.min_val);

                    }
                    // console.log(s_data[i][j]);
                    //height = 255;
                    // height = 0;
                    heights.push(height); // for now our mesh is flat, so heights are zero
                    // console.log(height);
                    v.push(x, y, 0);
                    c.push(1.0, 1.0, 1.0);
                    n.push(0, 0, 1);

                }
            }
            let indices = [];

            for (let i = 0; i < xsegments; i++) {
                for (let j = 0; j < ysegments; j++) {
                    let a = i * (ysegments + 1) + (j + 1);
                    let b = i * (ysegments + 1) + j;
                    let c = (i + 1) * (ysegments + 1) + j;
                    let d = (i + 1) * (ysegments + 1) + (j + 1);
                    // generate two faces (triangles) per iteration
                    indices.push(a, b, d); // face one
                    indices.push(b, c, d); // face two
                }
            }

         

            this.indices32 = new Uint32Array(indices);


            this.vertices = new Float32Array(v);
           

            this.normals = new Float32Array(n);
           
           
            this.positionsAttribute = new THREE.BufferAttribute(this.vertices, 3);
            this.indexAttribute = new THREE.Uint32BufferAttribute(this.indices32, 1);
            this.normalAttribute = new THREE.BufferAttribute(this.normals, 3);

         
            this.heights_vec = new THREE.Uint8BufferAttribute(heights, 1)
            this.initialised = true;
            
            this.props.MESH_LOADED();
           
        }

        // build GL Shaders

        getData();

        

    }

    render() {
      
        if (this.initialised) {
            return (
                <mesh>
                    <shaderMaterial
                        fragmentShader={fragmentShader}
                        vertexShader={vertexShader}
                        uniforms={uniforms}
                        args={[{ side: DoubleSide }]}
                        wireframe={false}
                    />
    
                    <bufferGeometry attach="geometry" attributes={{ 'position': positionsAttribute, 'displacement': heights_vec, 'normal': normalAttribute }}>
                        <bufferAttribute attach="index" array={indices32} count={indices32.length} itemSize={1} />
                     </bufferGeometry >

                </mesh>        
            )
        }
        else {
            return (
                <h4>Spectrogram</h4>
            )
        }
       

    }


}



const mapStateToProps = (state) => ({


    showSpec: state.acousticFileData.SHOW_SPEC_FLAG,
    meshLoaded: state.acousticFileData.GL_MESH_LOADED,
    activity_plot_data: state.plot_activity_data

})

const mapDispatchToProps = (dispatch) => {
    
    return {
        MESH_LOADED : () => dispatch(meshUpdateFunction())
    }

}


const ConnectedSpectrogramMesh = connect(mapStateToProps, mapDispatchToProps)(SpectrogramMesh);
export default ConnectedSpectrogramMesh;


const meshUpdateFunction = () => {
    return {
        'type' : "MESH_LOADED",
        'payload' : 'mesh_loaded'
    }
}



