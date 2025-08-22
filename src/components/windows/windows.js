

import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';


import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


import ConnectedFileDataGrid from '../../components/ident_data_grid';
import ConnectedStreamData from '../../components/stream_data/stream_data';
import ConnectedStreamFiles from '../../components/stream_files/stream_files'
import ConnectedActiveModelDialogue from '../../components/ActiveModelDialogue/active_model_dialogue';
import ConnectedDetectionsDialogue from '../../components/DetectionsDialogue/detections_dialogue';
import ConnectedLayersDialogue from '../../components/layers_dialogue/layers_dialogue';
const eventLogger = (e, data) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
};



const Windows = ({ }) => {


    return (
        <>
            <WindowGUI />
        </>
    );

}



export default Windows;

const WindowGUI = ({}) => {

    const nodeRef = React.useRef(null); // Create a ref
    return (
        <>
        // Connect to data
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header

        >
    
               
            <div ref={nodeRef} style={{ width:'30%', left: '2%', top: '10%', position:'absolute'}}>
                <div >
                        <div className="window-header" style={{
                            width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor:'#292D39', color:'white',left: '91%',position: 'absolute', zIndex:100, cursor:'pointer', textAlign:'center' }}>...</div>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', fontSize: '14px', fontWeight: 'bold' , width:'90%'}}>
                    <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                            <Typography component="span">Connect Data</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* <ConnectedFileDataGrid /> */}
                        <ConnectedStreamData />
                    </AccordionDetails>
                    </Accordion>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', fontWeight: 'bold', width: '90%' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel4-content"
                            id="panel4-header"
                        >
                            <Typography component="span">Streamed Files</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ConnectedStreamFiles />
                        </AccordionDetails>
                    </Accordion>


                    {/* <Accordion sx={{ bgcolor: '#292D39', color: '#818698' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                        <Typography component="span">Model Selection</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>

                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}

                    {/* <Accordion sx={{ bgcolor: '#292D39', color: '#818698' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Model Parameters</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>

                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}



                </div>

            </div>

        </Draggable >


         <Draggable
            nodeRef={nodeRef}
            handle=".window-header" // Only drag by the header
        >
        
                <div ref={nodeRef} style={{ width: '20%', left: '70%', top: '10%', position: 'absolute' }}>
                    {/* <div className="window-header" > */}
                    <div>
                    <div className="window-header" style={{
                        width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                    }}>...</div>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width:'90%' }}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span">Detections</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ConnectedDetectionsDialogue />
                            </AccordionDetails>
                        </Accordion>
                    {/* </div> */}
                       
                </div>
            </div>
       </Draggable>


            <Draggable
                nodeRef={nodeRef}
                handle=".window-header" // Only drag by the header

            >
                <div ref={nodeRef} style={{ width:'15%', left: '52%', top: '10%', position:'absolute'}}>
                <div>
                    <div className="window-header" style={{
                            width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                    }}>...</div>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width:'90%' }}>
                        <AccordionSummary
                            expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <Typography component="span">Active Models</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                                <ConnectedActiveModelDialogue />
                        </AccordionDetails>
                    </Accordion>

                    </div>

              

            </div>

            </Draggable >


            <Draggable
                nodeRef={nodeRef}
                handle=".window-header" // Only drag by the header
            >
                <div ref={nodeRef} style={{ width: '15%', left: '35%', top: '10%', position: 'absolute' }}>
                    {/* <div className="window-header" > */}
                    <div>
                    <div className="window-header" style={{
                        width: '50px', height: '25px', background: '#292D39', backgroundColor: '#292D39', bgcolor: '#292D39', color: 'white', left: '91%', position: 'absolute', zIndex: 100, cursor: 'pointer', textAlign: 'center'
                    }}>...</div>

                        <Accordion sx={{ bgcolor: '#292D39', color: '#efeff1ff', width:'90%'}}>
                            <AccordionSummary
                                expandIcon={<ArrowDropDownIcon sx={{ color: '#818698' }} />}
                                aria-controls="panel3-content"
                                id="panel3-header"
                            >
                                <Typography component="span">Layers</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ConnectedLayersDialogue />
                            </AccordionDetails>
                        </Accordion>
                    {/* </div> */}
                    </div>
                </div>
            </Draggable>

        </>
    );

}


const WindowHandle = ({
    left,
    top
}) => {
    return (
        <div class="window-handle" style={{ left: {left}, top: {top}, position: 'absolute' }}>

        </div>
    )
}

