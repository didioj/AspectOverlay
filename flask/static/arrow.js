const max_moves = 5;
let current_moves = [];
let token = ''
let uID = ''
let cID = ''
let userName = ''
let channelName = ''

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

function undo()
{
    if(current_moves.length === 0)
    {
        console.log("No actions to remove");
        return;
    }
    //console.log("Removing last action");
    holder = document.getElementById('actionqueue');
    holder.removeChild(holder.childNodes[current_moves.length-1]);
    action = current_moves.pop();
    console.log("Action " + action + " removed successfully");
}

function submit(){
    if (current_moves.length === max_moves) {
        console.log("Submitting queue of moves:");
        console.log(current_moves);
        move_request(current_moves);
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

window.Twitch.ext.onAuthorized((auth) => {
    console.log("AUTHORIZED");
    token = auth.token;
    uID = auth.userID;
    cID = auth.channelID;
    name_request();
});