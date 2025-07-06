
import React from 'react';
import Paper from '@mui/material/Paper';
import ConnectedFileDataGrid from '../../components/ident_data_grid';
import ModelParams from '../../components/model_params/model_params';
import SimControlCard from '../../components/control/control';
import Logger from '../logger/logger';


const DataPanel = ({})=> {

    return (
        <div class='data-panel'>
            <Paper outline square sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                
                <ConnectedFileDataGrid />
                <ModelParams />
                <Logger />
                <SimControlCard />

            </Paper>
        </div>
    );

}

export default DataPanel;