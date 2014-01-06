var _ = require('lodash');

function Operacion (Calculo,Trader,Config){
	"use strict";

	if(!(this instanceof Operacion))
		return new Operacion(Calculo,Trader,Config);

	this.config = Config;
	this.calculo = Calculo;
	this.trader = Trader;
	this.contadorPrueba = 0; // se utiliza para que empiece a verificar a partir que se tengan procesadas 200 candels
	_.bindAll(this);
}

module.exports = Operacion;

Operacion.prototype.Operar = function(candle){
	if(!candle){
		this.calculo.NuevoValor(candle);
		
		this.contadorPrueba += 1;

		if(this.contadorPrueba > this.config.candlesCount){
			this.Verificar();	
		}	
	}
	else
		console.log("No llego ninguna candle");
	
}

Operacion.prototype.Verificar = function(){
	var s1=0,
		s2=0,
		s3=0,
		sUC=0,
		sUV=0;

	if(this.calculo.derivada2[this.config.candlesCount-1] * this.calculo.derivada2[this.config.candlesCount-2] <= 0)
		s1 = 1;
	if(this.calculo.derivada2[this.config.candlesCount-1] > 0)
		s2 = 1;

	if(Math.abs(this.calculo.derivada1[this.config.candlesCount-1])>sUC){
		sUC = 1;
	}

	if((s1*s2*sUC)>0)	
		this.Comprar();
	
	if(this.calculo.derivada2[this.config.candlesCount-1] < 0)
		s3 = 1;

	if(Math.abs(this.calculo.derivada1[this.config.candlesCount-1])>sUV){
		sUV = 1;
	}

	if((s1*s3*sUV)>0)
		this.Vender();	
}

Operacion.prototype.Comprar = function(){
	
	var callbackDepth = function(err, data) {
		var actualPrice = 0,
			actualAmount = 0,
			sellUSD = this.config.usd * (1-this.config.fee),
			amount = 0,
			currentUSD=sellUSD,
			parametros= {
				type:'buy'
			}; 

		if (!err){
			for (var i = 0; i < data.asks.length; i++) {
				actualPrice = data.asks[i][0];
				actualAmount = data.asks[i][1];

				currentUSD -= (actualPrice*actualAmount);

				if(currentUSD <= 0){
					break;
				}
				
			};
			//Redondeamos a 8 decimales
			amount = (sellUSD/actualPrice);
			amount *= 100000000;
			amount = Math.floor(amount);
			amount /= 100000000;
			parametros.rate = actualPrice;
			parametros.amount = amount;
			//this.trader.placeOrder(parametros);
			console.log(parametros);
			setTimeout(function(){this.VerificarOrden();},10000);
		}
		else console.log(err);
	};

	this.trader.getDepth({},_.bind(callbackDepth,this));
}

Operacion.prototype.Vender = function(){
	var callbackDepth = function(err, data) {
			var actualPrice = 0,
				actualAmount = 0,
				sell = this.config.InitialItemAmount * (1-this.config.fee),
				currentAmount=sell,
				parametros= {
					type:'sell'
				}; 

			if (!err){
				for (var i = 0; i < data.bids.length; i++) {
					actualPrice = data.bids[i][0];
					actualAmount = data.bids[i][1];

					currentAmount -= actualAmount;

					if(currentAmount <= 0){
						break;
					}
					
				};
				parametros.rate = actualPrice;
				//se redondea a 8 decimales
				sell *= 100000000;
				sell = Math.floor(sell);
				sell /= 100000000;
				parametros.amount = sell;
				//this.trader.placeOrder(parametros);
				console.log(parametros);
				setTimeout(function(){this.VerificarOrden();},10000);
			}
			else console.log(err);
		};

		this.trader.getDepth({},_.bind(callbackDepth,this));
}


Operacion.prototype.VerificarOrden = function(){
	var callbackGetInfoAccount = function(err,data){

		if(!err){
			if(data.return.open_orders > 0){
				this.trader.cancelOrder(_.bind(this.Verificar,this));
			}
			else{
				this.config.usd = data.return.funds.usd;
				switch(this.config.pair){
					case "btc_usd":
						this.config.InitialItemAmount = data.return.funds.btc;
						break;
					case "ltc_usd":
						this.config.InitialItemAmount = data.return.funds.ltc;
						break;
					case "nmc_usd":
						this.config.InitialItemAmount = data.return.funds.nmc;
						break;
					case "nvc_usd":
						this.config.InitialItemAmount = data.return.funds.nvc;
						break;
					case "ppc_usd":
						this.config.InitialItemAmount = data.return.funds.ppc;
						break;
				}
			}
		}
		else
			console.log(err);

	}
	this.trader.getInfoAccount(_.bind(callbackGetInfoAccount,this));
}
