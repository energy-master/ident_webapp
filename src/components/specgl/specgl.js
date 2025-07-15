
// import * as React from 'react';
// import { connect } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';


// import * as THREE from 'three';
// import { jsx } from 'react/jsx-runtime';


// const SpecGL = (props) => {

//     console.log("Building WEBGL");
//     let filepath =  props.pathToFile  + props.fileName;
    
//     let frequency_samples = 512;    // Y Axis
//     let time_samples = 1200;        // X Axis
//     let DATA = new Uint8Array(frequency_samples);
//     let camera, scene, renderer;
//     let heights, mesh;

//     let n_vertices = (frequency_samples + 1) * (time_samples + 1);
//     let xsegments = time_samples;
//     let ysegments = frequency_samples;

//     /* OpenGL stuff */
//     let xsize = 35;
//     let ysize = 20;
//     let xhalfSize = xsize / 2;
//     let yhalfSize = ysize / 2;
//     let xsegmentSize = xsize / xsegments;
//     let ysegmentSize = ysize / ysegments;
    
//     let height = 0; 
//     let width = 0;
//     console.log(props);
//     if (props.showSpec == 1){

//     console.log('init spec Openg GL');

//     // const init = () => {
        
//         height = document.getElementById('spec-panel').offsetHeight;
//         width = document.getElementById('spec-panel').offsetWidth;
//         console.log(width, height);
//         let camera = new THREE.PerspectiveCamera(25, width / height, 1, 1000);
//         camera.position.z = 100;
//         let scene = new THREE.Scene();
//         let geometry = new THREE.BufferGeometry();
//         let indices = [];
//         let heights = [];
//         let vertices = [];

//         for (let i = 0; i <= xsegments; i ++ ) {
//             let x = ( i * xsegmentSize ) - xhalfSize; //midpoint of mesh is 0,0
//             for ( let j = 0; j <= ysegments; j ++ ) {
//               let y = (j * ysegmentSize) - yhalfSize;
//               vertices.push( x, y, 0);
//               heights.push(Math.random()*255); // for now our mesh is flat, so heights are zero
//             }
//           }
//           // Add the position data to the geometry buffer
//           geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        
//           // generate indices (data for element buffer). This says where each triangle goes
//           // the code might look complex, but it is essentially the way you tile the plane with 
//           // triangles. Each square segment has 4 vertices, a, b, c, d. Which make 2 triangles.
//           // a  b
//           // d  c
//           // Looking above, we can make a triangle by connecting a b d
//           // a-b
//           // d
//           // and similarly for b c d. These make the two faces of our mesh segment.
        
//           for (let i = 0; i < xsegments; i ++ ) {
//             for ( let j = 0; j < ysegments; j ++ ) {
//               let a = i * ( ysegments + 1 ) + ( j + 1 );
//               let b = i * ( ysegments + 1 ) + j;
//               let c = ( i + 1 ) * ( ysegments + 1 ) + j;
//               let d = ( i + 1 ) * ( ysegments + 1 ) + ( j + 1 );
//               // generate two faces (triangles) per iteration
//               indices.push( a, b, d ); // face one
//               indices.push( b, c, d ); // face two
//             }
//           }
//           geometry.setIndex( indices );
//           // This bit of code defines a lookup table (LUT) for our colors. 
//           // Right now we are only providing one color in this "string" value below (Red).
//           // This will be useful later on when we want a variety of colors to work with
//           // We will just add colors to this string and send them to the shader
//           let string = [[0.5,0.0,0.0]];
//           var lut = [];
//           for (let n=0;n<1;n++) {
//               lut.push(new THREE.Vector3((string[n][0]*255-49)/206., (string[n][1]*255-19)/236., (string[n][2]*255-50)/190.));
//           } 
//           //Grab the shaders from the document
//           var vShader = document.getElementById('vertexshader');
//           var fShader = document.getElementById('fragmentshader');
//           // Define the uniforms. V3V gives us a 3vector for RGB
//           var uniforms = {
//               vLut: {type: "v3v", value: lut}
//           }
//           // Bind the shaders and uniforms to the material
//           let material = new THREE.ShaderMaterial( {
//               uniforms: uniforms,
//               vertexShader:   vShader.text,
//               fragmentShader: fShader.text
//           } );
        
//           // Initialize the renderer and connect it to the DIV
//           renderer = new THREE.WebGLRenderer( { antialias: true } );
//           renderer.setPixelRatio( window.devicePixelRatio );
//           renderer.setSize( window.innerWidth, window.innerHeight );
//           let container = document.getElementById( 'Spectrogram' );
//           container.appendChild( renderer.domElement );
        
//           // Give the mesh a material with color (Purple)
//           mesh = new THREE.Mesh( geometry, material );
//           scene.add( mesh );
//           geometry.setAttribute('displacement', new THREE.Uint8BufferAttribute(heights,1));
//           mesh.geometry.computeFaceNormals();
//           mesh.geometry.computeVertexNormals();
//           // Render the scene!
//           renderer.render(scene, camera);
//         }
    
//     if (props.showSpec == 0) {
//         return (
       
//             <h4>[Spectrogram OpenGL plugin]</h4>
//         )
//     }
//     else {
//         return <div></div>
//     }

// }



// const mapStateToProps = (state) => ({

    
//     showSpec: state.acousticFileData.SHOW_SPEC_FLAG

// })

// const ConnectedSpecGL = connect(mapStateToProps)(SpecGL);

// export default ConnectedSpecGL;