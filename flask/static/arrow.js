const max_moves = 5;
var current_moves = 0;

async function move_request(dir) {
    console.log(dir)
    res = await fetch(location.protocol + '//localhost:5000/api/send_move', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({direction: dir})
    }).catch(() => {
        throw new Error('Network or permission failure when sending move_request');
    });
    if (!res.ok) {
        throw new Error('Sending move_request: ' + res.statusText);
    }
}

function add_arrow(dir)
{
    console.log(dir)
    if (current_moves === max_moves)
    {
        let queue = document.getElementById('actionqueue');
        console.log("Maximum moves reached, deleting...");
        while (queue.children.length !== 0)
        {
            queue.removeChild(queue.children[0]);
        }
        current_moves = 0;
    }
    else
    {
        console.log("Adding " + dir + " arrow");
        holder = document.getElementById('actionqueue');
        newChild = document.createElement('img');
        newChild.setAttribute('src', '../static/' + dir + '-arrow.svg');
        newChild.setAttribute('id', dir + 'arrow');
        newChild.setAttribute('width', 100);
        newChild.setAttribute('height', 100);
        holder.appendChild(newChild);
        current_moves++;
    }
}