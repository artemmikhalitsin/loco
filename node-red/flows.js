[{"id":"1e88feab.2a7d71","type":"tab","label":"Endpoints","disabled":false,"info":""},{"id":"6f29c5a8.858f9c","type":"subflow","name":"Lat & Lon from query","info":"","category":"","in":[{"x":50,"y":30,"wires":[{"id":"f9104a6a.266768"}]}],"out":[{"x":680,"y":120,"wires":[{"id":"6667e6b6.085428","port":0}]}]},{"id":"ea0c3775.ff92e8","type":"subflow","name":"Set graphql info","info":"","category":"","in":[{"x":140,"y":80,"wires":[{"id":"d3c5ba8d.799ac8"}]}],"out":[{"x":620,"y":80,"wires":[{"id":"7a0fd680.cecfc8","port":0}]}]},{"id":"62ef25bb.2aa3ec","type":"graphql-server","z":"","endpoint":"https://cuql6pzns5fbtnhcrouhbnr754.appsync-api.us-east-1.amazonaws.com/graphql","name":"AWS GraphQL"},{"id":"7eb6e152.5cc16","type":"inject","z":"1e88feab.2a7d71","name":"Manual inject","topic":"","payload":"{\"lat\":45.4579587,\"lon\":-73.5689148,\"wsapikey\":\"21e92856074e1e40083bf6274fab6a56\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":110,"y":160,"wires":[["8f247a47.94fa78"]]},{"id":"8f247a47.94fa78","type":"template","z":"1e88feab.2a7d71","name":"Create walkscore url","field":"url","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"http://api.walkscore.com/score?format=json&&lat={{payload.lat}}&lon={{payload.lon}}&bike=1&wsapikey=21e92856074e1e40083bf6274fab6a56","output":"str","x":320,"y":160,"wires":[["8fb04842.d83e98"]]},{"id":"8fb04842.d83e98","type":"http request","z":"1e88feab.2a7d71","name":"Walkscore API","method":"GET","ret":"obj","url":"","tls":"","x":520,"y":160,"wires":[["ab6277ac.40aba8"]]},{"id":"479681b1.c8661","type":"http in","z":"1e88feab.2a7d71","name":"GET /walkscore","url":"/walkscore","method":"get","upload":false,"swaggerDoc":"","x":80,"y":240,"wires":[["db2e34d3.cfc5f8"]]},{"id":"2b2df5db.c3d22a","type":"http response","z":"1e88feab.2a7d71","name":"Success","statusCode":"200","headers":{},"x":880,"y":160,"wires":[]},{"id":"aaee2956.b83588","type":"inject","z":"1e88feab.2a7d71","name":"","topic":"","payload":"{\"lat\":45.4579587,\"lon\":-73.5689148}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":70,"y":400,"wires":[["86c35ddf.3117b"]]},{"id":"16f5eb9.8b09114","type":"http request","z":"1e88feab.2a7d71","name":"","method":"POST","ret":"obj","url":"","tls":"","x":530,"y":540,"wires":[["1cb54c84.1e27b3"]]},{"id":"db16cfbc.116fe","type":"function","z":"1e88feab.2a7d71","name":"set payload","func":"msg.payload = {\n    query: `\n    query SearchCrimes{\n  searchCrimes(\n    filter: {\n      lon:{\n        range: [${msg.payload.lon-0.01}, ${msg.payload.lon+0.01}]\n      },\n      lat:{\n        range: [${msg.payload.lat-0.01}, ${msg.payload.lat+0.01}]\n      }\n    }\n  ) {\n    items {\n      id\n      type\n      lon\n      lat\n      date\n      timeset\n    }\n    nextToken\n  }\n}`\n}\nreturn msg;","outputs":1,"noerr":0,"x":340,"y":540,"wires":[["16f5eb9.8b09114"]]},{"id":"15fb1af4.3ac265","type":"http in","z":"1e88feab.2a7d71","name":"GET /crimes","url":"/crimes","method":"get","upload":false,"swaggerDoc":"","x":70,"y":460,"wires":[["86c35ddf.3117b"]]},{"id":"6667e6b6.085428","type":"function","z":"6f29c5a8.858f9c","name":"Does request have both lat and lon?","func":"if(msg.payload.lat === undefined || msg.payload.lon === undefined) {\n    msg.payload = \"Must provide both lat and lon\"\n    return [null, msg]\n}\nreturn [msg, null]","outputs":2,"noerr":0,"x":490,"y":140,"wires":[[],["6b6432c4.e8c69c"]]},{"id":"6b6432c4.e8c69c","type":"http response","z":"6f29c5a8.858f9c","name":"NO (Bad request)","statusCode":"400","headers":{},"x":630,"y":200,"wires":[]},{"id":"f9104a6a.266768","type":"change","z":"6f29c5a8.858f9c","name":"Lat & Lon from query","rules":[{"t":"set","p":"payload","pt":"msg","to":"req.query","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":200,"y":140,"wires":[["6667e6b6.085428"]]},{"id":"86c35ddf.3117b","type":"subflow:6f29c5a8.858f9c","z":"1e88feab.2a7d71","name":"","x":260,"y":480,"wires":[["bef03002.a3a13"]]},{"id":"d3c5ba8d.799ac8","type":"function","z":"ea0c3775.ff92e8","name":"set auth header","func":"msg.headers = {};\nmsg.headers['x-api-key'] = 'da2-flgwi5idqfdjpjsvtaswg6l32e';\nreturn msg;","outputs":1,"noerr":0,"x":280,"y":80,"wires":[["7a0fd680.cecfc8"]]},{"id":"7a0fd680.cecfc8","type":"change","z":"ea0c3775.ff92e8","name":"set graphql url","rules":[{"t":"set","p":"url","pt":"msg","to":"https://cuql6pzns5fbtnhcrouhbnr754.appsync-api.us-east-1.amazonaws.com/graphql","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":480,"y":80,"wires":[[]]},{"id":"bef03002.a3a13","type":"subflow:ea0c3775.ff92e8","z":"1e88feab.2a7d71","name":"","x":460,"y":480,"wires":[["db16cfbc.116fe"]]},{"id":"db2e34d3.cfc5f8","type":"subflow:6f29c5a8.858f9c","z":"1e88feab.2a7d71","name":"","x":280,"y":240,"wires":[["8f247a47.94fa78"]]},{"id":"e7c98edc.5bce9","type":"debug","z":"1e88feab.2a7d71","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":790,"y":220,"wires":[]},{"id":"138ee48e.904efb","type":"comment","z":"1e88feab.2a7d71","name":"Queries info from Walkscore API","info":"","x":150,"y":120,"wires":[]},{"id":"11a814d3.35712b","type":"comment","z":"1e88feab.2a7d71","name":"Queries graphql api for crimes near location","info":"","x":190,"y":340,"wires":[]},{"id":"602aa6c8.df0b98","type":"http response","z":"1e88feab.2a7d71","name":"Success","statusCode":"200","headers":{},"x":860,"y":540,"wires":[]},{"id":"1cb54c84.1e27b3","type":"change","z":"1e88feab.2a7d71","name":"Get only items","rules":[{"t":"set","p":"payload","pt":"msg","to":"payload.data.searchCrimes","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":700,"y":540,"wires":[["602aa6c8.df0b98","b7dd043a.e77138"]]},{"id":"b7dd043a.e77138","type":"debug","z":"1e88feab.2a7d71","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":770,"y":480,"wires":[]},{"id":"ab6277ac.40aba8","type":"function","z":"1e88feab.2a7d71","name":"Trim response","func":"let payload = msg.payload\nmsg.payload = {\n    walkscore: payload.walkscore,\n    description: payload.description,\n    bikescore: payload.bike.score,\n    bikedescription: payload.bike.description\n}\n\nreturn msg","outputs":1,"noerr":0,"x":710,"y":160,"wires":[["2b2df5db.c3d22a","e7c98edc.5bce9"]]},{"id":"9012c2cb.2baa6","type":"comment","z":"1e88feab.2a7d71","name":"Queries a place from Google Maps API","info":"","x":170,"y":640,"wires":[]},{"id":"83cff81a.442fd8","type":"inject","z":"1e88feab.2a7d71","name":"","topic":"","payload":"{\"lat\":45.4579587,\"lon\":-73.5689148,\"query\":\"209 2e\"}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":700,"wires":[["e8a41b1d.c50068"]]},{"id":"e8a41b1d.c50068","type":"subflow:6f29c5a8.858f9c","z":"1e88feab.2a7d71","name":"","x":280,"y":700,"wires":[["292286d1.5a9cba"]]},{"id":"28f25da2.7e49b2","type":"http request","z":"1e88feab.2a7d71","name":"find the place","method":"GET","ret":"obj","url":"","tls":"","x":320,"y":760,"wires":[["9766b8fe.5c1bd8","128cba39.c89936"]]},{"id":"292286d1.5a9cba","type":"function","z":"1e88feab.2a7d71","name":"Create Google API payload","func":"msg.url=`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${msg.payload.query}&locationbias=point:${msg.payload.lat},${msg.payload.lon}&inputtype=textquery&fields=name,geometry,formatted_address&key=AIzaSyCc231s3ei8JU-75vcfNDuQZxaCKcT3vng`\nreturn msg;","outputs":1,"noerr":0,"x":540,"y":700,"wires":[["28f25da2.7e49b2"]]},{"id":"9766b8fe.5c1bd8","type":"debug","z":"1e88feab.2a7d71","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":550,"y":780,"wires":[]},{"id":"dff3208.7ed19e","type":"http response","z":"1e88feab.2a7d71","name":"","statusCode":"200","headers":{},"x":470,"y":840,"wires":[]},{"id":"128cba39.c89936","type":"change","z":"1e88feab.2a7d71","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"payload.candidates","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":300,"y":840,"wires":[["dff3208.7ed19e"]]},{"id":"3a9b9d5b.a60902","type":"http in","z":"1e88feab.2a7d71","name":"","url":"/maps","method":"get","upload":false,"swaggerDoc":"","x":80,"y":760,"wires":[["e8a41b1d.c50068"]]},{"id":"6c2bb8ab.22e778","type":"http response","z":"1e88feab.2a7d71","name":"Success","statusCode":"200","headers":{},"x":860,"y":1100,"wires":[]},{"id":"863284a1.5f0f98","type":"change","z":"1e88feab.2a7d71","name":"Get only items","rules":[{"t":"set","p":"payload","pt":"msg","to":"payload.data.searchFoodInfractions","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":700,"y":1100,"wires":[["6c2bb8ab.22e778","3e1c504e.bca45"]]},{"id":"9ed3b8e9.f70fd8","type":"http request","z":"1e88feab.2a7d71","name":"get the restos","method":"POST","ret":"obj","url":"","tls":"","x":540,"y":1100,"wires":[["863284a1.5f0f98"]]},{"id":"3e1c504e.bca45","type":"debug","z":"1e88feab.2a7d71","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":770,"y":1020,"wires":[]},{"id":"8a389056.6418a","type":"function","z":"1e88feab.2a7d71","name":"set payload","func":"msg.payload = {\n    query: `\n    query SearchFoodInfractions{\n  searchFoodInfractions(\n    filter: {\n      lat:{\n        range: [${msg.payload.lat-0.01},${msg.payload.lat+0.01}]\n      },\n      lon:{\n        range: [${msg.payload.lon-0.01},${msg.payload.lon+0.01}]\n      }\n    }\n  ) {\n    items {\n      id\n      lon\n      lat\n      restoName\n      reason\n      fine\n    }\n    nextToken\n  }\n}`\n}\nreturn msg;","outputs":1,"noerr":0,"x":340,"y":1100,"wires":[["9ed3b8e9.f70fd8"]]},{"id":"dadbcade.23c618","type":"subflow:ea0c3775.ff92e8","z":"1e88feab.2a7d71","name":"","x":460,"y":1040,"wires":[["8a389056.6418a"]]},{"id":"4f260040.3bbfe","type":"subflow:6f29c5a8.858f9c","z":"1e88feab.2a7d71","name":"","x":260,"y":1040,"wires":[["dadbcade.23c618"]]},{"id":"7cdde1d2.c3e5d","type":"http in","z":"1e88feab.2a7d71","name":"GET /badfood","url":"/badfood","method":"get","upload":false,"swaggerDoc":"","x":70,"y":1020,"wires":[["4f260040.3bbfe"]]},{"id":"5fa014d9.58398c","type":"inject","z":"1e88feab.2a7d71","name":"","topic":"","payload":"{\"lat\":45.4579587,\"lon\":-73.5689148}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":70,"y":960,"wires":[["4f260040.3bbfe"]]},{"id":"ad408cb7.cd8a2","type":"comment","z":"1e88feab.2a7d71","name":"Queries graphql api for food infractions near location","info":"","x":190,"y":900,"wires":[]},{"id":"f854ff31.577e6","type":"comment","z":"1e88feab.2a7d71","name":"Nearby metro","info":"","x":90,"y":1160,"wires":[]},{"id":"637fc15a.dfb3e","type":"inject","z":"1e88feab.2a7d71","name":"","topic":"","payload":"{\"lat\":45.4579587,\"lon\":-73.5689148}","payloadType":"json","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":90,"y":1220,"wires":[["83358230.baae2"]]},{"id":"83358230.baae2","type":"subflow:6f29c5a8.858f9c","z":"1e88feab.2a7d71","name":"","x":280,"y":1220,"wires":[["795212f5.41f12c"]]},{"id":"803a30c1.5fcd2","type":"http request","z":"1e88feab.2a7d71","name":"get nearby metros","method":"GET","ret":"obj","url":"","tls":"","x":330,"y":1280,"wires":[["19dd2104.2349ff"]]},{"id":"795212f5.41f12c","type":"function","z":"1e88feab.2a7d71","name":"Create Google API payload","func":"// Preserve the origin\nmsg.origin=msg.payload\nmsg.url=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${msg.payload.lat},${msg.payload.lon}&radius=500&type=subway_station&key=AIzaSyCc231s3ei8JU-75vcfNDuQZxaCKcT3vng`\nreturn msg;","outputs":1,"noerr":0,"x":540,"y":1220,"wires":[["803a30c1.5fcd2"]]},{"id":"5b5f9945.143018","type":"debug","z":"1e88feab.2a7d71","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","x":330,"y":1580,"wires":[]},{"id":"19dd2104.2349ff","type":"change","z":"1e88feab.2a7d71","name":"take the results","rules":[{"t":"set","p":"payload","pt":"msg","to":"payload.results","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":140,"y":1360,"wires":[["870d8377.6a6b"]]},{"id":"9dc5488e.6b0108","type":"http in","z":"1e88feab.2a7d71","name":"","url":"/metro","method":"get","upload":false,"swaggerDoc":"","x":80,"y":1280,"wires":[["83358230.baae2"]]},{"id":"49dcd758.8aa988","type":"http response","z":"1e88feab.2a7d71","name":"OK","statusCode":"200","headers":{},"x":470,"y":1540,"wires":[]},{"id":"870d8377.6a6b","type":"split","z":"1e88feab.2a7d71","name":"process each result","splt":"\\n","spltType":"str","arraySplt":1,"arraySpltType":"len","stream":false,"addname":"","x":350,"y":1360,"wires":[["61bfad28.3f5884"]]},{"id":"f8f66b13.3cb538","type":"http request","z":"1e88feab.2a7d71","name":"","method":"GET","ret":"obj","url":"","tls":"","x":110,"y":1480,"wires":[["a9f5a1a2.eccfb"]]},{"id":"61bfad28.3f5884","type":"function","z":"1e88feab.2a7d71","name":"Create the distance matrix query","func":"msg.stationName = msg.payload.name\nmsg.url = `https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&units=metric&origins=${msg.origin.lat},${msg.origin.lon}&destinations=place_id:${msg.payload.place_id}&key=AIzaSyCc231s3ei8JU-75vcfNDuQZxaCKcT3vng`\nreturn msg","outputs":1,"noerr":0,"x":220,"y":1420,"wires":[["f8f66b13.3cb538"]]},{"id":"2033c8b9.48e248","type":"join","z":"1e88feab.2a7d71","name":"join results","mode":"auto","build":"string","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":false,"timeout":"","count":"","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"","reduceFixup":"","x":170,"y":1540,"wires":[["49dcd758.8aa988","5b5f9945.143018"]]},{"id":"a9f5a1a2.eccfb","type":"function","z":"1e88feab.2a7d71","name":"add station name back","func":"msg.payload = {\n    station: msg.stationName,\n    walkingDistance: msg.payload.rows[0].elements[0].duration.text\n}\nreturn msg;","outputs":1,"noerr":0,"x":460,"y":1480,"wires":[["2033c8b9.48e248"]]}]