
import React from 'react';
import Paper from '@mui/material/Paper';

import SpecShow from '../spec/spec';


const SpecPanel = ({ }) => {

    return (
        <div class='spec-panel'>
            <Paper outline square sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               
                <SpecShow
                    pathToFile="/marlin_live/"
                    fileName="test.wav"
                />
                

            </Paper>
        </div>
    );

}

export default SpecPanel;