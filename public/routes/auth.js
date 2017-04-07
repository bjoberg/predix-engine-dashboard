var request 		= require('request');
/*
 * API route for UAA authentication token
 * @author Kyle Duckworth (212326570)
 * @version 01.02.2017
 */
exports.authenticate = function(req, res){
    // uaa url
	var uaa_issuer_id		= "https://98d4176d-a268-405b-a461-3f9944793a31.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token"

    //credentials for auth
    var client_password     = "app_client_id";
    var client_id           = "secret";

    // pretend this works
    //var base64_auth = Buffer.from(client_id+":"+client_password).toString('base64');
	
	// Base 64 encoded credentials - can get from Postman or any online tool
    var base64_auth = 'YXBwX2NsaWVudF9pZDpzZWNyZXQ=';

    // parameters for call to get token
    var params_token = {
        grant_type: 'client_credentials'
    };

    // options for call to get token
    var options_token = {
        method: 'POST',
        url: uaa_issuer_id + '?grant_type=client_credentials',
        headers : {
                'Accept': 'application/json, application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + base64_auth,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
    }

    //send request to get token
    request(options_token, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                // if we successfully get the token, parse response body to json
                // access token from json assigned to var for db call
                var body = JSON.parse(response.body);
				// Store in variable 
                var access_token = body.access_token;
				// Log in console
				console.log('Auth in Auth worked');
				// Return the token to the requestor
				res.send(access_token);
            }
            else{
				// Log the error getting the auth token
                console.log(error);
                console.log('error getting auth token')
            }
    	})

    //req.query contains the url queries, can be used to get specific time data down the line
    //by modifying the start / end key/value pairs in json_data below
    console.log(req.query);

};
