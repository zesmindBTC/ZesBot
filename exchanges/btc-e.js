var BTCE = require('btce'),
	_ = require('lodash');

function Trader (con){
	"use strict";

	if(!(this instanceof Trader))
		return new Trader(con);

	this.config = con;
	this.btce = new BTCE(con.key, con.secret);
	this.activeOrders=[];

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
Trader.prototype.getInfoAccount = function(){

	this.btce.getInfo(function(err, data) {
	  if (!err){
	  	console.log(data);	
	  } 
	  else 
	  	console.log(err);
	});
}

Trader.prototype.placeOrder = function(parametros){
	if(!parametros) throw new Error('Error faltan los parametros');
	if(!parametros.type) throw new Error('Se debe determinar el tipo de operación');
	if(!parametros.rate) throw new Error("Falta el valor de la operación");
	if(!parametros.amount) throw new Error("Falta la cantidad de la operación");
	if(!parametros.pair) parametros.pair = this.config.pair;

	this.btce.trade({'pair': parametros.pair, 'type': parametros.type, 'rate': parametros.rate, 'amount': parametros.amount},_.bind(function(err, data) {
	  if (!err){
	  	console.log(data);
	  	this.activeOrders.push(data.return.order_id);
	  	console.log(this.activeOrders[this.activeOrders.length-1]);
	  } 
	  else console.log(err);
	},this));
}


Trader.prototype.cancelOrder = function(order_id){
	if(!order_id) throw new Error('Falta la orden');

	this.btce.cancelOrder(order_id, _.bind(function(err, data) {
	  var a = -1;
	  if (!err){  	
	  	console.log(data);
	  	a = this.activeOrders.indexOf(data.return.order_id);
	  	if(a != -1){
	  		console.log(this.activeOrders[a]);
	  		this.activeOrders.splice(index, 1);
	  	}
	  } 
	  else console.log(err);
	},this));
}




