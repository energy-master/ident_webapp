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
        // dispatch({type:'FILE_BTN_CLICK', payload:'clicked'})
    };

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = event => {

        const fileUploaded = event.target.files[0];
        setFile(fileUploaded);
        console.log(fileUploaded);
        
        // send file
        handleSubmit(event, fileUploaded);
        dispatch({ type: 'FILE_UPLOAD_START', payload: 'Uploading' })
        dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Starting to upload acoustic file to application.' })

    };

    let ACTX = new AudioContext();
    let ANALYSER = ACTX.createAnalyser();
    ANALYSER.fftSize = 2048;
    ANALYSER.smoothingTimeConstant = 0.5;
    // General configuration for common settings
    const config = {
        /**
         * The resolution of the FFT calculations
         * Higher value means higher resolution decibel domain..
         */
        fftResolution: 4096,
        /**
         * Smoothing value for FFT calculations
         */
        smoothingTimeConstant: 0.1,
        /**
         * The size of processing buffer,
         * determines how often FFT is run
         */
        processorBufferSize: 2048,
    }
    const handleAudioConnect = () => {
       
           
        return (1);
        let SOURCE;
        console.log('fetching audio');
        fetch('/marlin_live/test_file.wav').then(response => {
            console.log(response);
            response.arrayBuffer().then(function (buffer) {
                console.log(buffer);
                ACTX.decodeAudioData(buffer).then((audioBuffer) => {
                    console.log('analysing');
                    console.log('audioBuffer', audioBuffer);
                    // {length: 1536000, duration: 32, sampleRate: 48000, numberOfChannels: 2}
                    let audioData = audioBuffer;
                    const offlineCtx = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
                    const offlineAnalyser = offlineCtx.createAnalyser()
                    let frequency_samples = 1024;
                    offlineAnalyser.fftSize = 4 * frequency_samples;
                    offlineAnalyser.smoothingTimeConstant = 0.5;
                    let DATA = new Uint8Array(offlineAnalyser.frequencyBinCount);

                    const source = offlineCtx.createBufferSource();
                    source.buffer = audioBuffer;

                    source.connect(offlineAnalyser);
                    source.start();
                    console.log(offlineAnalyser.frequencyBinCount);
                    // let DATA = new Float32Array(offlineAnalyser.frequencyBinCount);
                    offlineAnalyser.getByteFrequencyData(DATA);
                    console.log(DATA);
                    

                    // source.channelCount = audioBuffer.numberOfChannels;
                    // const splitter = offlineCtx.createChannelSplitter(source.channelCount)
                    //     const generalAnalyzer = offlineCtx.createAnalyser()
                    //     generalAnalyzer.fftSize = config.fftResolution
                    //     generalAnalyzer.smoothingTimeConstant = config.smoothingTimeConstant


                    // // Prepare buffers and analyzers for each channel
                    // const channelFFtDataBuffers = []
                    // const channelDbRanges = []
                    // const analyzers = []
                    // for (let i = 0; i < source.channelCount; i += 1) {
                    //     channelFFtDataBuffers[i] = new Uint8Array((audioBuffer.length / config.processorBufferSize) * (config.fftResolution / 2))
                    //     // Setup analyzer for this channel
                    //     analyzers[i] = offlineCtx.createAnalyser()
                    //     analyzers[i].smoothingTimeConstant = config.smoothingTimeConstant
                    //     analyzers[i].fftSize = config.fftResolution
                    //     // Connect the created analyzer to a single channel from the splitter
                    //     splitter.connect(analyzers[i], i)
                    //     channelDbRanges.push({
                    //         minDecibels: analyzers[i].minDecibels,
                    //         maxDecibels: analyzers[i].maxDecibels,
                    //     })
                    // }
                    // offlineCtx.AudioWorkletNode = offlineCtx.AudioWorkletNode || offlineCtx.createJavaScriptNode
                    // const processor = offlineCtx.createScriptProcessor(config.processorBufferSize, 1, 1)
                    // let offset = 0
                    // processor.onaudioprocess = (ev) => {
                    //     // Run FFT for each channel
                    //     for (let i = 0; i < source.channelCount; i += 1) {
                    //         const freqData = new Uint8Array(channelFFtDataBuffers[i].buffer, offset, analyzers[i].frequencyBinCount)
                    //         analyzers[i].getByteFrequencyData(freqData)
                    //     }
                    //     offset += generalAnalyzer.frequencyBinCount
                    // }
                    // source.connect(splitter)
                    // source.connect(processor)
                    // processor.connect(offlineCtx.destination)
                    // source.connect(generalAnalyzer)
                    // // Start the source, other wise start rendering would not process the source
                    // source.start(0)

                    // // Process the audio buffer
                    // // offlineCtx.startRendering()
                    // let res = {
                    //     channels: channelFFtDataBuffers,
                    //     channelDbRanges,
                    //     stride: config.fftResolution / 2,
                    //     tickCount: Math.ceil(audioBuffer.length / config.processorBufferSize),
                    //     maxFreq: offlineCtx.sampleRate / 2, // max freq is always half the sample rate
                    //     duration: audioBuffer.duration,
                    // }
                    // console.log(res);
                    // return {
                    //     channels: channelFFtDataBuffers,
                    //     channelDbRanges,
                    //     stride: config.fftResolution / 2,
                    //     tickCount: Math.ceil(audioBuffer.length / config.processorBufferSize),
                    //     maxFreq: offlineCtx.sampleRate / 2, // max freq is always half the sample rate
                    //     duration: audioBuffer.duration,
                    // }

                    
                    });
                });
            })
        
    }

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
        console.log(props);
        axios.post(url, formData, config).then((response) => {
            console.log(response.data);

            if (response.data['error'] == true) {
                return (response.data);
            }

            // console.log(props);
            console.log('uploaded');
            // props.fileName = response.data['file-data'].file.name;
            dispatch({ type: 'FILE_UPLOAD_COMPLETE', payload: response.data });
            dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Acoustic file upload complete.' });

            

            //RUN FFT
            const formData2 = new FormData();
            let sampling = 5;
            let id = props.model_id;
            formData2.append('run_id', id);
            formData2.append('fileName', file.name);
            formData2.append('sampling', sampling);

            dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Acoustic data analysis begins.' })
            let fft_url = 'https://marlin-network.hopto.org/cgi-bin/live_fft.php';
           
            axios.post(fft_url, formData2, config).then((response_) => {
                console.log('fft should be built!');
                console.log(response_.data);



                //show spectrogram
                dispatch({ type: 'SHOW_SPEC', payload: 1 });
                dispatch({ type: 'LOG_UPDATE', payload: 'IDent Message : Spectrogram rendering has started. This may take some time.' });


                //dipatch show spec
                console.log(props);
                return (1);

               
            });

          
        

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
        status: state.acousticFileData.status,
        model_id : state.model_parameters[0].model_id
     };
})(Fileuploadbtn);


export default ConnectedFileuploadbtn;