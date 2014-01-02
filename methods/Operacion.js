var _ = require('lodash');

function Operacion (Calculo,config){
	"use strict";

	if(!(this instanceof Operacion))
		return new Operacion(Calculo,config);

	this.config = config;
	this.calculo = Calculo;
	this.contadorPrueba = 0;
	_.bindAll(this);
}

module.exports = Operacion;

Operacion.prototype.Verificar = function(candle){
	var s1=0,
		s2=0,
		s3=0,
		sUC=0,
		sUV=0;

	this.calculo.NuevoValor(candle);
	
	this.contadorPrueba += 1;

	if(this.contadorPrueba > 200){

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
	
}

Operacion.prototype.Comprar = function(){
	console.log("Comprar a "+this.calculo.valores[this.config.candlesCount-1]+",");
}

Operacion.prototype.Vender = function(){
	console.log("Vender a "+this.calculo.valores[this.config.candlesCount-1]+",");
}