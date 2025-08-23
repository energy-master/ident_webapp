import * as React from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';



import '@fontsource/roboto/300.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';





function AppProgressBar(props) {
    console.log(props);
    const dispatch = useDispatch();
    let number_bots = props.model_parameters[0]["sim_bot_number"]
    let current_bot = props.model_parameters[0]["active_bot_number"]
    console.log(number_bots, current_bot);
    let progress = 0;
    if (number_bots > 0){
        progress = parseFloat(parseFloat(current_bot) / parseFloat(number_bots)) * 100;
    }
    console.log(progress);
    return (
        <>
            <Box display="flex" alignItems="center" p={3}>
                <Box width="100%" mr={3}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            </Box>
        </>
    );
}



const mapStateToProps = (state) => ({
    model_parameters: state.model_parameters,
    
})

const ConnectedAppProgressBar = connect(mapStateToProps)(AppProgressBar);

export default ConnectedAppProgressBar;