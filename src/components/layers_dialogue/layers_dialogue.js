

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
        field: 'layer_name', headerName: 'Layer', width: 300,
        editable: false,
        flex: 1,
        headerClassName: 'dataHdr',
         renderCell: (params) => (
                    <Typography variant="overline" sx={{ color:'white' }}>
                                {params.value}
                    </Typography>
                ),
    },
   
    



];



function LayersDialogue(props) {
    
    const dispatch = useDispatch();


  
    
       

    let rows = [];
    if (rows.length == 0) {
        rows = [
            {
                "id": 1,
                "layer_name": 'Detections',
                
                
              
            },
            {
                "id": 2,
                "layer_name": 'Energies',


            },
            {
                "id": 3,
                "layer_name": 'Spectrograms',


            },
            {
                "id": 4,
                "layer_name": 'Waveforms',


            }
        ];
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
                    
                    // onRowClick={modelRow_clicked} // here
                />
                {/* </ThemeProvider> */}
            </Stack>
            {/* </CardContent>
            </Card> */}
        </div>
    );
}


const mapStateToProps = (state) => {
    return {

       
    }
}


const ConnectedLayersDialogue = connect(mapStateToProps)(LayersDialogue);

export default ConnectedLayersDialogue