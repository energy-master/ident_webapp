
import { connect } from 'react-redux';




const global_data_path = "/marlin_live_data/global_out.json";
// Global frame stats
let frame_stats = {}
let all_environments = []
let max_iter = 0;



let poller_id = "";

const PollData = (props) => {

    const grabSimData = () => {

        // console.log('grabbing sim data')
        // console.log(props);
        fetch(global_data_path)
            .then((response) => {
                return (response.json());
            })
            .then((json_data) => {
                console.log(json_data);
                
                BuildFrameStats(json_data);
            });
        

    }
    
    console.log(props);

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


    // console.log(frame_stats)
    // console.log(all_environments);

    // *** UPDATE GUI ***
    // ShowFrameStory();

    // ShowActiveSpecImage(latest_iter);

    // ShowSimProgress(percentage_complete);

    // ShowActivityPlot();
    // *** RESET STATS ***
    console.log(frame_stats); // results
    frame_stats = {}

}

