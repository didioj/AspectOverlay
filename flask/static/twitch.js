var token = ''
var uID = ''
var cID = ''
var userName = ''
var channelName = ''

function register() {
    name_request();
}

async function name_request(){
    res = await fetch(location.protocol + '//localhost:5000/api/send_name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({userID: uID})
    }).catch(() => {
        throw new Error('Network or permission failure when sending name_request')
    });
    if (!res.ok){
        throw new Error('Sending name_request: ' + res.statusText);
    }
}

window.Twitch.ext.onAuthorized((auth) => {
    console.log("AUTHORIZED");
    token = auth.token;
    uID = auth.userID;
    cID = auth.channelID;
    name_request();
});