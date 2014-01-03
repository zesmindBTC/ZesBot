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
	
	this.calculo.NuevoValor(candle);
	
	this.contadorPrueba += 1;

	if(this.contadorPrueba > this.config.candlesCount){
		this.Verificar();	
	}
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
	console.log("Comprar a "+this.calculo.valores[this.config.candlesCount-1]+",");
	
	

	
}

Operacion.prototype.Vender = function(){
	console.log("Vender a "+this.calculo.valores[this.config.candlesCount-1]+",");
}


Operacion.prototype.ChequearOrden = function(){
	console.log("Chequeamos");
}
