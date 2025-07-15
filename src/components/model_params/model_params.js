import * as React from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';


import './model_params.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import LinearProgress from '@mui/material/LinearProgress';
// const getTheme = (mode) =>
//     createTheme({
//         palette: {
//             mode,
//             DataGrid: {
//                 bg: mode === 'light' ? '#f8fafc' : '#334155',
//                 pinnedBg: mode === 'light' ? '#f1f5f9' : '#293548',
//                 headerBg: mode === 'light' ? '#eaeff5' : '#1e293b',
//             },
//         },
//     });






function ModelParams(props) {

    const dispatch = useDispatch();
    
    const renderModelRunButton = () => {
        return (
            <strong>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={(event) => {

                        console.log(props)
                        // submit Run
                        event.preventDefault()
                        const url = 'https://marlin-network.hopto.org/cgi-bin/run_live.php';
                        const formData = new FormData();
                        console.log(props.acousticFile.fileName);
                        formData.append('fileName', props.acousticFile.fileName);
                        formData.append('model_id', props.model_parameters[0].model_id);
                        formData.append('user_uid', '0001vixen');
                        formData.append('ratio_active', props.model_parameters[0].ratio_active);
                        formData.append('number_bots', props.model_parameters[0].numberBots);
                        formData.append('activation-level', props.model_parameters[0].activation_level);
                        formData.append('target', props.model_parameters[0].target);
                        formData.append('similarity_threshold', props.model_parameters[0].similarity_threshold);
                        formData.append('streaming_window', props.model_parameters[0].window_stream);
                        formData.append('delta_t', props.model_parameters[0].delta_t);
                        formData.append('nfft', props.model_parameters[0].nfft);
                        let config = {};
                        console.log('start');

                        // start data polling
                        dispatch({ type: "START_POLLING" })

                        // dispatch({ type: 'RUN_STARTED' })
                        // axios.post(url, formData, config).then((response) => {
                           
                        //     console.log(response);
                        //     // start data polling
                        //     dispatch({ type: "STOP_POLLING" })
                        //     dispatch({ type: 'RUN_FINISHED'})

                        // });


                    }}
                >
                    {props.model_parameters[0].run_title}
                    
                </Button>
            </strong>
        )
    }

    const renderModelDownloadButton = () => {
        // console.log(props.model_parameters[0].percentage_complete);
        return (
            <strong>
                {props.model_parameters[0].status == "Complete." ?
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => {
                            console.log(props)
                            let dl_path = '/marlin_live_data/dump/out/' + props.model_parameters[0].model_id + '.zip';
                            const link = document.createElement("a");
                            link.download = props.model_parameters[0].model_id + '.zip';
                            link.href = dl_path;
                            link.click();
                            
                        }}
                    >
                        Download
                    </Button> : null
                   

                    }
            </strong>
        )
    }

    const columns = [
        {
            field: 'delta_t', headerName: 'Delta T (s)', width: 90,
            editable: true,
        },
        {
            field: 'model_id',
            headerName: 'Model ID',
            width: 150,
            editable: true,
        },
        {
            field: 'numberBots',
            headerName: 'Number Bots',
            width: 150,
            editable: true,
        },
        {
            field: 'nfft',
            headerName: 'nfft',
            width: 150,
            editable: true,
        },
        {
            field: 'window_stream',
            headerName: 'Stream Window',
            width: 150,
            editable: false,
        },
        {
            field: 'run_button',
            headerName: '',
            width: 150,
            renderCell: renderModelRunButton,
            disableClickEventBubbling: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            disableClickEventBubbling: true,
        },
        {
            field: 'download',
            headerName: 'Download',
            width: 150,
            disableClickEventBubbling: true,
            renderCell: renderModelDownloadButton
        },


    ];
    

    const processRowUpdate = (newRow) => {

        const updatedRow = { ...newRow, isNew: false };
        
        updatedRow.id = parseInt(updatedRow.id);
        updatedRow.model_id = String(updatedRow.model_id);
        updatedRow.numberBots = parseInt(updatedRow.numberBots);
        updatedRow.delta_t = parseFloat(updatedRow.delta_t);
        updatedRow.nfft = parseInt(updatedRow.nfft);
        updatedRow.window_stream = parseInt(updatedRow.window_stream);
        //handle send data to api

        // console.log(updatedRow);
        dispatch({type:"MODEL_PARMS_UPDATE", payload : updatedRow})

        // return to datagrid
        return updatedRow;

    }

    let rows = props.model_parameters;
    
    return (

        <div className='model_params'>
            {/* <Card variant="outlined">
                <CardHeader
                    title='Audio file data'>
                </CardHeader>
                <CardContent> */}
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                <Box sx={{ width: '100%', maxWidth: 500, paddingtop: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        <span className='panel-header'>Model Parameters</span>
                    </Typography></Box>


                <DataGrid
                    sx={{ m: 0, fontSize: 10 }}
                    rows={rows}
                    columns={columns}
                    hideFooter
                    processRowUpdate={processRowUpdate}
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
                />
                {/* </ThemeProvider> */}
            </Stack>
            {/* </CardContent>
            </Card> */}
        </div>
    );
}



const mapStateToProps = (state) => ({
    model_parameters: state.model_parameters,
    acousticFile: state.acousticFileData
})

// const ConnectedFileDataGrid = connect((state) => {
//     console.log('drawing file data grid');
//     return { fileName: state.acousticFileData.fileName };
// })(IDentFileDataGrid);

const ConnectedModelParams = connect(mapStateToProps)(ModelParams);

export default ConnectedModelParams;