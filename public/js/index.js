document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('requestDataDiv').addEventListener('click', function(){
        sendAJAX('get','../imap');
    });
    document.getElementById('checkDataDiv').addEventListener('click', function(){
        sendAJAX('get','../imap/getData');
    });

});

function sendAJAX(verb, addr){
    var xhr = new XMLHttpRequest();

    xhr.open(verb, addr);
    xhr.addEventListener('readystatechange', function(){
        if (xhr.status === 202 && xhr.readyState === 4){
            console.log(xhr.responseText);
        }
    });
    xhr.send();
}