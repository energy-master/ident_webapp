import * as React from 'react';

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
    }
   
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
];

const rows = [
    { id: 1, fileName: 'no data', fileType: 'no data', sampleRate: 'no data', srcLength: 'no data' }
    // { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 }

];

export default function ModelParams() {

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
// import React from 'react';
// import ReactDOM from 'react-dom/client';

// /* MUI Componenets */
// import { DataGrid } from '@mui/x-data-grid';

// import './IDentFileDataGrid.css'

// /*
// fetch(`${fileName}.json`)
//     .then(response => response.json())
//     .then(data => console.log(data))
// */

// const rows = [
//     { id: 1, name: "John Doe", age: 25 },
//     { id: 2, name: "Jane Smith", age: 30 },
//     { id: 3, name: "Sam Wilson", age: 35 },
// ];
// const columns = [
//     { field: "id", headerName: "ID", width: 70, editable: true },
//     { field: "name", headerName: "Name", width: 150, editable: true },
//     { field: "age", headerName: "Age", width: 100, editable: true },
//   ];

// export default class IDentFileDataGrid extends React.Component{

//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <div className='IDentFileDataGrid'>
//                 <DataGrid
//                     columns={columns}
//                     rows={rows}
//                     hideFooterPagination
//                     hideFooterSelectedRowCount
//                     hideFooter 
//                 />
//             </div>
//         );
//     }

// }
