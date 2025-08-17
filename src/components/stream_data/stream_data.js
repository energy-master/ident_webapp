

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
        headerClassName:'dataHdr'
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
            console.log(response.data);
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
    selected_stream: state.selected_stream
})


const ConnectedStreamData = connect(mapStateToProps)(StreamData);

export default ConnectedStreamData