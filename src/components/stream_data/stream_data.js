

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import './stream_data.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propsStateInitializer } from '@mui/x-data-grid/internals';


let columns = [

    {
        field: 'name', headerName: 'Stream ID', width: 300,
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


function StreamData(props) {

    const dispatch = useDispatch();
    console.log('stream update');
    //let rows = props.model_list;
    let stream_id_data = [];
    let rows = props.stream_list;
    // console.log(rows);
    const getStreamList = () => {

        const formData = new FormData();
        let config = {};
        // grab model list
        let url = "https://marlin-network.hopto.org/cgi-bin/get_data_streams.php";
        axios.post(url, formData, config).then((response) => {
            
            // console.log(response);
            let stream_data = response.data;
            console.log(stream_data['detections']);
            dispatch({ type: "DETECTIONS_LOADED", payload: stream_data['detections'] });
            dispatch({ type: "ACTIVE_MODELS_LOADED", payload: stream_data['models'] });
            dispatch({ type: "FILEDATA_LOADED", payload: stream_data['file_data'] });
            dispatch({ type: "ORDERED_STREAM", payload: stream_data['ordered']});
            

            // console.log(response.data);
            // start data polling
            buildRows(stream_data['stream_ids']);



        });



    }

    const buildRows = (data) => {
        
        rows = [];
        for (let i = 0; i < (data.length); i++) {
            console.log(data[i]);
            rows.push({

                "id": i,
                "name": data[i]
        
            });
        }

        rows.push({
            "id": data.length,
            "name": "Saved Files"
        });

        dispatch({ type: "STREAMS_LOADED", payload: rows });
        
        
       

    }

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        console.log(params);
        dispatch({ type: "STREAM_SELECTED", payload: params['row']['name'] });

        // first filename in order & timestamp
        // this is for a stream env
        if (props.ordered_files.hasOwnProperty([params['row']['name']])) {
            if (props.ordered_files[params['row']['name']].length > 0) {
                let f_file = props.ordered_files[params['row']['name']][0].filename;
                let t_ts = props.ordered_files[params['row']['name']][0]["datetime"]["date"];
                dispatch({ type: "FILE_SELECTED", payload: { 'name': f_file, 'timestamp': t_ts, 'active_stream' : props.selected_stream } });
            }
        }
        else {
            //update ordered_files for one file
            dispatch({ type: "SINGLE_FILE_SELECTED" });
        }
        //single file
        

        
    };


    if (rows.length < 2) {
        getStreamList();
    }

    let selected_streams = props.selected_stream;

    return (

        <div className='stream_data'>
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
                   
                    sx={
                        {
                            m: 0, fontSize: 11, bgcolor: '#292D39', color: '#818698', bg: '#292D39', color: '#8C92A4', fontWeight: 'bold', '& .dataHdr':
                            {
                            backgroundColor: '#292D39', color: '#8C92A4', fontWeight: 'bold'
                            },'& .MuiTablePagination-root': {
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
                    // checkboxSelection
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
    stream_list: state.streams,
    selected_stream: state.selected_stream,
    ordered_files: state.ordered_stream_files
})


const ConnectedStreamData = connect(mapStateToProps)(StreamData);

export default ConnectedStreamData