import * as React from 'react';
import { useDispatch } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import './model_data.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propsStateInitializer } from '@mui/x-data-grid/internals';

let columns = [
    {
        field: 'name', headerName: 'Model ID', width: 300,
        editable: false,
        flex:1
    }
    // {
    //     field: 'target',
    //     headerName: 'Target',
    //     width: 150,
    //     editable: false,
    //     flex: 1
    // },
    // {
    //     field: 'study_focus',
    //     headerName: 'Study Focus',
    //     width: 150,
    //     editable: false,
    //     flex: 1
    // },
    // {
    //     field: 'environment_name',
    //     headerName: 'DM Env',
    //     width: 150,
    //     editable: false,
    //     flex: 1
    // }

];


function ModelData(props) {

    const dispatch = useDispatch();

    //let rows = props.model_list;
    let model_id_data = [];
    let rows = props.model_list;
    console.log(rows);
    const getModelList = () => {

        const formData = new FormData();
        let config = {};
        // grab model list
        let url = "https://marlin-network.hopto.org/cgi-bin/get_model_ids.php";
        axios.post(url, formData, config).then((response) => {

            // console.log(response);
            model_id_data = response.data;
            console.log(response.data);
            // start data polling
            buildRows(model_id_data);

        });

        

    }

    const buildRows = (data) => {
        console.log(model_id_data);
        rows = [];
        for (let i = 0; i < (data.length); i++){
            console.log(data[i]);
            rows.push({
                
                    "id": i,
                    "name": data[i]
                    // "study_focus": "Investigate the adaption of duration of activation times in searching for HP clicks. Simply Energy Spikes of energy peaks at high res time ( with temporal element ) Active when within threshold. Starting with low spike energy percentages.[VectorEnergySpike] &[VectorEnergySpikeTemporal]",
                    // "training_set_description": "sim_ids = [7430472924515043056643,896731126311732357710735] -  initial low s/n. Repeat of earlier work.",
                    // "environment_name": "smooth_temporal",
                    // "target": "hp_click"
                
            });

            
        }

        dispatch({ type: "MODELS_LOADED" , payload: rows });

    }   

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        console.log(params);
        dispatch({ type: "MODEL_SELECTED", payload: params['row']['name']});
    };
      

    if (rows.length < 2) { 
        getModelList();
    }
    
    let selected_models = props.selected_models;
   
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
    model_list: state.models,
    selected_models : state.selected_models
})


const ConnectedModelData = connect(mapStateToProps)(ModelData);

export default ConnectedModelData