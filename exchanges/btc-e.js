var BTCE = require('btce'),
	_ = require('lodash');

function Trader (con){
	"use strict";

	if(!(this instanceof Trader))
		return new Trader(con);

	this.config = con;
	this.btce = new BTCE(con.key, con.secret);

	_.bindAll(this);
}

module.exports = Trader;

//Obtiene el estado actual
Trader.prototype.getTicker = function(pair,callback){
	var pair; 
	if(!pair) pair = 'btc_usd';

	this.btce.ticker({pair:pair}, function(err, data) {
	 	if(err) throw callback(err,null);
	  	callback(err,data);
	});
}

//Devuelve la información actual 
Trader.prototype.getInfoAccount = function(){

	this.btce.getInfo(function(err, data) {
	  if (!err){
	  	console.log(data);	
	  } 
	  else 
	  	console.log(err);
	});
}

Trader.prototype.updateTrades = function(count,pair,db){

	var parametros = {},
		trades;

	if(!count) parametros.count = 200;
	if(!pair) parametros.pair = 'btc_usd';
	if(!db) throw new Error('Falta el parametro db');
		
	trades = db.collection("trades");

	this.btce.trades(parametros,function(err,data){
	   	if(err) throw err;
		
		data.forEach(function(a){
			trades.findOne({'tid':a.tid}, function(err, result) {
				if(err) throw err;

				if (!result) {
					trades.insert(a, function (err, result) {			            
			           if(err) throw err;
			           console.log('Agrego un trade nuevo con tid: '+result[0].tid);
			        });
					
				} 
			});				
		 });
	});
}

// Recibe como parámetro un {object literal} para que el día de mañana
// no se modifique la firma del método si se requieren mas parámetros.

Trader.prototype.getTradesBySeconds = function(parametros,db,callback){
	if(!parametros) parametros = {};
	if(!parametros.seconds) parametros.seconds = 300;
	if(!parametros.pair) parametros.pair = 'btc_usd';
	if(!db) throw new Error('Falta el parametro db');
	
	var trades = db.collection("trades"),
		query,
		option =  {"sort": ['tid','asc']};
	
	this.getTicker(parametros.pair,function(err,data){

		if(err) throw err;

		query = {"date":{$gt:data.ticker.server_time-parametros.seconds}};

		trades.find(query, option).toArray(function(err, items){

			if(err) callback(err,null);

			callback(err,items);
		});

	});
		
}

Trader.prototype.placeOrder = function(parametros,callback){
	if(!parametros) throw new Error('Se debe determinar el tipo de operación');
	if(!parametros.type) throw new Error('Se debe determinar el tipo de operación');
	if(!parametros.rate) throw new Error("Falta el valor de la operación");
	if(!parametros.amount) throw new Error("Falta la cantidad de la operación");
	if(!parametros.pair) parametros.pair = 'btc_usd';

	
	

}




