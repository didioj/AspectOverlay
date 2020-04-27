setInterval(run_map, 1000);

async function run_map(){
    res = await fetch(location.protocol + '//localhost:5000/api/get_minimap', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }).catch(() => {
        throw new Error('Network or permission failure when getting minimap data');
    });
    if (!res.ok) {
        throw new Error('Getting minimap data: ' + res.statusText);
    }
    map = await res.json();
    if (map && map.length) {
        console.log(map)
        render_minimap(map);
    }
}

function render_minimap(mapArray){
    // set a minimap variable so we don't have to call getElement too often
    var minimap = document.getElementById("minimap");
    // clear the old minimap
    minimap.innerHTML = "";
    // start off by making a beginning table tag
    minimapStr = "<table>";
    // (0, 0) on the grid is the bottom left
    // so iterate in reverse
    for(var i = mapArray.length - 1; i >= 0 ; i--){
        // start off the row with a new row tag
        minimapStr += "<tr>";
        // loop through each column in the row
        for(var j = 0; j < mapArray[i].length; j++){
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
        // close the row with a closing row tag
        minimapStr += "</tr>";
    }
    // close off the completed minimap table with a closing table tag
    minimapStr += "</table>";
    // render the completed minimap into the minimap element
    minimap.innerHTML += minimapStr;
}
