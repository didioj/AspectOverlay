const max_moves = 5;
let current_moves = [];

async function move_request(current_moves) {
    res = await fetch(location.protocol + '//localhost:5000/api/send_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({moves: current_moves})
    }).catch(() => {
        throw new Error('Network or permission failure when sending move_request');
    });
    if (!res.ok) {
        throw new Error('Sending move_request: ' + res.statusText);
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
        current_moves = [];
    }
    current_moves.push(dir);
    render_queue();
    if (current_moves.length === max_moves) {
        move_request(current_moves);
    }
}

function undo()
{
    if(current_moves === 0)
    {
        console.log("No actions to remove");
        return;
    }
    console.log("Removing last action");
    holder = document.getElementById('actionqueue');
    holder.removeChild(holder.childNodes[current_moves-1]);
    current_moves--;
}