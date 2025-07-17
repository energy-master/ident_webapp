import * as React from 'react';
import { connect } from 'react-redux';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';

import './results_data.css';
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
        field: 'frame_number', headerName:'Frame Number', width: 90,
        editable: false,
        flex:1
    },
    {
        field: 'time',
        headerName: 'Time',
        width: 150,
        editable: false,
        flex:1
    },
    {
        field: 'number_hits',
        headerName: 'Number Hits',
        width: 100,
        editable: false,
        flex:1
    },
    {
        field: 'probability',
        headerName: 'Probability',
        width: 150,
        editable: false,
        flex:1
    }

   
];

// const rows = [
   
// ];

function ModelResults(props) {
    
    let rows = props.model_results;
    // console.log(props.model_results);
    //borderColor:'primary.light'
    return (

        <div className='results_data'>
            {/* <Card variant="outlined">
                <CardHeader
                    title='Audio file data'>
                </CardHeader>
                <CardContent> */}
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                <Box sx={{ width: '100%',paddingtop: 0 }}>
                    <Typography variant="h6" gutterBottom>
                        <span className='panel-header'>Activity</span>
                    </Typography></Box>


                <DataGrid
                    sx={{ m: 0, fontSize: 10 , minWidth:'100%'}}
                    rows={rows}
                    columns={columns}
                    hideFooter
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 100,
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
    model_results: state.results_summary
})


const ConnectedModelResults = connect(mapStateToProps)(ModelResults);

export default ConnectedModelResults;