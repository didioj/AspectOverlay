const max_moves = 5;
let current_moves = [];
let token = ''
let uID = ''
let cID = ''
let userName = ''
let channelName = ''

var ex_uID = 'abc';
var ex = [
    [
        [], 
        [{type: 1, uID: 'abc'}], 
        [], 
        []
    ],
    [
        [], 
        [{type: 2, uID: 'def'}, 
         {type: 2, uID: 'ghi'}, 
         {type: 1, uID: 'jkl'}], 
        [], 
        []
    ],
    [
        [], 
        [], 
        [], 
        []
    ],
    [
        [], 
        [], 
        [{type: 2, uID: 'streamer'}], 
        []
    ]
]

async function move_request(current_moves) {
    res = await fetch(location.protocol + '//127.0.0.1:5000/api/send_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({moves: current_moves, userID: uID})
    }).catch(() => {
        throw new Error('Network or permission failure when sending move_request');
    });
    if (!res.ok) {
        throw new Error('Sending move_request: ' + res.statusText);
    }
}

async function name_request(){
    res = await fetch(location.protocol + '//localhost:5000/api/send_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: uID})
    }).catch(() => {
        throw new Error('Network or permission failure when sending name_request')
    });
    if (!res.ok){
        throw new Error('Sending name_request: ' + res.statusText);
    }
}

function render_queue() {
    holder = document.getElementById('actionqueue');
    while (holder.hasChildNodes()) {
        holder.removeChild(holder.lastChild);
    }
    for (let i=0; i<current_moves.length; i++) {
        newChild = document.createElement('img');
        newChild.setAttribute('src', 'static/' + current_moves[i] + '-arrow.svg');
        newChild.setAttribute('id', current_moves[i] + 'arrow');
        newChild.setAttribute('width', 100);
        newChild.setAttribute('height', 100);
        holder.appendChild(newChild);
    }
}

function add_arrow(dir) {
    if (current_moves.length === max_moves) {
        //current_moves = [];
        return;
    }
    current_moves.push(dir);
    render_queue();
    /*
    if (current_moves.length === max_moves) {
        move_request(current_moves);
    }
    */
}
function run_map(){
    render_minimap(ex);
}
function render_minimap(mapArray){
    // set a minimap variable so we don't have to call getElement too often
    var minimap = document.getElementById("minimap");
    // clear the old minimap
    minimap.innerHTML = "";
    // start off by making a beginning table tag
    minimapStr = "<table>";
    // output the length into the console for debugging if needed
    console.log(mapArray.length);
    // (0, 0) on the grid is the bottom left
    // so iterate in reverse
    for(var i = mapArray.length - 1; i >= 0 ; i--){
        // console output loading current row for debugging purposes
        console.log("loading row " + i);
        // start off the row with a new row tag
        minimapStr += "<tr>";
        // loop through each column in the row
        for(var j = 0; j < mapArray[i].length; j++){
            // console output current cell for debugging purposes
            console.log("loading cell " + i + ", " + j);
            // start off an incomplete cell tag
            minimapStr += "<td";
            // setting a few variables for determining what takes precedence
            var self = false; 
            var streamer = false;
            var team1 = 0; 
            var team2 = 0;
            // loop through the pieces on this cell
            for(var k = 0; k < mapArray[i][j].length; k++){
                // your own piece takes highest priority
                if(mapArray[i][j][k].uID == uID){
                    self = true; break;
                // next highest priority is the streamer's
                } else if(mapArray[i][j][k].uID == "streamer"){
                    streamer = true; break;
                // add into team1 to keep track of number of team1 pieces
                } else if(mapArray[i][j][k].type == 1){
                    team1++;
                // add into team2 to keep track of number of team2 pieces
                } else if(mapArray[i][j][k].type == 2){
                    team2++;
                }
            }
            // your own piece takes highest priority
            if(self == true){
                minimapStr += " class='self'";
            // next is the streamer's piece
            } else if(streamer == true){
                minimapStr += " class='king'";
            // the next priority is the team that most occupies this space
            // in the case of a tie, team1 takes priority
            // there is no piece for an empty space
            } else if(team1 >= team2 && team1 != 0){
                minimapStr += " class='blue'";
            } else if(team2 > team1){
                minimapStr += " class='red'";
            }
            // close off the cell, which should now have the appropriate
            // class (or lack thereof)
            minimapStr += "></td>";
        }
        // console output when finishing a row
        console.log("ending row " + i);
        // close the row with a closing row tag
        minimapStr += "</tr>";
    }
    // console output when all rows and cells are done rendering
    console.log("ending table");
    // close off the completed minimap table with a closing table tag
    minimapStr += "</table>";
    // render the completed minimap into the minimap element
    minimap.innerHTML += minimapStr;
}

function undo(){
    if(current_moves.length === 0){
        console.log("No actions to remove");
        return;
    }
    //console.log("Removing last action");
    // get the action queue object from the document
    holder = document.getElementById('actionqueue');
    // remove the last child, which is the last added move
    holder.removeChild(holder.childNodes[current_moves.length-1]);
    action = current_moves.pop();
    // print out the action into the console
    console.log("Action " + action + " removed successfully");
}

function submit(){
    if (current_moves.length === max_moves) {
        console.log("Submitting queue of moves:");
        console.log(current_moves);
        move_request(current_moves);
        // reset the move queue
        current_moves = [];
        while (holder.hasChildNodes()) {
            holder.removeChild(holder.lastChild);
        }
    }
    else{
        console.log("Not enough actions queued");
    }
}

function valid_undo(){
    //this just checks if running function "undo" will be successful
    undoButton = document.getElementById("undo");
    if(current_moves.length === 0){
        //cannot undo
        undoButton.classList.remove("canClick");
        undoButton.classList.add("cantClick");
    }
    else{
        //can undo
        undoButton.classList.remove("cantClick");
        undoButton.classList.add("canClick");
    }
}

function valid_submit(){
    //this just checks if running function "submit" will be successful
    submitButton = document.getElementById("submit");
    if(current_moves.length < max_moves){
        //cannot submit
        submitButton.classList.remove("canClick");
        submitButton.classList.add("cantClick");
    }
    else{
        //can submit
        submitButton.classList.remove("cantClick");
        submitButton.classList.add("canClick");
    }
}

function register() {
    name_request();
}

window.Twitch.ext.onAuthorized((auth) => {
    console.log("AUTHORIZED");
    token = auth.token;
    uID = auth.userID;
    cID = auth.channelID;
    name_request();
});