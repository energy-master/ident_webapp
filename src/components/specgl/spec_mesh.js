import { createRoot } from 'react-dom/client'
import React, { useMemo, useRef, useState, Suspense } from 'react'
import { Canvas, useFrame,extend, advance } from '@react-three/fiber'
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
import { MeshLineGeometry, MeshLineMaterial, raycast } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial })


var GColor = function (r, g, b) {
    r = (typeof r === 'undefined') ? 0 : r;
    g = (typeof g === 'undefined') ? 0 : g;
    b = (typeof b === 'undefined') ? 0 : b;
    return { r: r, g: g, b: b };
};
var createColorRange = function (c1, c2) {
    var colorList = [], tmpColor;
    for (var i = 0; i < 10000; i++) {
        tmpColor = new GColor();
        tmpColor.r = c1.r + ((i * (c2.r - c1.r)) / 10000);
        tmpColor.g = c1.g + ((i * (c2.g - c1.g)) / 10000);
        tmpColor.b = c1.b + ((i * (c2.b - c1.b)) / 10000);
        colorList.push(tmpColor);
    }
    return colorList;
};



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


class SpectrogramMesh extends React.Component{
    
    constructor(props) {
        console.log("build spec init");
        super(props);
        // this.initialised = false;
        // console.log(this.initialised);

        // // *** Paramters ***
        this.props = props;
        // this.s_data = [];
        // this.y_dim = 0;
        // this.x_dim = 0;
        // this.min_val = 100;
        // this.max_val = 0;
        // this.number_transitions = 1000;
        // this.range_min = 0;
        // this.range_max = this.number_transitions;
        // this.frequency_samples = 0;
        // this.time_samples = 0;

        // // vector of frequency values from fft. required for mapping
        // this.frequency_vector = [];

        // // *** Vectors ***
        // // height vector
        // this.heights_vec = new THREE.Uint8BufferAttribute(new THREE.Uint8BufferAttribute([]), 1)
        // // indices vector
        // this.indices32 = new Uint32Array([]);
        // // vertices vector
        // this.vertices = new Float32Array([]);
        // // normal vector
        // this.normals = new Float32Array([]);

        // // *** Attributes ***
        // // geometry attributes
        // this.positionsAttribute = new THREE.BufferAttribute(new Float32Array([]), 3);
        // // normal attribute
        // this.normalAttribute = new THREE.BufferAttribute(this.normals, 3);

        // // *** Shaders ***
        // this.uniforms = {};
        // this.lut = [];

        // prepare colormaps
        // colormaps
        
        this.number_transitions = 10000;

        this.colors = {
            "jet": [[0, 0, 0.5137254901960784, 1], [1, 1, 1, 1]],
            "hot": [[0, 0, 0, 1],[0.5764705882352941, 1, 0, 1]]
        }
    
       
        
        // pop last element
        // console.log(this.colors);
        this.colormap = {};
        for (const [key, value] of Object.entries(this.colors)) {
            for (var i = 0; i < this.colors[key].length; i++) {
                // console.log(colors[key][i]);
                this.colors[key][i].pop();
                // console.log(colors[key][i]);
            }
            
            this.colormap[key] = this.build_color_map(this.colors[key][0], this.colors[key][1]);


        }

        // console.log(this.colormap);

        // console.log(this.props);
        // *** Initialise Spectrogram ***
        if ((props.showSpec == 1) ) {
            console.log('init in init');
            this.init();
        }
      
    }



    build_color_map = (c1, c2) => {
        console.log(c1, c2);
        let cm = [];
        cm.push(c1);
        let multiply = 1 / this.number_transitions;

        let r_range = c2[0] - c1[0];
        let r_dir = c2[0]>c1[0] ? 1 : -1

        let g_range = c2[1] - c1[1];
        let g_dir = c2[1] > c1[1] ? 1 : -1

        let b_range = c2[2] - c1[2];
        let b_dir = c2[2] > c1[2] ? 1 : -1

        console.log(this.number_transitions);
        for (let i = 1; i < this.number_transitions; i++){
            let c = cm[i-1];
            
          
            
            let r = c[0] + (r_range * multiply * r_dir);
            let g = c[1] + (g_range * multiply * g_dir);
            let b = c[2] + (b_range * multiply * b_dir);

            cm.push([r, g, b]);
            //console.log(cm[i]);
        }
        cm.push(c2);
        return cm;
    }


    scaleData = (value) => {

        let range = this.max_val - this.min_val;
        let scale = (value - this.min_val) / range;
        let new_value = ((scale) * (this.range_max - this.range_min));
        if (new_value > 1000) {
            console.log(new_value);
        }
        if (new_value < 0) {
            console.log(new_value);
        }

        
        return (new_value);

    }

    init() {
        
        // ---
        this.initialised = false;
        console.log(this.initialised);

        // *** Paramters ***
        
        this.s_data = [];
        this.y_dim = 0;
        this.x_dim = 0;
        this.min_val = 100;
        this.max_val = 0;
        
        this.range_min = 0;
        this.range_max = this.number_transitions;
        this.frequency_samples = 0;
        this.time_samples = 0;

        // vector of frequency values from fft. required for mapping
        this.frequency_vector = [];

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
        this.lut = [];

        // --- 

        let current_filename = `fft_${ this.props.model_id }.json`;
        console.log(current_filename);
        // load data
        const getData = () => {
            console.log("Getting FFT DATA");
                fetch(`/marlin_live_data/${current_filename}`
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
            
            // grab the frequency vector
            this.frequency_vector = specJsonData['f_vec'];

            console.log('building data');
            // console.log(this.frequency_vector);

            for (const [key, value] of Object.entries(specJsonData['fft'])) {
               
                for (let i = 0; i < value.length; i++) {
                    this.max_val = Math.max(this.max_val, value[i]);
                    this.min_val = Math.min(this.min_val, value[i]);
                }
                this.s_data.push(value);
                this.y_dim += 1;
                this.x_dim = value.length;
            }

            console.log(this.max_val, this.min_val);

            this.frequency_samples = this.y_dim;
            this.time_samples = this.x_dim;

            let xsegments = this.time_samples;
            let ysegments = this.frequency_samples;

            /* OpenGL stuff */
            let xsize = this.props.gl_data.x_width;
            let ysize = this.props.gl_data.y_width;

            let xhalfSize = xsize / 2;
            let yhalfSize = ysize / 2;
            let xsegmentSize = xsize / xsegments;
            let ysegmentSize = ysize / ysegments;

            let _v_index = 0;
            // console.log(xsegments, ysegments);
            let heights = [];
            let v = [];
            let c = [];
            let n = [];
            for (let i = 0; i <= xsegments; i++) {

                let x = (i * xsegmentSize) - xhalfSize; //midpoint of mesh is 0,0
                // console.log(i,x);
                for (let j = 0; j <= ysegments; j++) {
                    // console.log(this.s_data[j][i]);
                    let y = (j * ysegmentSize) - yhalfSize;
                    let height = 0;
                   
                    try {
                        
                        height = this.scaleData(this.s_data[j][i]);

                    }
                    catch {
                      
                        height = this.scaleData(this.min_val);

                    }

                    // console.log(height);
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
            // console.log(this.heights_vec);
            this.initialised = true;
            // console.log(this.frequency_vector);
            this.props.MESH_LOADED(this.frequency_vector);

        }

        // build GL Shaders
        const buildGLShaders = () => {
            
            let energy_range = this.max_val - this.min_val;
            let number_transitions = 300;
            let init_colors = [];
            
            for (let i = 0; i < this.number_transitions; i++){
                let s =  (i / this.number_transitions) ;
                let r = Math.random();
                let g = Math.random();
                let b = Math.random();

                init_colors.push([r, g, b]);
            }

            // init_colors = this.colormap['jet'];
            //    init_colors = color_scale;
            // let string = [[0.18995, 0.07176, 0.23217], [0.19483, 0.08339, 0.26149], [0.19956, 0.09498, 0.29024], [0.20415, 0.10652, 0.31844], [0.20860, 0.11802, 0.34607], [0.21291, 0.12947, 0.37314], [0.21708, 0.14087, 0.39964], [0.22111, 0.15223, 0.42558], [0.22500, 0.16354, 0.45096], [0.22875, 0.17481, 0.47578], [0.23236, 0.18603, 0.50004], [0.23582, 0.19720, 0.52373], [0.23915, 0.20833, 0.54686], [0.24234, 0.21941, 0.56942], [0.24539, 0.23044, 0.59142], [0.24830, 0.24143, 0.61286], [0.25107, 0.25237, 0.63374], [0.25369, 0.26327, 0.65406], [0.25618, 0.27412, 0.67381], [0.25853, 0.28492, 0.69300], [0.26074, 0.29568, 0.71162], [0.26280, 0.30639, 0.72968], [0.26473, 0.31706, 0.74718], [0.26652, 0.32768, 0.76412], [0.26816, 0.33825, 0.78050], [0.26967, 0.34878, 0.79631], [0.27103, 0.35926, 0.81156], [0.27226, 0.36970, 0.82624], [0.27334, 0.38008, 0.84037], [0.27429, 0.39043, 0.85393], [0.27509, 0.40072, 0.86692], [0.27576, 0.41097, 0.87936], [0.27628, 0.42118, 0.89123], [0.27667, 0.43134, 0.90254], [0.27691, 0.44145, 0.91328], [0.27701, 0.45152, 0.92347], [0.27698, 0.46153, 0.93309], [0.27680, 0.47151, 0.94214], [0.27648, 0.48144, 0.95064], [0.27603, 0.49132, 0.95857], [0.27543, 0.50115, 0.96594], [0.27469, 0.51094, 0.97275], [0.27381, 0.52069, 0.97899], [0.27273, 0.53040, 0.98461], [0.27106, 0.54015, 0.98930], [0.26878, 0.54995, 0.99303], [0.26592, 0.55979, 0.99583], [0.26252, 0.56967, 0.99773], [0.25862, 0.57958, 0.99876], [0.25425, 0.58950, 0.99896], [0.24946, 0.59943, 0.99835], [0.24427, 0.60937, 0.99697], [0.23874, 0.61931, 0.99485], [0.23288, 0.62923, 0.99202], [0.22676, 0.63913, 0.98851], [0.22039, 0.64901, 0.98436], [0.21382, 0.65886, 0.97959], [0.20708, 0.66866, 0.97423], [0.20021, 0.67842, 0.96833], [0.19326, 0.68812, 0.96190], [0.18625, 0.69775, 0.95498], [0.17923, 0.70732, 0.94761], [0.17223, 0.71680, 0.93981], [0.16529, 0.72620, 0.93161], [0.15844, 0.73551, 0.92305], [0.15173, 0.74472, 0.91416], [0.14519, 0.75381, 0.90496], [0.13886, 0.76279, 0.89550], [0.13278, 0.77165, 0.88580], [0.12698, 0.78037, 0.87590], [0.12151, 0.78896, 0.86581], [0.11639, 0.79740, 0.85559], [0.11167, 0.80569, 0.84525], [0.10738, 0.81381, 0.83484], [0.10357, 0.82177, 0.82437], [0.10026, 0.82955, 0.81389], [0.09750, 0.83714, 0.80342], [0.09532, 0.84455, 0.79299], [0.09377, 0.85175, 0.78264], [0.09287, 0.85875, 0.77240], [0.09267, 0.86554, 0.76230], [0.09320, 0.87211, 0.75237], [0.09451, 0.87844, 0.74265], [0.09662, 0.88454, 0.73316], [0.09958, 0.89040, 0.72393], [0.10342, 0.89600, 0.71500], [0.10815, 0.90142, 0.70599], [0.11374, 0.90673, 0.69651], [0.12014, 0.91193, 0.68660], [0.12733, 0.91701, 0.67627], [0.13526, 0.92197, 0.66556], [0.14391, 0.92680, 0.65448], [0.15323, 0.93151, 0.64308], [0.16319, 0.93609, 0.63137], [0.17377, 0.94053, 0.61938], [0.18491, 0.94484, 0.60713], [0.19659, 0.94901, 0.59466], [0.20877, 0.95304, 0.58199], [0.22142, 0.95692, 0.56914], [0.23449, 0.96065, 0.55614], [0.24797, 0.96423, 0.54303], [0.26180, 0.96765, 0.52981], [0.27597, 0.97092, 0.51653], [0.29042, 0.97403, 0.50321], [0.30513, 0.97697, 0.48987], [0.32006, 0.97974, 0.47654], [0.33517, 0.98234, 0.46325], [0.35043, 0.98477, 0.45002], [0.36581, 0.98702, 0.43688], [0.38127, 0.98909, 0.42386], [0.39678, 0.99098, 0.41098], [0.41229, 0.99268, 0.39826], [0.42778, 0.99419, 0.38575], [0.44321, 0.99551, 0.37345], [0.45854, 0.99663, 0.36140], [0.47375, 0.99755, 0.34963], [0.48879, 0.99828, 0.33816], [0.50362, 0.99879, 0.32701], [0.51822, 0.99910, 0.31622], [0.53255, 0.99919, 0.30581], [0.54658, 0.99907, 0.29581], [0.56026, 0.99873, 0.28623], [0.57357, 0.99817, 0.27712], [0.58646, 0.99739, 0.26849], [0.59891, 0.99638, 0.26038], [0.61088, 0.99514, 0.25280], [0.62233, 0.99366, 0.24579], [0.63323, 0.99195, 0.23937], [0.64362, 0.98999, 0.23356], [0.65394, 0.98775, 0.22835], [0.66428, 0.98524, 0.22370], [0.67462, 0.98246, 0.21960], [0.68494, 0.97941, 0.21602], [0.69525, 0.97610, 0.21294], [0.70553, 0.97255, 0.21032], [0.71577, 0.96875, 0.20815], [0.72596, 0.96470, 0.20640], [0.73610, 0.96043, 0.20504], [0.74617, 0.95593, 0.20406], [0.75617, 0.95121, 0.20343], [0.76608, 0.94627, 0.20311], [0.77591, 0.94113, 0.20310], [0.78563, 0.93579, 0.20336], [0.79524, 0.93025, 0.20386], [0.80473, 0.92452, 0.20459], [0.81410, 0.91861, 0.20552], [0.82333, 0.91253, 0.20663], [0.83241, 0.90627, 0.20788], [0.84133, 0.89986, 0.20926], [0.85010, 0.89328, 0.21074], [0.85868, 0.88655, 0.21230], [0.86709, 0.87968, 0.21391], [0.87530, 0.87267, 0.21555], [0.88331, 0.86553, 0.21719], [0.89112, 0.85826, 0.21880], [0.89870, 0.85087, 0.22038], [0.90605, 0.84337, 0.22188], [0.91317, 0.83576, 0.22328], [0.92004, 0.82806, 0.22456], [0.92666, 0.82025, 0.22570], [0.93301, 0.81236, 0.22667], [0.93909, 0.80439, 0.22744], [0.94489, 0.79634, 0.22800], [0.95039, 0.78823, 0.22831], [0.95560, 0.78005, 0.22836], [0.96049, 0.77181, 0.22811], [0.96507, 0.76352, 0.22754], [0.96931, 0.75519, 0.22663], [0.97323, 0.74682, 0.22536], [0.97679, 0.73842, 0.22369], [0.98000, 0.73000, 0.22161], [0.98289, 0.72140, 0.21918], [0.98549, 0.71250, 0.21650], [0.98781, 0.70330, 0.21358], [0.98986, 0.69382, 0.21043], [0.99163, 0.68408, 0.20706], [0.99314, 0.67408, 0.20348], [0.99438, 0.66386, 0.19971], [0.99535, 0.65341, 0.19577], [0.99607, 0.64277, 0.19165], [0.99654, 0.63193, 0.18738], [0.99675, 0.62093, 0.18297], [0.99672, 0.60977, 0.17842], [0.99644, 0.59846, 0.17376], [0.99593, 0.58703, 0.16899], [0.99517, 0.57549, 0.16412], [0.99419, 0.56386, 0.15918], [0.99297, 0.55214, 0.15417], [0.99153, 0.54036, 0.14910], [0.98987, 0.52854, 0.14398], [0.98799, 0.51667, 0.13883], [0.98590, 0.50479, 0.13367], [0.98360, 0.49291, 0.12849], [0.98108, 0.48104, 0.12332], [0.97837, 0.46920, 0.11817], [0.97545, 0.45740, 0.11305], [0.97234, 0.44565, 0.10797], [0.96904, 0.43399, 0.10294], [0.96555, 0.42241, 0.09798], [0.96187, 0.41093, 0.09310], [0.95801, 0.39958, 0.08831], [0.95398, 0.38836, 0.08362], [0.94977, 0.37729, 0.07905], [0.94538, 0.36638, 0.07461], [0.94084, 0.35566, 0.07031], [0.93612, 0.34513, 0.06616], [0.93125, 0.33482, 0.06218], [0.92623, 0.32473, 0.05837], [0.92105, 0.31489, 0.05475], [0.91572, 0.30530, 0.05134], [0.91024, 0.29599, 0.04814], [0.90463, 0.28696, 0.04516], [0.89888, 0.27824, 0.04243], [0.89298, 0.26981, 0.03993], [0.88691, 0.26152, 0.03753], [0.88066, 0.25334, 0.03521], [0.87422, 0.24526, 0.03297], [0.86760, 0.23730, 0.03082], [0.86079, 0.22945, 0.02875], [0.85380, 0.22170, 0.02677], [0.84662, 0.21407, 0.02487], [0.83926, 0.20654, 0.02305], [0.83172, 0.19912, 0.02131], [0.82399, 0.19182, 0.01966], [0.81608, 0.18462, 0.01809], [0.80799, 0.17753, 0.01660], [0.79971, 0.17055, 0.01520], [0.79125, 0.16368, 0.01387], [0.78260, 0.15693, 0.01264], [0.77377, 0.15028, 0.01148], [0.76476, 0.14374, 0.01041], [0.75556, 0.13731, 0.00942], [0.74617, 0.13098, 0.00851], [0.73661, 0.12477, 0.00769], [0.72686, 0.11867, 0.00695], [0.71692, 0.11268, 0.00629], [0.70680, 0.10680, 0.00571], [0.69650, 0.10102, 0.00522], [0.68602, 0.09536, 0.00481], [0.67535, 0.08980, 0.00449], [0.66449, 0.08436, 0.00424], [0.65345, 0.07902, 0.00408], [0.64223, 0.07380, 0.00401], [0.63082, 0.06868, 0.00401], [0.61923, 0.06367, 0.00410], [0.60746, 0.05878, 0.00427], [0.59550, 0.05399, 0.00453], [0.58336, 0.04931, 0.00486], [0.57103, 0.04474, 0.00529], [0.55852, 0.04028, 0.00579], [0.54583, 0.03593, 0.00638], [0.53295, 0.03169, 0.00705], [0.51989, 0.02756, 0.00780], [0.50664, 0.02354, 0.00863], [0.49321, 0.01963, 0.00955], [0.47960, 0.01583, 0.01055]];
            // init_colors = this.colormap['jet'];
            console.log(init_colors.length);
            for (let n = 0; n < this.number_transitions; n++) {
                //This line modifies the colors slightly
                this.lut.push(new THREE.Vector3((init_colors[n][0] * (255 - 49)) / 206., (init_colors[n][1] * (255 - 19)) / 236., (init_colors[n][2] * (255 - 50)) / 190.));
                // this.lut.push(new THREE.Vector3(custom_cm[n][0], custom_cm[n][1], custom_cm[n][2]));
                //  this.lut.push(new THREE.Vector3(init_colors[n][0], init_colors[n][1], init_colors[n][2]));


            }
            console.log(this.lut);
            // console.log(init_colors);

            this.uniforms = {
                vLut: {
                    value: this.lut,
                    type: "v3v"
                },
            }


        }

        
        getData();
        buildGLShaders();

        

    }

    render() {
        console.log(this.props);
        // *** Initialise Spectrogram ***
        if ((this.props.showSpec == 1)) {
            console.log('init in render');
            this.init();
        }
        console.log('Rendering');
        if (this.initialised) {
            // console.log(this.indices32);
            // console.log(this.heights_vec);
            return (
                
               
                <mesh>
                    <shaderMaterial
                        fragmentShader={fragmentShader}
                        vertexShader={vertexShader}
                        uniforms={this.uniforms}
                        args={[{ side: DoubleSide }]}
                        wireframe={false}
                    />
    
                    <bufferGeometry attach="geometry" attributes={{ 'position': this.positionsAttribute, 'displacement': this.heights_vec, 'normal': this.normalAttribute }}>
                        <bufferAttribute attach="index" array={this.indices32} count={this.indices32.length} itemSize={1} />
                     </bufferGeometry >

                </mesh>  
                    
            )
        }
        else {
            return (
              <mesh></mesh>
            )
        }
       

    }


}



const mapStateToProps = (state) => ({

    showSpec: state.acousticFileData.SHOW_SPEC_FLAG,
    meshLoaded: state.acousticFileData.GL_MESH_LOADED,
    activity_plot_data: state.plot_activity_data,
    gl_data: state.openGl,
    model_id : state.model_parameters[0].model_id
    
})

const mapDispatchToProps = (dispatch) => {
    
    return {
        MESH_LOADED: frequency_vector => dispatch(meshUpdateFunction(frequency_vector))
        
    }

}


const ConnectedSpectrogramMesh = connect(mapStateToProps, mapDispatchToProps)(SpectrogramMesh);
export default ConnectedSpectrogramMesh;


const meshUpdateFunction = (frequency_vector) => {

    return {
        'type' : "MESH_LOADED",
        'payload' : frequency_vector
    }
}

/*
*   GL SHADERS
*
*/


const vertexShader = `

    attribute float displacement;
    
    uniform vec3 vLut[1000];
    varying vec3 vColor;

    void main(){
        int index = int(displacement);
        vColor = vLut[index];
        vec3 newPosition = position + normal*displacement/50.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition,1.0);

    }


`;


const fragmentShader = `

   varying vec3 vColor;
	void main(){
		gl_FragColor = vec4(vColor,1.0);
	}

`;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
let hex_colormap2 = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#fffeff', '#fffeff', '#fefeff', '#fefeff', '#fefeff', '#fefeff', '#fefdff', '#fefdff', '#fefdff', '#fefdff', '#fefdff', '#fefdff', '#fefcff', '#fdfcff', '#fdfcff', '#fdfcff', '#fdfcff', '#fdfcff', '#fdfbff', '#fdfbff', '#fdfbff', '#fdfbff', '#fdfbff', '#fdfbff', '#fdfaff', '#fcfaff', '#fcfaff', '#fcfaff', '#fcfaff', '#fcfaff', '#fcf9ff', '#fcf9ff', '#fcf9ff', '#fcf9ff', '#fcf9ff', '#fcf9ff', '#fbf8ff', '#fbf8ff', '#fbf8ff', '#fbf8ff', '#fbf8ff', '#fbf8ff', '#fbf7ff', '#fbf7ff', '#fbf7ff', '#fbf7ff', '#fbf7ff', '#faf7ff', '#faf6ff', '#faf6ff', '#faf6ff', '#faf6ff', '#faf6ff', '#faf6ff', '#faf6ff', '#faf5ff', '#faf5ff', '#faf5ff', '#f9f5ff', '#f9f5ff', '#f9f5ff', '#f9f4ff', '#f9f4ff', '#f9f4ff', '#f9f4ff', '#f9f4ff', '#f9f4ff', '#f9f3ff', '#f9f3ff', '#f8f3ff', '#f8f3ff', '#f8f3ff', '#f8f3ff', '#f8f2ff', '#f8f2ff', '#f8f2ff', '#f8f2ff', '#f8f2ff', '#f8f2ff', '#f8f1ff', '#f7f1ff', '#f7f1ff', '#f7f1ff', '#f7f1ff', '#f7f1ff', '#f7f0ff', '#f7f0ff', '#f7f0ff', '#f7f0ff', '#f7f0ff', '#f7f0ff', '#f7f0ff', '#f6efff', '#f6efff', '#f6efff', '#f6efff', '#f6efff', '#f6efff', '#f6eeff', '#f6eeff', '#f6eeff', '#f6eeff', '#f6eeff', '#f5eeff', '#f5edff', '#f5edff', '#f5edff', '#f5edff', '#f5edff', '#f5edff', '#f5ecff', '#f5ecff', '#f5ecff', '#f5ecff', '#f4ecff', '#f4ecff', '#f4ebff', '#f4ebff', '#f4ebff', '#f4ebff', '#f4ebff', '#f4ebff', '#f4eaff', '#f4eaff', '#f4eaff', '#f3eaff', '#f3eaff', '#f3eaff', '#f3e9ff', '#f3e9ff', '#f3e9ff', '#f3e9ff', '#f3e9ff', '#f3e9ff', '#f3e8ff', '#f3e8ff', '#f3e8ff', '#f2e8ff', '#f2e8ff', '#f2e8ff', '#f2e8ff', '#f2e7ff', '#f2e7ff', '#f2e7ff', '#f2e7ff', '#f2e7ff', '#f2e6ff', '#f2e6ff', '#f1e6ff', '#f1e6ff', '#f1e6ff', '#f1e6ff', '#f1e6ff', '#f1e5ff', '#f1e5ff', '#f1e5ff', '#f1e5ff', '#f1e5ff', '#f1e5ff', '#f1e4ff', '#f0e4ff', '#f0e4ff', '#f0e4ff', '#f0e4ff', '#f0e4ff', '#f0e3ff', '#f0e3ff', '#f0e3ff', '#f0e3ff', '#f0e3ff', '#f0e3ff', '#efe2ff', '#efe2ff', '#efe2ff', '#efe2ff', '#efe2ff', '#efe2ff', '#efe1ff', '#efe1ff', '#efe1ff', '#efe1ff', '#efe1ff', '#eee1ff', '#eee0ff', '#eee0ff', '#eee0ff', '#eee0ff', '#eee0ff', '#eee0ff', '#eedfff', '#eedfff', '#eedfff', '#eedfff', '#eedfff', '#eddfff', '#eddeff', '#eddeff', '#eddeff', '#eddeff', '#eddeff', '#eddeff', '#edddff', '#edddff', '#edddff', '#edddff', '#edddff', '#ecddff', '#ecddff', '#ecdcff', '#ecdcff', '#ecdcff', '#ecdcff', '#ecdcff', '#ecdcff', '#ecdbff', '#ecdbff', '#ecdbff', '#ebdbff', '#ebdbff', '#ebdbff', '#ebdaff', '#ebdaff', '#ebdaff', '#ebdaff', '#ebdaff', '#ebdaff', '#ebd9ff', '#ebd9ff', '#ebd9ff', '#ead9ff', '#ead9ff', '#ead9ff', '#ead8ff', '#ead8ff', '#ead8ff', '#ead8ff', '#ead8ff', '#ead8ff', '#ead7ff', '#ead7ff', '#e9d7ff', '#e9d7ff', '#e9d7ff', '#e9d7ff', '#e9d6ff', '#e9d6ff', '#e9d6ff', '#e9d6ff', '#e9d6ff', '#e9d6ff', '#e9d5ff', '#e9d5ff', '#e8d5ff', '#e8d5ff', '#e8d5ff', '#e8d5ff', '#e8d5ff', '#e8d4ff', '#e8d4ff', '#e8d4ff', '#e8d4ff', '#e8d4ff', '#e8d4ff', '#e8d3ff', '#e7d3ff', '#e7d3ff', '#e7d3ff', '#e7d3ff', '#e7d3ff', '#e7d2fe', '#e7d2fe', '#e7d2fe', '#e7d2fe', '#e7d2fe', '#e7d2fe', '#e7d1fe', '#e6d1fe', '#e6d1fe', '#e6d1fe', '#e6d1fe', '#e6d1fe', '#e6d0fe', '#e6d0fe', '#e6d0fe', '#e6d0fe', '#e6d0fe', '#e6d0fe', '#e6cffe', '#e5cffe', '#e5cffe', '#e5cffe', '#e5cffe', '#e5cffe', '#e5cefe', '#e5cefe', '#e5cefe', '#e5cefe', '#e5cefe', '#e5cefe', '#e5cdfe', '#e4cdfe', '#e4cdfe', '#e4cdfe', '#e4cdfe', '#e4cdfe', '#e4ccfe', '#e4ccfe', '#e4ccfe', '#e4ccfe', '#e4ccfe', '#e4ccfe', '#e4ccfe', '#e3cbfe', '#e3cbfe', '#e3cbfe', '#e3cbfe', '#e3cbfe', '#e3cbfe', '#e3cafe', '#e3cafe', '#e3cafe', '#e3cafe', '#e3cafe', '#e3cafe', '#e3c9fd', '#e2c9fd', '#e2c9fd', '#e2c9fd', '#e2c9fd', '#e2c9fd', '#e2c8fd', '#e2c8fd', '#e2c8fd', '#e2c8fd', '#e2c8fd', '#e2c8fd', '#e2c7fd', '#e1c7fd', '#e1c7fd', '#e1c7fd', '#e1c7fd', '#e1c7fd', '#e1c6fd', '#e1c6fd', '#e1c6fd', '#e1c6fd', '#e1c6fd', '#e1c6fd', '#e1c5fd', '#e0c5fd', '#e0c5fd', '#e0c5fd', '#e0c5fd', '#e0c5fd', '#e0c4fd', '#e0c4fd', '#e0c4fd', '#e0c4fd', '#e0c4fd', '#e0c4fd', '#e0c3fd', '#e0c3fd', '#dfc3fd', '#dfc3fd', '#dfc3fd', '#dfc3fc', '#dfc2fc', '#dfc2fc', '#dfc2fc', '#dfc2fc', '#dfc2fc', '#dfc2fc', '#dfc2fc', '#dfc1fc', '#dec1fc', '#dec1fc', '#dec1fc', '#dec1fc', '#dec1fc', '#dec0fc', '#dec0fc', '#dec0fc', '#dec0fc', '#dec0fc', '#dec0fc', '#debffc', '#debffc', '#ddbffc', '#ddbffc', '#ddbffc', '#ddbffc', '#ddbefc', '#ddbefc', '#ddbefc', '#ddbefc', '#ddbefc', '#ddbefc', '#ddbdfc', '#ddbdfc', '#ddbdfc', '#dcbdfb', '#dcbdfb', '#dcbdfb', '#dcbcfb', '#dcbcfb', '#dcbcfb', '#dcbcfb', '#dcbcfb', '#dcbcfb', '#dcbbfb', '#dcbbfb', '#dcbbfb', '#dcbbfb', '#dbbbfb', '#dbbbfb', '#dbbafb', '#dbbafb', '#dbbafb', '#dbbafb', '#dbbafb', '#dbbafb', '#dbb9fb', '#dbb9fb', '#dbb9fb', '#dbb9fb', '#dbb9fb', '#dab9fb', '#dab8fb', '#dab8fb', '#dab8fb', '#dab8fa', '#dab8fa', '#dab8fa', '#dab7fa', '#dab7fa', '#dab7fa', '#dab7fa', '#dab7fa', '#dab7fa', '#d9b6fa', '#d9b6fa', '#d9b6fa', '#d9b6fa', '#d9b6fa', '#d9b6fa', '#d9b5fa', '#d9b5fa', '#d9b5fa', '#d9b5fa', '#d9b5fa', '#d9b5fa', '#d9b4fa', '#d9b4fa', '#d8b4fa', '#d8b4fa', '#d8b4fa', '#d8b4fa', '#d8b3f9', '#d8b3f9', '#d8b3f9', '#d8b3f9', '#d8b3f9', '#d8b3f9', '#d8b2f9', '#d8b2f9', '#d8b2f9', '#d7b2f9', '#d7b2f9', '#d7b2f9', '#d7b2f9', '#d7b1f9', '#d7b1f9', '#d7b1f9', '#d7b1f9', '#d7b1f9', '#d7b1f9', '#d7b0f9', '#d7b0f9', '#d7b0f9', '#d7b0f9', '#d6b0f9', '#d6aff8', '#d6aff8', '#d6aff8', '#d6aff8', '#d6aff8', '#d6aff8', '#d6aff8', '#d6aef8', '#d6aef8', '#d6aef8', '#d6aef8', '#d6aef8', '#d6aef8', '#d6adf8', '#d5adf8', '#d5adf8', '#d5adf8', '#d5adf8', '#d5adf8', '#d5acf8', '#d5acf8', '#d5acf8', '#d5acf8', '#d5acf7', '#d5acf7', '#d5abf7', '#d5abf7', '#d5abf7', '#d4abf7', '#d4abf7', '#d4abf7', '#d4aaf7', '#d4aaf7', '#d4aaf7', '#d4aaf7', '#d4aaf7', '#d4aaf7', '#d4a9f7', '#d4a9f7', '#d4a9f7', '#d4a9f7', '#d4a9f7', '#d3a9f7', '#d3a8f7', '#d3a8f6', '#d3a8f6', '#d3a8f6', '#d3a8f6', '#d3a7f6', '#d3a7f6', '#d3a7f6', '#d3a7f6', '#d3a7f6', '#d3a7f6', '#d3a7f6', '#d3a6f6', '#d3a6f6', '#d2a6f6', '#d2a6f6', '#d2a6f6', '#d2a5f6', '#d2a5f6', '#d2a5f6', '#d2a5f5', '#d2a5f5', '#d2a5f5', '#d2a4f5', '#d2a4f5', '#d2a4f5', '#d2a4f5', '#d2a4f5', '#d2a4f5', '#d2a3f5', '#d1a3f5', '#d1a3f5', '#d1a3f5', '#d1a3f5', '#d1a3f5', '#d1a2f5', '#d1a2f5', '#d1a2f5', '#d1a2f4', '#d1a2f4', '#d1a2f4', '#d1a1f4', '#d1a1f4', '#d1a1f4', '#d1a1f4', '#d0a1f4', '#d0a1f4', '#d0a0f4', '#d0a0f4', '#d0a0f4', '#d0a0f4', '#d0a0f4', '#d0a0f4', '#d09ff4', '#d09ff4', '#d09ff3', '#d09ff3', '#d09ff3', '#d09ff3', '#d09ef3', '#d09ef3', '#cf9ef3', '#cf9ef3', '#cf9ef3', '#cf9ef3', '#cf9df3', '#cf9df3', '#cf9df3', '#cf9df3', '#cf9df3', '#cf9df3', '#cf9cf3', '#cf9cf2', '#cf9cf2', '#cf9cf2', '#cf9cf2', '#cf9cf2', '#cf9bf2', '#ce9bf2', '#ce9bf2', '#ce9bf2', '#ce9bf2', '#ce9bf2', '#ce9af2', '#ce9af2', '#ce9af2', '#ce9af2', '#ce9af1', '#ce9af1', '#ce99f1', '#ce99f1', '#ce99f1', '#ce99f1', '#ce99f1', '#ce99f1', '#cd98f1', '#cd98f1', '#cd98f1', '#cd98f1', '#cd98f1', '#cd97f1', '#cd97f1', '#cd97f0', '#cd97f0', '#cd97f0', '#cd97f0', '#cd96f0', '#cd96f0', '#cd96f0', '#cd96f0', '#cd96f0', '#cd96f0', '#cd95f0', '#cc95f0', '#cc95f0', '#cc95f0', '#cc95ef', '#cc95ef', '#cc94ef', '#cc94ef', '#cc94ef', '#cc94ef', '#cc94ef', '#cc94ef', '#cc93ef', '#cc93ef', '#cc93ef', '#cc93ef', '#cc93ef', '#cc92ef', '#cc92ee', '#cc92ee', '#cb92ee', '#cb92ee', '#cb92ee', '#cb91ee', '#cb91ee', '#cb91ee', '#cb91ee', '#cb91ee', '#cb91ee', '#cb90ee', '#cb90ee', '#cb90ed', '#cb90ed', '#cb90ed', '#cb8fed', '#cb8fed', '#cb8fed', '#cb8fed', '#cb8fed', '#cb8fed', '#ca8eed', '#ca8eed', '#ca8eed', '#ca8eec', '#ca8eec', '#ca8eec', '#ca8dec', '#ca8dec', '#ca8dec', '#ca8dec', '#ca8dec', '#ca8dec', '#ca8cec', '#ca8cec', '#ca8cec', '#ca8ceb', '#ca8ceb', '#ca8beb', '#ca8beb', '#ca8beb', '#ca8beb', '#c98beb', '#c98beb', '#c98aeb', '#c98aeb', '#c98aeb', '#c98aeb', '#c98aea', '#c98aea', '#c989ea', '#c989ea', '#c989ea', '#c989ea', '#c989ea', '#c988ea', '#c988ea', '#c988ea', '#c988ea', '#c988e9', '#c988e9', '#c987e9', '#c987e9', '#c987e9', '#c887e9', '#c887e9', '#c887e9', '#c886e9', '#c886e9', '#c886e8', '#c886e8', '#c886e8', '#c886e8', '#c885e8', '#c885e8', '#c885e8', '#c885e8', '#c885e8', '#c884e8', '#c884e8', '#c884e7', '#c884e7', '#c884e7', '#c884e7', '#c883e7', '#c883e7', '#c883e7', '#c883e7', '#c883e7', '#c882e7', '#c782e6', '#c782e6', '#c782e6', '#c782e6', '#c782e6', '#c781e6', '#c781e6', '#c781e6', '#c781e6', '#c781e6', '#c780e5', '#c780e5', '#c780e5', '#c780e5', '#c780e5', '#c77fe5', '#c77fe5', '#c77fe5', '#c77fe5', '#c77fe4', '#c77fe4', '#c77ee4', '#c77ee4', '#c77ee4', '#c77ee4', '#c77ee4', '#c77de4', '#c77de4', '#c77de3', '#c77de3', '#c67de3', '#c67de3', '#c67ce3', '#c67ce3', '#c67ce3', '#c67ce3', '#c67ce3', '#c67be2', '#c67be2', '#c67be2', '#c67be2', '#c67be2', '#c67be2', '#c67ae2', '#c67ae2', '#c67ae2', '#c67ae1', '#c67ae1', '#c679e1', '#c679e1', '#c679e1', '#c679e1', '#c679e1', '#c678e1', '#c678e0', '#c678e0', '#c678e0', '#c678e0', '#c678e0', '#c677e0', '#c677e0', '#c677e0', '#c677df', '#c677df', '#c676df', '#c676df', '#c676df', '#c676df', '#c576df', '#c575df', '#c575de', '#c575de', '#c575de', '#c575de', '#c574de', '#c574de', '#c574de', '#c574de', '#c574dd', '#c573dd', '#c573dd', '#c573dd', '#c573dd', '#c573dd', '#c573dd', '#c572dc', '#c572dc', '#c572dc', '#c572dc', '#c572dc', '#c571dc', '#c571dc', '#c571dc', '#c571db', '#c571db', '#c570db', '#c570db', '#c570db', '#c570db', '#c570db', '#c56fda', '#c56fda', '#c56fda', '#c56fda', '#c56fda', '#c56eda', '#c56eda', '#c56ed9', '#c56ed9', '#c56ed9', '#c56dd9', '#c56dd9', '#c56dd9', '#c56dd9', '#c56dd8', '#c56cd8', '#c56cd8', '#c56cd8', '#c56cd8', '#c56cd8', '#c56bd7', '#c56bd7', '#c56bd7', '#c56bd7', '#c56bd7', '#c56ad7', '#c56ad7', '#c56ad6', '#c56ad6', '#c56ad6', '#c569d6', '#c569d6', '#c569d6', '#c569d5', '#c569d5', '#c568d5', '#c568d5', '#c568d5', '#c568d5', '#c568d4', '#c567d4', '#c567d4', '#c567d4', '#c567d4', '#c567d4', '#c566d3', '#c566d3', '#c566d3', '#c566d3', '#c566d3', '#c565d3', '#c565d2', '#c565d2', '#c565d2', '#c564d2', '#c564d2', '#c564d2', '#c564d1', '#c564d1', '#c563d1', '#c563d1', '#c563d1', '#c563d0', '#c562d0', '#c562d0', '#c562d0', '#c562d0', '#c562d0', '#c561cf', '#c561cf', '#c561cf', '#c561cf', '#c560cf', '#c560ce', '#c560ce', '#c560ce', '#c560ce', '#c55fce', '#c55fcd', '#c55fcd', '#c55fcd', '#c55fcd', '#c55ecd', '#c55ecd', '#c55ecc', '#c55ecc', '#c55dcc', '#c55dcc', '#c55dcb', '#c55dcb', '#c55ccb', '#c55ccb', '#c55ccb', '#c55cca', '#c55cca', '#c55bca', '#c55bca', '#c55bca', '#c55bc9', '#c55ac9', '#c55ac9', '#c65ac9', '#c65ac9', '#c659c8', '#c659c8', '#c659c8', '#c659c8', '#c659c7', '#c658c7', '#c658c7', '#c658c7', '#c658c7', '#c657c6', '#c657c6', '#c657c6', '#c657c6', '#c656c5', '#c656c5', '#c656c5', '#c656c5', '#c655c4', '#c655c4', '#c655c4', '#c655c4', '#c654c4', '#c654c3', '#c654c3', '#c654c3', '#c653c2', '#c653c2', '#c753c2', '#c753c2', '#c752c1', '#c752c1', '#c752c1', '#c752c1', '#c751c0', '#c751c0', '#c751c0', '#c751c0', '#c750bf', '#c750bf', '#c750bf', '#c74fbf', '#c74fbe', '#c74fbe', '#c74fbe', '#c74ebd', '#c74ebd', '#c74ebd', '#ff0000']
let hex_colormap = ['#00429d', '#01429d', '#01429d', '#02439d', '#03439d', '#03439d', '#04439e', '#04439e', '#05439e', '#06449e', '#06449e', '#07449e', '#08449e', '#08449e', '#09459e', '#0a459e', '#0a459e', '#0b459f', '#0b459f', '#0c459f', '#0d469f', '#0d469f', '#0e469f', '#0e469f', '#0f469f', '#0f479f', '#10479f', '#10479f', '#11479f', '#1147a0', '#1247a0', '#1248a0', '#1348a0', '#1348a0', '#1448a0', '#1448a0', '#1449a0', '#1549a0', '#1549a0', '#1649a0', '#1649a0', '#164aa1', '#174aa1', '#174aa1', '#184aa1', '#184aa1', '#184aa1', '#194ba1', '#194ba1', '#194ba1', '#1a4ba1', '#1a4ba1', '#1a4ca2', '#1b4ca2', '#1b4ca2', '#1b4ca2', '#1c4ca2', '#1c4ca2', '#1c4da2', '#1d4da2', '#1d4da2', '#1d4da2', '#1e4da2', '#1e4ea3', '#1e4ea3', '#1f4ea3', '#1f4ea3', '#1f4ea3', '#1f4fa3', '#204fa3', '#204fa3', '#204fa3', '#214fa3', '#214fa3', '#2150a3', '#2150a4', '#2250a4', '#2250a4', '#2250a4', '#2351a4', '#2351a4', '#2351a4', '#2351a4', '#2451a4', '#2452a4', '#2452a4', '#2552a4', '#2552a5', '#2552a5', '#2552a5', '#2653a5', '#2653a5', '#2653a5', '#2653a5', '#2753a5', '#2754a5', '#2754a5', '#2754a5', '#2854a6', '#2854a6', '#2854a6', '#2855a6', '#2955a6', '#2955a6', '#2955a6', '#2955a6', '#2a56a6', '#2a56a6', '#2a56a6', '#2a56a6', '#2b56a7', '#2b57a7', '#2b57a7', '#2b57a7', '#2c57a7', '#2c57a7', '#2c57a7', '#2c58a7', '#2d58a7', '#2d58a7', '#2d58a7', '#2d58a8', '#2d59a8', '#2e59a8', '#2e59a8', '#2e59a8', '#2e59a8', '#2f5aa8', '#2f5aa8', '#2f5aa8', '#2f5aa8', '#2f5aa8', '#305ba8', '#305ba9', '#305ba9', '#305ba9', '#315ba9', '#315ba9', '#315ca9', '#315ca9', '#315ca9', '#325ca9', '#325ca9', '#325da9', '#325da9', '#335daa', '#335daa', '#335daa', '#335eaa', '#335eaa', '#345eaa', '#345eaa', '#345eaa', '#345eaa', '#355faa', '#355faa', '#355fab', '#355fab', '#355fab', '#3660ab', '#3660ab', '#3660ab', '#3660ab', '#3660ab', '#3761ab', '#3761ab', '#3761ab', '#3761ab', '#3761ac', '#3862ac', '#3862ac', '#3862ac', '#3862ac', '#3862ac', '#3963ac', '#3963ac', '#3963ac', '#3963ac', '#3963ac', '#3a63ac', '#3a64ad', '#3a64ad', '#3a64ad', '#3a64ad', '#3b64ad', '#3b65ad', '#3b65ad', '#3b65ad', '#3b65ad', '#3c65ad', '#3c66ad', '#3c66ad', '#3c66ae', '#3c66ae', '#3d66ae', '#3d67ae', '#3d67ae', '#3d67ae', '#3d67ae', '#3e67ae', '#3e67ae', '#3e68ae', '#3e68ae', '#3e68ae', '#3f68af', '#3f68af', '#3f69af', '#3f69af', '#3f69af', '#3f69af', '#4069af', '#406aaf', '#406aaf', '#406aaf', '#406aaf', '#416aaf', '#416bb0', '#416bb0', '#416bb0', '#416bb0', '#426bb0', '#426cb0', '#426cb0', '#426cb0', '#426cb0', '#436cb0', '#436cb0', '#436db0', '#436db1', '#436db1', '#436db1', '#446db1', '#446eb1', '#446eb1', '#446eb1', '#446eb1', '#456eb1', '#456fb1', '#456fb1', '#456fb1', '#456fb2', '#466fb2', '#4670b2', '#4670b2', '#4670b2', '#4670b2', '#4670b2', '#4771b2', '#4771b2', '#4771b2', '#4771b2', '#4771b2', '#4771b3', '#4872b3', '#4872b3', '#4872b3', '#4872b3', '#4872b3', '#4973b3', '#4973b3', '#4973b3', '#4973b3', '#4973b3', '#4a74b4', '#4a74b4', '#4a74b4', '#4a74b4', '#4a74b4', '#4a75b4', '#4b75b4', '#4b75b4', '#4b75b4', '#4b75b4', '#4b76b4', '#4b76b4', '#4c76b4', '#4c76b5', '#4c76b5', '#4c77b5', '#4c77b5', '#4d77b5', '#4d77b5', '#4d77b5', '#4d78b5', '#4d78b5', '#4d78b5', '#4e78b5', '#4e78b5', '#4e79b6', '#4e79b6', '#4e79b6', '#4f79b6', '#4f79b6', '#4f79b6', '#4f7ab6', '#4f7ab6', '#4f7ab6', '#507ab6', '#507ab6', '#507bb6', '#507bb7', '#507bb7', '#507bb7', '#517bb7', '#517cb7', '#517cb7', '#517cb7', '#517cb7', '#527cb7', '#527db7', '#527db7', '#527db7', '#527db8', '#527db8', '#537eb8', '#537eb8', '#537eb8', '#537eb8', '#537eb8', '#537fb8', '#547fb8', '#547fb8', '#547fb8', '#547fb8', '#5480b9', '#5580b9', '#5580b9', '#5580b9', '#5580b9', '#5581b9', '#5581b9', '#5681b9', '#5681b9', '#5681b9', '#5682b9', '#5682b9', '#5682b9', '#5782ba', '#5782ba', '#5783ba', '#5783ba', '#5783ba', '#5783ba', '#5883ba', '#5883ba', '#5884ba', '#5884ba', '#5884ba', '#5984ba', '#5985bb', '#5985bb', '#5985bb', '#5985bb', '#5985bb', '#5a85bb', '#5a86bb', '#5a86bb', '#5a86bb', '#5a86bb', '#5a86bb', '#5b87bb', '#5b87bb', '#5b87bc', '#5b87bc', '#5b87bc', '#5b88bc', '#5c88bc', '#5c88bc', '#5c88bc', '#5c88bc', '#5c89bc', '#5c89bc', '#5d89bc', '#5d89bc', '#5d89bd', '#5d8abd', '#5d8abd', '#5e8abd', '#5e8abd', '#5e8abd', '#5e8bbd', '#5e8bbd', '#5e8bbd', '#5f8bbd', '#5f8bbd', '#5f8cbd', '#5f8cbd', '#5f8cbe', '#5f8cbe', '#608cbe', '#608dbe', '#608dbe', '#608dbe', '#608dbe', '#608dbe', '#618ebe', '#618ebe', '#618ebe', '#618ebe', '#618ebf', '#628fbf', '#628fbf', '#628fbf', '#628fbf', '#628fbf', '#6290bf', '#6390bf', '#6390bf', '#6390bf', '#6390bf', '#6391bf', '#6391bf', '#6491c0', '#6491c0', '#6491c0', '#6492c0', '#6492c0', '#6492c0', '#6592c0', '#6592c0', '#6593c0', '#6593c0', '#6593c0', '#6593c0', '#6693c1', '#6694c1', '#6694c1', '#6694c1', '#6694c1', '#6794c1', '#6795c1', '#6795c1', '#6795c1', '#6795c1', '#6795c1', '#6896c1', '#6896c1', '#6896c2', '#6896c2', '#6896c2', '#6897c2', '#6997c2', '#6997c2', '#6997c2', '#6997c2', '#6998c2', '#6a98c2', '#6a98c2', '#6a98c2', '#6a98c2', '#6a99c3', '#6a99c3', '#6b99c3', '#6b99c3', '#6b99c3', '#6b9ac3', '#6b9ac3', '#6b9ac3', '#6c9ac3', '#6c9ac3', '#6c9bc3', '#6c9bc3', '#6c9bc3', '#6d9bc4', '#6d9bc4', '#6d9cc4', '#6d9cc4', '#6d9cc4', '#6d9cc4', '#6e9cc4', '#6e9dc4', '#6e9dc4', '#6e9dc4', '#6e9dc4', '#6e9dc4', '#6f9ec4', '#6f9ec5', '#6f9ec5', '#6f9ec5', '#6f9ec5', '#6f9fc5', '#709fc5', '#709fc5', '#709fc5', '#709fc5', '#70a0c5', '#71a0c5', '#71a0c5', '#71a0c5', '#71a0c6', '#71a1c6', '#71a1c6', '#72a1c6', '#72a1c6', '#72a1c6', '#72a2c6', '#72a2c6', '#73a2c6', '#73a2c6', '#73a2c6', '#73a3c6', '#73a3c6', '#73a3c7', '#74a3c7', '#74a3c7', '#74a4c7', '#74a4c7', '#74a4c7', '#74a4c7', '#75a4c7', '#75a5c7', '#75a5c7', '#75a5c7', '#75a5c7', '#76a5c7', '#76a6c8', '#76a6c8', '#76a6c8', '#76a6c8', '#76a6c8', '#77a7c8', '#77a7c8', '#77a7c8', '#77a7c8', '#77a7c8', '#78a8c8', '#78a8c8', '#78a8c8', '#78a8c8', '#78a8c9', '#78a9c9', '#79a9c9', '#79a9c9', '#79a9c9', '#79a9c9', '#79aac9', '#7aaac9', '#7aaac9', '#7aaac9', '#7aaac9', '#7aabc9', '#7aabc9', '#7babca', '#7babca', '#7babca', '#7bacca', '#7bacca', '#7cacca', '#7cacca', '#7cacca', '#7cadca', '#7cadca', '#7cadca', '#7dadca', '#7dadca', '#7daeca', '#7daecb', '#7daecb', '#7eaecb', '#7eaecb', '#7eafcb', '#7eafcb', '#7eafcb', '#7fafcb', '#7fafcb', '#7fb0cb', '#7fb0cb', '#7fb0cb', '#7fb0cb', '#80b0cc', '#80b1cc', '#80b1cc', '#80b1cc', '#80b1cc', '#81b1cc', '#81b2cc', '#81b2cc', '#81b2cc', '#81b2cc', '#82b2cc', '#82b3cc', '#82b3cc', '#82b3cc', '#82b3cd', '#82b4cd', '#83b4cd', '#83b4cd', '#83b4cd', '#83b4cd', '#83b4cd', '#84b5cd', '#84b5cd', '#84b5cd', '#84b5cd', '#84b6cd', '#85b6cd', '#85b6cd', '#85b6ce', '#85b6ce', '#85b6ce', '#86b7ce', '#86b7ce', '#86b7ce', '#86b7ce', '#86b8ce', '#86b8ce', '#87b8ce', '#87b8ce', '#87b8ce', '#87b9ce', '#87b9ce', '#88b9cf', '#88b9cf', '#88b9cf', '#88bacf', '#88bacf', '#89bacf', '#89bacf', '#89bacf', '#89bbcf', '#89bbcf', '#8abbcf', '#8abbcf', '#8abbcf', '#8abccf', '#8abcd0', '#8bbcd0', '#8bbcd0', '#8bbcd0', '#8bbdd0', '#8bbdd0', '#8cbdd0', '#8cbdd0', '#8cbdd0', '#8cbed0', '#8cbed0', '#8dbed0', '#8dbed0', '#8dbed0', '#8dbfd1', '#8dbfd1', '#8ebfd1', '#8ebfd1', '#8ebfd1', '#8ec0d1', '#8ec0d1', '#8fc0d1', '#8fc0d1', '#8fc0d1', '#8fc1d1', '#8fc1d1', '#90c1d1', '#90c1d1', '#90c1d1', '#90c2d2', '#90c2d2', '#91c2d2', '#91c2d2', '#91c2d2', '#91c3d2', '#91c3d2', '#92c3d2', '#92c3d2', '#92c3d2', '#92c4d2', '#92c4d2', '#93c4d2', '#93c4d2', '#93c4d3', '#93c5d3', '#93c5d3', '#94c5d3', '#94c5d3', '#94c5d3', '#94c6d3', '#94c6d3', '#95c6d3', '#95c6d3', '#95c6d3', '#95c7d3', '#95c7d3', '#96c7d3', '#96c7d3', '#96c7d4', '#96c8d4', '#97c8d4', '#97c8d4', '#97c8d4', '#97c8d4', '#97c9d4', '#98c9d4', '#98c9d4', '#98c9d4', '#98c9d4', '#98cad4', '#99cad4', '#99cad4', '#99cad4', '#99cad5', '#9acbd5', '#9acbd5', '#9acbd5', '#9acbd5', '#9acbd5', '#9bccd5', '#9bccd5', '#9bccd5', '#9bccd5', '#9bccd5', '#9ccdd5', '#9ccdd5', '#9ccdd5', '#9ccdd5', '#9dcdd6', '#9dced6', '#9dced6', '#9dced6', '#9dced6', '#9eced6', '#9ecfd6', '#9ecfd6', '#9ecfd6', '#9ecfd6', '#9fcfd6', '#9fd0d6', '#9fd0d6', '#9fd0d6', '#a0d0d6', '#a0d0d6', '#a0d1d7', '#a0d1d7', '#a0d1d7', '#a1d1d7', '#a1d1d7', '#a1d2d7', '#a1d2d7', '#a2d2d7', '#a2d2d7', '#a2d2d7', '#a2d3d7', '#a3d3d7', '#a3d3d7', '#a3d3d7', '#a3d3d7', '#a3d4d7', '#a4d4d8', '#a4d4d8', '#a4d4d8', '#a4d4d8', '#a5d5d8', '#a5d5d8', '#a5d5d8', '#a5d5d8', '#a5d5d8', '#a6d6d8', '#a6d6d8', '#a6d6d8', '#a6d6d8', '#a7d6d8', '#a7d7d8', '#a7d7d8', '#a7d7d9', '#a8d7d9', '#a8d7d9', '#a8d8d9', '#a8d8d9', '#a9d8d9', '#a9d8d9', '#a9d8d9', '#a9d9d9', '#a9d9d9', '#aad9d9', '#aad9d9', '#aad9d9', '#aadad9', '#abdad9', '#abdad9', '#abdad9', '#abdada', '#acdbda', '#acdbda', '#acdbda', '#acdbda', '#addbda', '#addcda', '#addcda', '#addcda', '#aedcda', '#aedcda', '#aeddda', '#aeddda', '#afddda', '#afddda', '#afddda', '#afdeda', '#b0dedb', '#b0dedb', '#b0dedb', '#b0dedb', '#b1dedb', '#b1dfdb', '#b1dfdb', '#b1dfdb', '#b2dfdb', '#b2dfdb', '#b2e0db', '#b2e0db', '#b3e0db', '#b3e0db', '#b3e0db', '#b3e1db', '#b4e1db', '#b4e1db', '#b4e1dc', '#b4e1dc', '#b5e2dc', '#b5e2dc', '#b5e2dc', '#b6e2dc', '#b6e2dc', '#b6e3dc', '#b6e3dc', '#b7e3dc', '#b7e3dc', '#b7e3dc', '#b7e4dc', '#b8e4dc', '#b8e4dc', '#b8e4dc', '#b8e4dc', '#b9e5dc', '#b9e5dd', '#b9e5dd', '#bae5dd', '#bae5dd', '#bae5dd', '#bae6dd', '#bbe6dd', '#bbe6dd', '#bbe6dd', '#bbe6dd', '#bce7dd', '#bce7dd', '#bce7dd', '#bde7dd', '#bde7dd', '#bde8dd', '#bde8dd', '#bee8dd', '#bee8dd', '#bee8dd', '#bfe9de', '#bfe9de', '#bfe9de', '#bfe9de', '#c0e9de', '#c0e9de', '#c0eade', '#c1eade', '#c1eade', '#c1eade', '#c1eade', '#c2ebde', '#c2ebde', '#c2ebde', '#c3ebde', '#c3ebde', '#c3ecde', '#c4ecde', '#c4ecde', '#c4ecde', '#c5ecde', '#c5ecdf', '#c5eddf', '#c5eddf', '#c6eddf', '#c6eddf', '#c6eddf', '#c7eedf', '#c7eedf', '#c7eedf', '#c8eedf', '#c8eedf', '#c8efdf', '#c8efdf', '#c9efdf', '#c9efdf', '#c9efdf', '#caefdf', '#caf0df', '#caf0df', '#cbf0df', '#cbf0df', '#cbf0df', '#ccf0df', '#ccf1e0', '#ccf1e0', '#cdf1e0', '#cdf1e0', '#cdf1e0', '#cef2e0', '#cef2e0', '#cef2e0', '#cff2e0', '#cff2e0', '#cff2e0', '#d0f3e0', '#d0f3e0', '#d0f3e0', '#d1f3e0', '#d1f3e0', '#d2f4e0', '#d2f4e0', '#d2f4e0', '#d3f4e0', '#d3f4e0', '#d3f4e0', '#d4f5e0', '#d4f5e0', '#d4f5e0', '#d5f5e0', '#d5f5e0', '#d6f5e0', '#d6f6e0', '#d6f6e1', '#d7f6e1', '#d7f6e1', '#d7f6e1', '#d8f6e1', '#d8f7e1', '#d9f7e1', '#d9f7e1', '#d9f7e1', '#daf7e1', '#daf7e1', '#dbf8e1', '#dbf8e1', '#dbf8e1', '#dcf8e1', '#dcf8e1', '#ddf8e1', '#ddf9e1', '#ddf9e1', '#def9e1', '#def9e1', '#dff9e1', '#dff9e1', '#e0f9e1', '#e0fae1', '#e0fae1', '#e1fae1', '#e1fae1', '#e2fae1', '#e2fae1', '#e3fbe1', '#e3fbe1', '#e4fbe1', '#e4fbe1', '#e5fbe1', '#e5fbe1', '#e6fbe1', '#e6fce1', '#e7fce1', '#e7fce1', '#e8fce1', '#e8fce1', '#e9fce1', '#e9fce1', '#eafce1', '#eafde1', '#ebfde1', '#ebfde1', '#ecfde1', '#ecfde1', '#edfde1', '#edfde1', '#eefde1', '#effee1', '#effee1', '#f0fee1', '#f0fee1', '#f1fee1', '#f2fee1', '#f2fee1', '#f3fee1', '#f4fee1', '#f4fee1', '#f5ffe1', '#f6ffe1', '#f6ffe1', '#f7ffe1', '#f8ffe1', '#f9ffe1', '#f9ffe1', '#faffe0', '#fbffe0', '#fcffe0', '#fdffe0', '#feffe0', '#ffffe0']
let color_scale = []
for (let i = 0; i < hex_colormap2.length; i++) {
    for (let j = 0; j < 11; j++) {
        let rgb = (hexToRgb(hex_colormap2[i]));
        let r = rgb.r / 255;
        let g = rgb.g / 255;
        let b = rgb.b / 255;
        color_scale.push([r, g, b]);
    }
}
console.log(color_scale);
console.log(color_scale.length);