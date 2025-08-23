
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';



// let global_data_path = "/marlin_live_data/global_out.json";
// Global frame stats
let frame_stats = {}
let all_environments = []
let max_iter = 0;



let bar_Colors = {};
let poller_ids = [];
const PollData = (props) => {
    
    const dispatch = useDispatch();

    const grabPerformaceData = () => {
        console.log('grab performance data');
        let performance_data_path = '/marlin_live_data/' + props.model_parameters[0].model_id + '_performance_out.json';

        fetch(performance_data_path)
            .then((response) => {

                if (response.statusText == 'OK') {
                    return (response.json());
                }
                else {
                    return 'error';
                }
            })
            .then((json_data) => {
                if (json_data != 'error') {
                    dispatch({ type: 'STATUS_UPDATE', payload: json_data['status'] });
                    dispatch({ type: 'MAX_ITER_UPDATE', payload: json_data['number_iters'] });
                    dispatch({
                        type: 'RUN_UPDATE', payload: {
                            'number_bots': json_data['number_bots'],
                            'active_bot': json_data['last_bot_iter']
                        }
                    });

                    if (json_data['status'] == "Search Complete") {
                        dispatch({ type: "STOP_POLLING" });
                        dispatch({ type: 'RUN_FINISHED' });
                    }

                }
            });
    }

    const grabSimData = () => {

        // console.log("Grabbing live data");
        let global_data_path = '/marlin_live_data/' + props.model_parameters[0].model_id + '_global_out.json';
        // console.log(global_data_path);
        let geometry_data_path = '/marlin_live_data/' + props.model_parameters[0].model_id + '_geo_hits.json';
        // console.log(geometry_data_path);

        fetch(global_data_path)
            .then((response) => {
                
                if (response.statusText == 'OK') {
                    return (response.json());
                }
                else {
                    return 'error';
                }
            })
            .then((json_data) => {
                if (json_data != 'error') {
                    // console.log(json_data);
                
                    let model_data = BuildFrameStats(json_data, props.model_parameters[0], props.gl_data);
                    max_iter = json_data['number_iters'];
                    dispatch({ type: 'RESULTS_SUMMARY_BUILD', payload: model_data['results_summary'] });
                    dispatch({ type: 'ACTIVITY_PLOT_DATA_BUILD', payload: model_data['plot_activity_data'] });
                    dispatch({ type: 'STATUS_UPDATE', payload: json_data['status'] });
                    dispatch({ type: 'MAX_ITER_UPDATE', payload: json_data['number_iters'] });

                    
                    dispatch({
                        type: 'RUN_UPDATE', payload: {
                            'number_bots': json_data['number_bots'],
                            'active_bot': json_data['last_bot_iter']
                        }
                    });

                    console.log({
                        'number_bots': json_data['number_bots'],
                        'active_bot': json_data['last_bot_iter']
                    })

                    // *** get geometry ***
                    fetch(geometry_data_path)
                        .then((geom_response) => {

                            if (geom_response.statusText == 'OK') {
                                return (geom_response.json());
                            }
                            else {
                                return 'error';
                            }
                        })
                        .then((geom_json_data) => {
                            if (geom_json_data != 'error') {
                                console.log("***geometry***");
                                // console.log(geom_json_data);

                                dispatch({ type: 'DECISION_GEOMETRY_UPDATE', payload: geom_json_data });


                            }
                            else {
                                console.log("no geometry json global file found");

                            }

                        });


                }
                else {
                    console.log("no json global file found");
                   
                }

            });
           
        

    }
    

    if (props.polling_state.running == true) {
        console.log("polling data");

        if (poller_ids.length < 1) {
            //let poller_id = setInterval(grabSimData, 5000);
            let poller_id_p = setInterval(grabPerformaceData, 1000);

            //poller_ids.push(poller_id);

            poller_ids.push(poller_id_p);
        }
       


    }
    if (props.polling_state.running == false) {
        console.log("stopping polling data");
        // console.log("not polling data");
        for (let i = 0; i < poller_ids.length; i++){
            clearInterval(poller_ids[i]);
            poller_ids.pop(poller_ids[i]);
        }
        
    }

    return (
        <div></div>
    )

}


const mapStateToProps = (state) => (
    {
        polling_state: state.polling_state,
        model_parameters: state.model_parameters,
        gl_data : state.openGl
        
})


const ConnectedPollData= connect(mapStateToProps)(PollData);


export default ConnectedPollData;


/*
*
*/

/* DATA functions */
function BuildFrameStats(data, model_data, gl_data) {



    
    let number_bots = data['number_bots'];
   
    let latest_iter = data['last_bot_iter'];

    let percentage_complete = (latest_iter / number_bots) * 100;
    // // console.log(percentage_complete);


    // //grab frame data from response
    let frame_data = data['frame_overview'];
    let d_num = 0;
    // //iterate over and group accordingly
    for (const key in frame_data) {
        // console.log(frame_data[key]);
        if (frame_data.hasOwnProperty(key)) {
            max_iter = Math.max(max_iter, key);

            for (var i = 0; i < frame_data[key].length; i++) {


                
                // frame stats
                if (frame_stats.hasOwnProperty(key)) {
                    frame_stats[key].number_hits = frame_stats[key].number_hits + 1;
                    frame_stats[key].bots.push(frame_data[key][i].bot_name);
                    frame_stats[key].envs.push(frame_data[key][i].environment);
                    if (!all_environments.includes(frame_data[key][i].environment)) {
                        all_environments.push(frame_data[key][i].environment);
                    }
                    frame_stats[key].probability = frame_stats[key].number_hits / number_bots;
                    if (frame_stats[key].env_hits.hasOwnProperty(frame_data[key][i].environment)) {
                        frame_stats[key].env_hits[frame_data[key][i].environment] += 1;
                        frame_stats[key].env_prob[frame_data[key][i].environment] = frame_stats[key].env_hits[frame_data[key][i].environment] / number_bots;
                    }
                    else {
                        frame_stats[key].env_hits[frame_data[key][i].environment] = 1;
                        frame_stats[key].env_prob[frame_data[key][i].environment] = 1 / number_bots;
                    }


                }
                else {
                    frame_stats[key] = {
                        'number_hits': 1,
                        'bots': [frame_data[key][i].bot_name],
                        'envs': [frame_data[key][i].environment],
                        'probability': 1 / number_bots,
                        'time': frame_data[key][i].time_stamp,
                        'env_hits': {},
                        'env_prob': {}
                    }
                    frame_stats[key].env_hits[frame_data[key][i].environment] = 1;
                    frame_stats[key].env_prob[frame_data[key][i].environment] = 1 / number_bots;

                }


            }


        }
    }



    // Update application state with result structures
    let results_summary = parseResults(frame_stats);
    // console.log(results_summary);
    let activity_plot = parseActivity(frame_stats, model_data, gl_data);

    

    frame_stats = {}

    return ({
        "results_summary": results_summary,
        "plot_activity_data": activity_plot,
        "max_iter": max_iter
        
    });

}

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};




const parseActivity = (frame_stats, model_data, gl_data) => {

    

    let t_vals = Array.from({ length: max_iter + 1 }, (_, index) => index + 1);
    console.log(max_iter);
    let plot_datasets = [];
    console.log(all_environments);
    let env_number = 1;
    for (let x of all_environments) {
       
        if (x in bar_Colors){}
        else {
            // console.log("getting color");
            bar_Colors[x] = getRandomColor();
        }
        
        let e_vals = Array(max_iter + 1).fill(0);
        let barColors = Array(max_iter + 1).fill(bar_Colors[x]);
        let points = [];

        let start_x = 0 - (gl_data.x_width / 2);
        let y_zero = 0 - (gl_data.y_width / 2);
        let delta_x = gl_data.x_width / t_vals.length;
        
        for (let ij = 0; ij < t_vals.length; ij++){
            let start_idx = (ij + 2) * ij;
            // console.log(ij);
            points[start_idx] = start_x + (ij * delta_x);
            if (ij in frame_stats) {
                
                if (frame_stats[ij].env_prob.hasOwnProperty(x)) {
                    if (frame_stats[ij].env_prob[x] > model_data.activation_level) {
                        points[start_idx + 1] = y_zero + (frame_stats[ij].env_prob[x] * 40);
                    } else {
                        points[start_idx + 1] = y_zero + (frame_stats[ij].env_prob[x] * 10);
                    }
                    points[start_idx + 2] = (10 + (env_number * 2));
                }
            }
            else {
                points[start_idx + 1] = y_zero;
                points[start_idx + 2] = (10 + (env_number * 2));
            }

        }
       
        for (const key in frame_stats) {
            
            if (frame_stats[key].env_prob.hasOwnProperty(x)) {
                e_vals[key] = frame_stats[key].env_prob[x];
               
            }
           
        }

        env_number += 1;
        plot_datasets.push({
            environment_label : x,
            data: e_vals,
            borderColor: getRandomColor(),
            backgroundColor:barColors,
            fill: true,
            tension: 1.0,
            points: points

        })

    }

    return {
        "labels": t_vals,
        "datasets" : plot_datasets
    }

}

const parseResults = (frame_stats) => {

    // results summary

    let results_summary = [];
    for (const key in frame_stats) {

        
        results_summary.push({
            "id": key,
            "frame_number": key,
            "time": frame_stats[key]['time'],
            "probability": frame_stats[key]['probability'] * 100,
            "number_hits": frame_stats[key]['number_hits']
            
        });

    }

    return results_summary;

}