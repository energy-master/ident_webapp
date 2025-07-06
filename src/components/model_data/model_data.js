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
    },
    {
        field: 'target',
        headerName: 'Target',
        width: 150,
        editable: false,
    },
    {
        field: 'study_focus',
        headerName: 'Study Focus',
        width: 150,
        editable: false,
    },
    {
        field: 'environment_name',
        headerName: 'DM Env',
        width: 150,
        editable: false,
    }

];



function ModelData(props) {

    // const rows = [
    //     {
    //         "id" : 1, "name": "hp_alpha", "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]", "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.", "environment_name": "smooth_temporal", "target": "hp_click"
    //     },
    //     {
    //         "id": 2,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     },
    //     {
    //         "id": 3,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     },
    //     {
    //         "id": 4,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     },
    //     {
    //         "id": 5,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     },
    //     {
    //         "id": 6,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     },
    //     {
    //         "id": 7,
    //         "name": "hp_alpha",
    //         "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
    //         "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
    //         "environment_name": "smooth_temporal",
    //         "target": "hp_click"
    //     }
    // ]


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