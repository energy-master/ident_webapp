

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


let columns = [
    
    {
        field: 'name', headerName: 'Filename', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
    {
        field: 'time', headerName: 'Time', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
    {
        field: 'detection', headerName: 'Detection', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
         renderCell: (params) => (
                    <Typography variant="overline" sx={{ color:'white' }}>
                                {params.value}
                    </Typography>
                ),
    }



];

let last_stream_location = "";

function StreamFiles(props) {

    
    
    console.log(props.detections);
    const dispatch = useDispatch();

    //let rows = props.model_list;
    let stream_id_data = [];
    let rows = props.stream_files;
    // console.log(rows);
    console.log("Grabbing Files");
    const getStreamFiles = () => {
        

        if (selected_stream_tag == last_stream_location){
            return;
        }
        
        console.log("axios");
            last_stream_location = selected_stream_tag;
            const formData = new FormData();
            let config = {};
        // grab model list
           
        let url = "https://marlin-network.hopto.org/cgi-bin/get_data_streams.php";
        let file_url = "/media/marlin/Elements41/marlin_live/streams/"+ selected_stream_tag;
            if (selected_stream_tag == "Saved Files") {
                url = "https://marlin-network.hopto.org/cgi-bin/get_saved_audio.php";
                file_url = "/media/marlin/Elements41/marlin_live";
                selected_stream_tag = "saved_files";
            }

            dispatch({ type: "FILE_PATH_SELECTED", payload: file_url });
        
            
        
            axios.post(url, formData, config).then((response) => {

                // console.log(response);
                let stream_data = response.data;
                console.log(response.data);
                // start data polling
                let file_list = [];
                let file_data = [];
                console.log(selected_stream_tag);
                if (selected_stream_tag != 'saved_files') {
                    
                
                    for (let j = 0; j < stream_data['streams'].length; j++) {
                        // console.log(stream_data['streams'][j]);
                        // if (selected_stream_tag in stream_data['streams'][j])
                        // {
                        //     //file_list = stream_data['streams'][j][selected_stream_tag];
                        
                        // }
                        if (selected_stream_tag in stream_data['ordered']) {
                            file_data = stream_data['ordered'][selected_stream_tag];
                        }


                    }
                    buildRows(file_data, props.detections[selected_stream_tag]);
                }
                else {
                    for (let j = 0; j < stream_data['streams'][0]['saved_files'].length; j++){
                        file_data.push({
                            "filename": stream_data['streams'][0][selected_stream_tag][j],
                            "datetime": {
                                "data": "not_streaming"
                            }
                        });
                        // file_data = stream_data['streams'][0]['saved_files'];
                        console.log(file_data);
                    }
                   
                    buildRows(file_data, []);
                }

                // console.log(file_list);
                

            });

        

    }

    const buildRows = (data, detections) => {
        
        rows = [];
        console.log(detections);
        for (let i = 0; i < (data.length); i++) {
            console.log(data[i]);

            // detection logic
            let root_fn = data[i]['filename'].split('.')[0];
            let detection_present = false;
            let number_detections = 0;
            for (let i = 0; i < detections.length; i++){
                // console.log(detections[i].file_root, root_fn);
                if (detections[i].file_root == root_fn) {
                    detection_present = true;
                    number_detections += 1;
                }
            }

            rows.push({

                "id": i,
                "name": data[i]['filename'],
                "time": data[i]['datetime']['date'],
                "detection" : detection_present ? `[${number_detections} detection(s).]`:''
                
        
            });


        }
        // console.log(rows);
        dispatch({ type: "STREAM_FILES_LOADED", payload: rows });
        

    }

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {

        console.log(params);
        dispatch({ type: "FILE_SELECTED", payload: { 'name': params['row']['name'], 'timestamp': params['row']['time'], 'active_stream' : props.selected_stream[0] } } );

        // gsap.to(camera.position, { x: 10, y: 5, z: 0, duration: 1 });
        // gsap.to(camera.rotation, { x: Math.PI / 4, duration: 1 });


    };
    let selected_stream_tag = "";
    // console.log(props.selected_stream);

    if (props.selected_stream.length > 0) {
        // console.log(props.selected_stream);
        selected_stream_tag = props.selected_stream[0];
        // console.log(selected_stream_tag);
        getStreamFiles();

    }


    

    return (

        <div className='model_data'>
            {/* <Card variant="outlined">
                <CardHeader
                    title='Audio file data'>
                </CardHeader>
                <CardContent> */}
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                <Box sx={{ width: '100%', paddingtop: 0 }}>
                    <Typography variant="h6" gutterBottom>
                        {/* <span className='panel-header'>Connect to Stream</span> */}
                    </Typography></Box>


                <DataGrid
                    sx={{
                        m: 0, fontSize: 11, bgcolor: '#292D39', color: '#818698', bg: '#292D39', color: '#8C92A4', fontWeight: 'bold', '& .dataHdr': {
                            backgroundColor: '#292D39', color: '#8C92A4', fontWeight: 'bold'
                        }, '& .MuiTablePagination-root': {
                            // Styles for the root of the pagination component
                            color: 'primary.main',
                        },
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            // Styles for the "Rows per page" label and displayed rows count
                            fontSize: '1.0rem',
                            color: 'primary.main'
                        },
                        // Add more specific selectors for other elements within pagination

                    }
                    }
                    rows={rows}
                    columns={columns}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                        pinnedColumns: {
                            left: ['id'],
                        },
                    }}
                    pinnedRows={{
                        bottom: [rows[0]],
                    }}
                    //checkboxSelection
                    onRowClick={modelRow_clicked} // here
                />
                {/* </ThemeProvider> */}
            </Stack>
            {/* </CardContent>
            </Card> */}
        </div>
    );
}


const mapStateToProps = (state) => ({
    stream_files: state.stream_files,
    selected_stream: state.selected_stream,
    detections: state.detections
})


const ConnectedStreamFiles = connect(mapStateToProps)(StreamFiles);

export default ConnectedStreamFiles