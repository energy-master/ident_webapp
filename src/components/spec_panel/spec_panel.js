
import React from 'react';
import Paper from '@mui/material/Paper';

import SpecShow from '../spec/spec';
import ConnectedSpecGL from '../specgl/specgl';
import Render from '../specgl/reactspec_gl';
import ConnectedSpectrogramMesh  from '../specgl/spec_mesh';

const SpecPanel = ({ }) => {

    return (
        <div className='spec-panel' id='spec-panel'>
            <Paper outline square id='specContainer' sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               
                <ConnectedSpectrogramMesh />

            </Paper>
        </div>
    );

}

export default SpecPanel;