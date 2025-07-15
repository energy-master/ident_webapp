
import React from 'react';
import Paper from '@mui/material/Paper';

import SpecShow from '../spec/spec';
import SpecGL from '../specgl/reactspec_gl';
import Render from '../specgl/reactspec_gl';


const SpecPanel = ({ }) => {

    return (
        <div className='spec-panel' id='spec-panel'>
            <Paper outline square id='specContainer' sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               
                <SpecGL />

            </Paper>
        </div>
    );

}

export default SpecPanel;