var config = require("./config"),
	btcE = new require("./exchanges/btc-e")(config),
	Calculo = new require("./methods/Calculo")(config),	
	Operacion = new require("./methods/Operacion")(Calculo,btcE,config),
	Candela = new require("./methods/Candle")(config,btcE,Operacion),
	mongoClient = require('mongodb').MongoClient;

	

mongoClient.connect(config.mongodbConnection, function(err, db) {
	"use strict";
	
	try
	{
		if(err) throw err;

		setInterval(function(){
			Candela.createNewCandle(db);
		},30000);

	}
	catch(err){
		console.log(err);
	}		
});


