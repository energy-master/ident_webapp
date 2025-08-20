import * as React from 'react';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import { connect } from 'react-redux';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import './IDentFileDataGrid.css';
import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ConnectedFileuploadbtn from '../components/Fileuploadbtn';




function IDentFileDataGrid(props) {
     
     const renderUploadBtn = () => {
         // console.log(props.model_parameters[0].percentage_complete);
         return (
           <ConnectedFileuploadbtn />
         )
     }

     const columns = [
         {
             field: 'fileLoader',
             headerName: '',
             width: 500,
             disableClickEventBubbling: true,
             renderCell: renderUploadBtn,
             headerBg: '#292D39',
             headerClassName:'dataHdr'
         },
         {
             field: 'fileName', headerName: 'File', width: 90, headerBg: '#292D39', headerClassName: 'dataHdr'

         },
         {
             field: 'fileType',
             headerName: 'File Type',
             width: 150,
             editable: false,
             headerBg: '#292D39',
             headerClassName: 'dataHdr'
         },

         {
             field: 'sampleRate',
             headerName: 'Sample Rate',

             width: 110,
             editable: false,
             headerBg: '#292D39',
             headerClassName: 'dataHdr'
         },
         {
             field: 'srcLength',
             headerName: 'Src Length',
             width: 150,
             editable: false,
             headerBg: '#292D39',
             headerClassName: 'dataHdr'
         }

     ];

    let rows = [
    
        { id: 1, fileName: props.fileName, fileType: props.fileType, sampleRate: '[no data]', srcLength: '[no data]' }
  
    ];

    return (
        
        <div className='IDentFileDataGrid'>
           
            <Stack direction="column" gap={0} style={{ width: '100%' }}>
                {/* <Box sx={{ width: '100%', maxWidth: 500, paddingtop:2 }}>
                    <Typography variant="h6" gutterBottom>
                        <span className='panel-header'>File Data</span>
                    </Typography></Box> */}
               
           
                <DataGrid
                   
                    sx={{
                        m: 0, fontSize: 11, bgcolor: '#292D39', color: '#818698', bg: '#292D39', color: '#8C92A4', fontWeight: 'bold', '& .dataHdr': {
                            backgroundColor: '#292D39', color: '#8C92A4', fontWeight: 'bold'
                        }
                    }}
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
                />
            {/* </ThemeProvider> */}
                    </Stack>
                {/* </CardContent>
            </Card> */}
        </div>
    );
}

const mapStateToProps = (state) => ({
    fileName: state.acousticFileData.fileName, fileType: state.acousticFileData.fileType, 
    location: state.acousticFileData.location
})

// const ConnectedFileDataGrid = connect((state) => {
//     console.log('drawing file data grid');
//     return { fileName: state.acousticFileData.fileName };
// })(IDentFileDataGrid);

const ConnectedFileDataGrid = connect(mapStateToProps)(IDentFileDataGrid);

export default ConnectedFileDataGrid