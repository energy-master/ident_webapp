

active_window_ids = [];



function ReloadAllShownData()
{
    //iterate over active windows. Get type of data and rebuild.
    console.log("reload");
    for (let key in window_tracker) {
        console.log(key);
        // acoustic data
        if (key == "acoustic-data") {
            console.log(key + " " + window_tracker[key]);
            content_id =`${window_tracker[key]}_content`;
            BuildAppDataAcoustic(content_id);
        }

        // on the fly labelling
        if (key == "study-label") {
            content_id = `${window_tracker[key]}_content`;
            BuildStudyLabel(content_id);
        }

        // list of tags
        if (key == "study-tags") {
            content_id = `${window_tracker[key]}_content`;
            ShowStudyLabels(content_id);
        }

    }

}

// createWindow();

// Create Window
function createWindow(title, data_type) {
    
    var win_id = makeid(10);
    var html = `
    
    
        <div id = "${win_id}" class = "draggable_window" style="position:absolute">
            <div id="${win_id}_hdr" class = "draggable_window_hdr"><span style="color:red">IDent</span> Data Window [ ${title} ]<div class=close-icon onClick="closeWindow('${win_id}')">X</div></div>
            <div id="${win_id}_content" class="window-content"></div>
            <div class="window-bottom-border"></div>
        </div>
    
    `;

    var el = document.getElementById("windows");
    el.innerHTML += html;

    active_window_ids.push(win_id);
    window_tracker[data_type] = win_id;
    dragElement(document.getElementById(win_id));



    var draggableElements = document.getElementsByClassName("draggable_window");

    for(var i = 0; i < draggableElements.length; i++){
        dragElement(draggableElements[i]);
    }

    
    return win_id;
    

}

// Create Window
function createMessageWindow(title, data_type) {

    var win_id = makeid(10);
    var html = `
    
    
        <div id = "${win_id}" class = "draggable_window" style="position:absolute">
            <div id="${win_id}_hdr" class = "draggable_window_hdr"><span style="color:green">IDent</span> Data Window [ ${title} ]<div class="close-icon" onClick="closeWindow('${win_id}')">X</div></div>
            <div id="${win_id}_content" class="window-message-content"></div>
            <div class="window-bottom-border"></div>
        </div>
    
    `;

    var el = document.getElementById("windows");
    el.innerHTML += html;

    active_window_ids.push(win_id);
    window_tracker[data_type] = win_id;
    dragElement(document.getElementById(win_id));



    var draggableElements = document.getElementsByClassName("draggable_window");

    for (var i = 0; i < draggableElements.length; i++) {
        dragElement(draggableElements[i]);
    }


    return win_id;


}

function showWindow(win_id){
    var el = document.getElementById(win_id);
    el.style.display = "block";
    active_window_ids.push(win_id);
    
}


function closeWindow(id){
    var el = document.getElementById(id);
    el.style.display = "none";
    var index = active_window_ids.indexOf(id);
if (index !== -1) {
  active_window_ids.splice(index, 1);
}
}


// dragElement(document.getElementById("draggable_window"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "_hdr")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "_hdr").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

    function dragMouseDown(e) {
      console.log("on mouse down event")
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
        pos4 = e.clientY;
        console.log(pos4);
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
