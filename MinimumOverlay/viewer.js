const directions = ['#uparrow', '#downarrow', '#leftarrow', '#rightarrow', '#stop', '#reverse']

function move_request(data){
    return {
        type: 'POST',
        url: location.protocol + '//localhost:5000/send_move',
        dataType: 'text',
        data: data
    };
}

$(function (){
    for(const property in directions){
        $(directions[property]).click(function (){
            $.ajax(move_request(directions[property]));
        });
    }
});