const directions = ['#uparrow', '#downarrow', '#leftarrow', '#rightarrow', '#stop', '#reverse']
let token = ''
let uID = ''
let cID = ''
let userName = ''
let channelName = ''

function move_request(data){
    return {
        type: 'POST',
        url: location.protocol + '//localhost:5000/send_move',
        dataType: 'text',
        data: data,
        headers: { 'Authorization': 'Bearer ' + token}
    };
}

twitch.onAuthorized(function (auth){
    token = auth.token
    uID = auth.userID
    cID = auth.channelID

    $.ajax({
        url: location.protocol + '//localhost:5000/send_move',
        type: 'GET',
        headers: {
          'x-extension-jwt': auth.token,
        }
    });
});

$(function (){
    for(const property in directions){
        $(directions[property]).click(function (){
            $.ajax(move_request(directions[property]));
        });
    }
});