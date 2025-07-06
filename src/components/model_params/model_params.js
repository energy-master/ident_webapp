import * as React from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';

import './model_params.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
    }


];




function ModelParams(props) {

    const dispatch = useDispatch();
    
    const processRowUpdate = (newRow) => {

        const updatedRow = { ...newRow, isNew: false };
        
        updatedRow.id = parseInt(updatedRow.id);
        updatedRow.model_id = String(updatedRow.model_id);
        updatedRow.numberBots = parseInt(updatedRow.numberBots);
        updatedRow.delta_t = parseFloat(updatedRow.delta_t);
        updatedRow.nfft = parseInt(updatedRow.nfft);
        updatedRow.window_stream = parseInt(updatedRow.window_stream);
        //handle send data to api

        console.log(updatedRow);
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
    model_parameters : state.model_parameters
})

// const ConnectedFileDataGrid = connect((state) => {
//     console.log('drawing file data grid');
//     return { fileName: state.acousticFileData.fileName };
// })(IDentFileDataGrid);

const ConnectedModelParams = connect(mapStateToProps)(ModelParams);

export default ConnectedModelParams;