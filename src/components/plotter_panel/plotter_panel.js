
import React from 'react';
import Paper from '@mui/material/Paper';
import ConnectedActivityPlotter from '../plotter/activity_plotter';



const PlotterPanel = ({ }) => {
    // /, alignItems: 'center', justifyContent: 'center' 
    return (
        <div class='plotter-panel'>
            <Paper outline square sx={{ width: '100%', height: '100%', display: 'flex'}}>    
                <ConnectedActivityPlotter />
            </Paper>
        </div>
    );

}

export default PlotterPanel;