var BTCE = require('btce'),
	_ = require('lodash');

function Trader (con){
	"use strict";

	if(!(this instanceof Trader))
		return new Trader(con);

	this.config = con;
	this.btce = new BTCE(con.key, con.secret);
	this.activeOrders=0;

	_.bindAll(this);
}

module.exports = Trader;

//Obtiene el estado actual
Trader.prototype.getTicker = function(pair,callback){
	var pair; 
	if(!pair) pair = this.config.pair;

	this.btce.ticker({pair:pair}, function(err, data) {
	 	if(err) throw callback(err,null);
	  	callback(err,data);
	});
}

//Devuelve la información actual 
Trader.prototype.getInfoAccount = function(callback){

	this.btce.getInfo(callback);
}

Trader.prototype.placeOrder = function(parametros){
	if(!parametros) throw new Error('Error faltan los parametros');
	if(!parametros.type) throw new Error('Se debe determinar el tipo de operación');
	if(!parametros.rate) throw new Error("Falta el valor de la operación");
	if(!parametros.amount) throw new Error("Falta la cantidad de la operación");
	if(!parametros.pair) parametros.pair = this.config.pair;

	this.btce.trade({'pair': parametros.pair, 'type': parametros.type, 'rate': parametros.rate, 'amount': parametros.amount},_.bind(function(err, data) {
	  if (!err){
	  	this.activeOrders = data.return.order_id;
	  	console.log(this.activeOrders);
	  } 
	  else console.log(err);
	},this));
}


Trader.prototype.cancelOrder = function(callback){
	this.btce.cancelOrder(this.activeOrders, _.bind(function(err, data) {
	  if (!err){  		  	
	  	this.activeOrders = 0;
	  	callback();
	  } 
	  else console.log(err);
	},this));
}

Trader.prototype.getDepth = function(parametros,callback){
	if(!parametros) parametros = {};
	if(!parametros.count) parametros.count = 100;
	if(!parametros.pair) parametros.pair = this.config.pair;

	this.btce.depth(parametros,callback);
}


