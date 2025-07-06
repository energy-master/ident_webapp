
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';



const global_data_path = "/marlin_live_data/global_out.json";
// Global frame stats
let frame_stats = {}
let all_environments = []
let max_iter = 0;



let poller_id = "";

const PollData = (props) => {
    const dispatch = useDispatch();
    const grabSimData = () => {

        // console.log('grabbing sim data')
        // console.log(props);
        fetch(global_data_path)
            .then((response) => {
                return (response.json());
            })
            .then((json_data) => {
                // console.log(json_data);
                
                let model_data = BuildFrameStats(json_data);
                console.log(model_data['results_summary']);
                dispatch({ type: 'RESULTS_SUMMARY_BUILD', payload: model_data['results_summary'] });
                dispatch({ type: 'ACTIVITY_PLOT_DATA_BUILD', payload: model_data['plot_activity_data'] });


            });
        

    }
    
    // console.log(props);

    if (props.polling_state.running == true) {
        console.log("polling data");

        poller_id = setInterval(grabSimData, 500);



    }
    if (props.polling_state.running == false) {
        console.log("not polling data");
        clearInterval(poller_id);
    }



    return (
        <div></div>
    )

}


const mapStateToProps = (state) => (
    {
   polling_state:state.polling_state
})


const ConnectedPollData= connect(mapStateToProps)(PollData);


export default ConnectedPollData;


/*
*
*/

/* DATA functions */
function BuildFrameStats(data) {


   
    

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
    let activity_plot = parseActivity(frame_stats);

    

    frame_stats = {}

    return ({
        "results_summary": results_summary,
        "plot_activity_data" : activity_plot
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

const parseActivity = (frame_stats) => {

    let t_vals = Array.from({ length: max_iter + 1 }, (_, index) => index + 1);
    let plot_datasets = [];
    console.log(all_environments);
    for (const x of all_environments) {
        console.log(max_iter);
        let e_vals = Array(max_iter + 1).fill(0);
        let _c_ = getRandomColor();
        let barColors = Array(max_iter + 1).fill(_c_);
        for (const key in frame_stats) {
            if (frame_stats[key].env_prob.hasOwnProperty(x)) {
                e_vals[key] = frame_stats[key].env_prob[x];
               
            }
        }

        plot_datasets.push({
            label : x,
            data: e_vals,
            borderColor: getRandomColor(),
            backgroundColor:barColors,
            fill: true,
            tension: 1.0

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
            "number_bots": frame_stats[key]['number_bots']
        });

    }

    return results_summary;

}