

import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ConnectedFileuploadbtn from '../Fileuploadbtn.js';
const IDentSpeedMenu = ({
    
    actions = [
        { icon: <ConnectedFileuploadbtn />, name: 'Upload Acoustic File' }]
    //     { icon: <SaveIcon />, name: 'Save' },
    //     { icon: <PrintIcon />, name: 'Print' },
    //     { icon: <ShareIcon />, name: 'Share' },
    //   ]

}) => {
return (
    <SpeedDial
        ariaLabel="IDent Menu"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}>
        {actions.map((action) => (
            <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
            />
        ))}
    </SpeedDial>
)
};
export default IDentSpeedMenu