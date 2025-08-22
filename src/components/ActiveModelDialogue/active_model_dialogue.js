

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
        field: 'modelName', headerName: 'Model', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
        renderCell: (params) => (
            <Typography variant="overline" sx={{ color: 'white' }}>
                {params.value}
            </Typography>
        ),
    },
  



];

let last_stream_location = "";

function ActiveModelDialogue(props) {



    
    const dispatch = useDispatch();
    let rows = props.active_models_rows;
    let selected_stream_tag = "";
   
    let checked_rows = [];
   
    const buildRows = (data) => {

        rows = [];
        
        for (let i = 0; i < (data.length); i++) {
           

            checked_rows.push(i);
            rows.push({

                "id": i,
                "modelName" : data[i]

            });


        }
        // console.log(rows);
        //dispatch({ type: "ACTIVE_MODELS_TABLE_BUILT", payload: rows });


    }

    const modelRow_clicked = (
        params, // GridRowParams
        event, // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {

        console.log(params);
        dispatch({ type: "VIEW_MODEL_CLICKED", payload: params['row']['modelName'] });

        // gsap.to(camera.position, { x: 10, y: 5, z: 0, duration: 1 });
        // gsap.to(camera.rotation, { x: Math.PI / 4, duration: 1 });


    };
    
    // console.log(props.selected_stream);
    if (props.selected_stream.length > 0) {
        selected_stream_tag = props.selected_stream[0];
        console.log(selected_stream_tag);
        console.log(props.active_models);
        if (props.active_models.hasOwnProperty(selected_stream_tag)) {
            buildRows(props.active_models[selected_stream_tag]);
        }
    }
   

    const options = {
         // Enable row selection
        selectableRows: "multiple", 
        rowsSelected: checked_rows // Set the default selected rows
        // Other options...
    };

   
    return (

        <div className='model_data'>
           
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
                    }}
                    rows={rows}
                    columns={columns}
                    options={options}
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
              
            </Stack>
           
        </div>
    );
}


const mapStateToProps = (state) => ({
    active_models:state.active_models,
    selected_stream: state.selected_stream,
    active_models_rows: state.active_models_rows
})


const ConnectedActiveModelDialogue = connect(mapStateToProps)(ActiveModelDialogue);

export default ConnectedActiveModelDialogue