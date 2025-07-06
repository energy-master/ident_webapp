import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';
import './control.css';

export default function SimControlCard() {
    const theme = useTheme();

    return (
        <div className='control'>
      
            {/* <Box sx={{ display: 'flex', flexDirection: 'column',  alignItems: 'center', justifyContent: 'center' } }> */}
              
                        <Typography component="div" variant="h6" gutterBottom>
                        {/* Model Control */}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >
                        
                    </Typography>
              
              
                    {/* <IconButton aria-label="previous">
                        {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                    </IconButton> */}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width:'100%' }}>
                    <IconButton aria-label="play/pause">
                        <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    <IconButton aria-label="next">
                            <PauseIcon sx={{ height: 38, width: 38 }} />
                    </IconButton>
                    </Box>
              
            {/* </Box> */}
            
           
        </div>
    );
}