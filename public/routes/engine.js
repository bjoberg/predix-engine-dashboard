var request 		= require('request');
/*
 * API route to get time series data
 * @author Kyle Duckworth (212326570)
 * @version 01.02.2017
 */
exports.getEngine = function(req, res){
  console.log("in getEngine");
	// Time series URL to query datapoints
    var timeseries_query_uri 	= 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints';
	// Predix zone ID for Waukesha Engine data
    var timeseries_zone_id 		= 'e3fba85e-d334-409e-87ce-3a17e71b4946';
	// JSON Body for request
  console.log(req.query.engine);
    var json_data =
    {
      "start": "1y-ago",
      "tags": [
          {
            "name": req.params['kpiName'],
            "order": "desc",
            "limit": 1000,
            "filters": {
              "attributes": {
                "AssetUri": [
                  req.query.engine
                ]
              }
            }
          }
      ]
    };
    // options for db call
    var options = {
		// Post request to get the data
        method: 'POST',
		// URL for time series query (generic, defined above)
        url: timeseries_query_uri,
		// Set the headers with the necessary parameters
        headers : {
            'Accept': 'application/json, application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + req.params['token'],
            'Predix-Zone-Id': timeseries_zone_id
        },
		// Body of request
        json : json_data
    };

    // call to db, if successful, return data as json for client
    request(options, function (error, response, body) {
		// If successfull request
        if (!error && response.statusCode == 200) {
            // Send the response back to the requester
			console.log("Success!");
            res.send(response.body);
		}
		// Not successful request
        else{
			// Send error back to the requester
			console.log("Error!" + error);
            res.send(error);
        }
    });
};

