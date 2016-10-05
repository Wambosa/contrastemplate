function getJson(path, callback){

    return new Promise(function(resolve, reject){

        var request = new XMLHttpRequest();

        request.open('GET', path, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {

                try{
                    var data = JSON.parse(request.responseText);

                    if(callback) callback(data);
                    else resolve(data);

                }catch(err){
                    err.requestStatus = request.status;
                    if(callback) callback(errorTip("json parse failed", err));
                    else reject(errorTip("json parse failed", err));
                }

            } else {
                if(callback) callback(errorTip("GET request.status not OK", request));
                else reject(errorTip("GET request.status not OK", request));
            }
        };

        request.onerror = function(err) {
            if(callback) callback(errorTip("general http failure", err));
            else reject(errorTip("general http failure", err));
        };

        request.send();

    });
}