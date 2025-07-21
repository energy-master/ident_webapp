
import React from 'react';
import Paper from '@mui/material/Paper';

import ConnectedModelResults from './results_data';
import ConnectedModelData from '../model_data/model_data';


const ResultsPanel = ({ }) => {

    return (
        <div class='results-panel'>
            <Paper outline square sx={{ width: '100%', height: '100%', display: 'flex' }}>

                {/* <ConnectedModelResults /> */}
                <ConnectedModelData />
            </Paper>
        </div>
    );

}

export default ResultsPanel;