

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


let columns = [

    {
        field: 'name', headerName: 'Filename', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr'
    }


];

let last_stream_location = "";

function StreamFiles(props) {

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
                // console.log(response.data);
                // start data polling
                let file_list = [];
                for (let j = 0; j < stream_data['streams'].length; j++){
                    // console.log(stream_data['streams'][j]);
                    if (selected_stream_tag in stream_data['streams'][j])
                    {
                        file_list = stream_data['streams'][j][selected_stream_tag];
                    }
                }
                // console.log(file_list);
                buildRows(file_list);

            });

        

    }

    const buildRows = (data) => {
        
        rows = [];
        for (let i = 0; i < (data.length); i++) {
            // console.log(data[i]);
            rows.push({

                "id": i,
                "name": data[i]
                
        
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
        dispatch({ type: "FILE_SELECTED", payload: params['row']['name'] });
        
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
                        }
                    }}
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
    selected_stream: state.selected_stream
})


const ConnectedStreamFiles = connect(mapStateToProps)(StreamFiles);

export default ConnectedStreamFiles