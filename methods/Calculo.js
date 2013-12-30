var _ = require('lodash');

function Calculo (){
	"use strict";

	if(!(this instanceof Calculo))
		return new Calculo();
	
	this.candles = [];
	_.bindAll(this);
	
}

module.exports = Calculo;

Calculo.prototype.WMA = function(err,periodo){
	
	



	var suma = 0; 

	if (err) throw err;

	if(trades.length > 0){
		_.forEach(trades, function(trade) { 			
			suma = suma + trade.price;
		});

		this.candles.push(suma/trades.length);	
	}
	
	console.log(this.candles);
}

