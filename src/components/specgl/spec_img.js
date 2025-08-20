

import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Image } from '@react-three/drei';
import { connect } from 'react-redux';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';


function StreamImages(params)  {
    
    if (params.selected_stream.length < 1){
        return;
    }
    if (params.stream_data_loaded == false){
        return;
    }

    console.log("rendering images");

    let imgPath = 'https://marlin-network.hopto.org/marlin_live/streams/' + params.selected_stream[0];
    
    // Iterate over files and load images into a sequence and build the stream for rendering
    // console.log(params.openGl);
    let stream_render_data = [];
    // let start_gl_x = 0 - (parseFloat(params.openGl.x_width) / 2);
    let start_gl_x = 0;
    let y_base = (parseFloat(params.openGl.y_width)) + 20;
    // console.log(params.ordered_stream_files);
    let number_loaded = 0;
    for (let i = 0; i < params.ordered_stream_files[params.selected_stream[0]].length; i++){
        
        let instance = {
            'imgPath': imgPath + '/' + params.ordered_stream_files[params.selected_stream[0]][i].file_root + "_spec.jpg",
            'xPos': start_gl_x,
            'yPos': y_base,
            'zPos': 20,
            'width': params.openGl.x_width,
            'height': params.openGl.y_width
        };

        // console.log(instance);
        stream_render_data.push(instance);
        start_gl_x += (params.openGl.x_width);
        number_loaded += 1;
        // if (number_loaded > 5) {
        //     break;
        // }

    }
    // console.log(stream_render_data);
    return (


        <>
            {
                stream_render_data.map((item, key) => (
                    <ImageBox
                        
                        imgPath={item.imgPath}
                        xPos={item.xPos}
                        yPos={item.yPos}
                        zPos={item.zPos}
                        width={item.width}
                        height={item.height}
                        
                     />
                ))
            }
        </>





    );


}



const mapStateToProps = (state) => ({

    selected_stream: state.selected_stream,
    ordered_stream_files: state.ordered_stream_files,
    openGl:state.openGl,
    stream_data_loaded: state.stream_data_loaded

})


const ConnectedStreamImages = connect(mapStateToProps)(StreamImages);
export default ConnectedStreamImages;


function ImageBox({
    imgPath,
    xPos,
    yPos,
    zPos,
    width,
    height
}) {


    // const texture = useTexture(img1); // Load the JPG as a texture
    // const texture = useTexture(imgPath);
   
    // useFrame(() => {
    //     if (meshRef.current) {
    //         meshRef.current.rotation.x += 0.01;
    //         meshRef.current.rotation.y += 0.01;
    //     }
    // });
    const texture = useLoader(TextureLoader,imgPath);
    console.log(width,height);
    return (
        // <mesh ref={meshRef}>
        //     {/* <boxGeometry args={[20, 20, 20]} /> */}
        //     <meshStandardMaterial map={texture} /> Apply the texture to the material
        // </mesh>
        // <Image url={imgPath}>
           
        // </Image>
      
        <mesh position={[xPos,yPos,zPos]}>
                <planeGeometry args={[width, height]} /> 
                <meshBasicMaterial map={texture} />
        </mesh>
       
    );
}

