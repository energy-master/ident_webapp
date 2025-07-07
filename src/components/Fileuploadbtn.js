import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { connect } from 'react-redux';
import axios from 'axios';
// import { fileLoad } from '../actions/actions';
import { useDispatch } from 'react-redux';
// import { fileUpload } from '../actions/actions';
import './Fileuploadbtn.css';
import Button from '@mui/material/Button';

const Fileuploadbtn = (props) => {
    const dispatch = useDispatch();
    
    // const [mode, setMode] = React.useState('light');
    // const theme = React.useMemo(() => getTheme(mode), [mode]);
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null);
    const [file, setFile] = useState()
    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = event => {

        const fileUploaded = event.target.files[0];
        setFile(fileUploaded);
        console.log(fileUploaded);
        
        // send file
        handleSubmit(event, fileUploaded);
        dispatch({type:'FILE_UPLOAD_START', payload:'Uploading'})

    };


    function handleSubmit(event, file) {
        event.preventDefault()
        const url = 'https://marlin-network.hopto.org/cgi-bin/live_upload.php';
        const formData = new FormData();
        // console.log(file);
        formData.append('file', file);
        formData.append('fileName', file.name);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios.post(url, formData, config).then((response) => {
            // console.log(response.data);
            // console.log(props);
            // props.fileName = response.data['file-data'].file.name;
            dispatch({ type: 'FILE_UPLOAD_COMPLETE', payload: response.data });
            // dispatch(fileUpload(response.data));
            
        

        });

    }

    console.log(props);
    return (
       
        <div>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                aria-label="upload audio file"
                onClick={handleClick}>

                {props.status}

            </Button>

            <input
                type="file"
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: "none" }} // Make the file input element invisible
            />
        </div>
    )
};


// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({ loadFile }, dispatch);
//   };

// function mapDispatchToProps(dispatch, ownProps) {
//     return {
//         fileUpload: dispatch({ type:' test '})
//     }
//   }



const ConnectedFileuploadbtn = connect((state) => {
    // console.log('building ');
    return {
        fileName: state.acousticFileData.fileName,
        status: state.acousticFileData.status
     };
})(Fileuploadbtn);


export default ConnectedFileuploadbtn;