
import React from 'react';
import Paper from '@mui/material/Paper';
import ConnectedFileDataGrid from '../../components/ident_data_grid';
import ConnectedModelParams from '../../components/model_params/model_params';
import ConnectedSimControlCard from '../../components/control/control';
import Logger from '../logger/logger';


const DataPanel = ({})=> {

    return (
        <div class='data-panel'>
            <Paper outline square sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                
                {/* <ConnectedFileDataGrid />
                <ConnectedModelParams /> */}
                {/* <Logger /> */}
                {/* <ConnectedSimControlCard /> */}

            </Paper>
        </div>
    );

}

export default DataPanel;