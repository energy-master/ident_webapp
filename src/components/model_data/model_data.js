import * as React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import './model_data.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propsStateInitializer } from '@mui/x-data-grid/internals';

const columns = [
    {
        field: 'name', headerName: 'ID', width: 90,
        editable: false,
        flex:1
    },
    {
        field: 'target',
        headerName: 'Target',
        width: 150,
        editable: false,
        flex: 1
    },
    {
        field: 'study_focus',
        headerName: 'Study Focus',
        width: 150,
        editable: false,
        flex: 1
    },
    {
        field: 'environment_name',
        headerName: 'DM Env',
        width: 150,
        editable: false,
        flex: 1
    }

];



function ModelData(props) {

    let rows = props.model_list;

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
                        <span className='panel-header'>Select Model(s)</span>
                    </Typography></Box>


                <DataGrid
                    sx={{ m: 0, fontSize: 10, minWidth: '100%' }}
                    rows={rows}
                    columns={columns}
                    hideFooter
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
                    checkboxSelection
                />
                {/* </ThemeProvider> */}
            </Stack>
            {/* </CardContent>
            </Card> */}
        </div>
    );
}


const mapStateToProps = (state) => ({
    model_list : state.models
})

// const ConnectedFileDataGrid = connect((state) => {
//     console.log('drawing file data grid');
//     return { fileName: state.acousticFileData.fileName };
// })(IDentFileDataGrid);

const ConnectedModelData = connect(mapStateToProps)(ModelData);

export default ConnectedModelData