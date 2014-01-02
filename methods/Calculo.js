var _ = require('lodash');

function Calculo (con){
	"use strict";

	if(!(this instanceof Calculo))
		return new Calculo(con);

	this.timestamps = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.valores = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.primerWMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.segundoWMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.vectorCalculadoHMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.HMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.derivada1 = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.derivada2= Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.regresionLinealPendiente = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.regresionLinealOrdenada = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.config = con;

	_.bindAll(this);
}

module.exports = Calculo;

// Calculo.prototype.Inicializar = function(parametros){
	// if(!parametros) parametros = {};
	// if(!parametros.candles) throw new Error("No llegaron los candles WMA");
	// if(!parametros.periodoHMA) parametros.periodoHMA = 25;

	// var primerWMA = [],
	// 	segundoWMA = [];

	// //seteamos parametros para calcular el primer WMA
	// parametros.candles = candela;
	// parametros.periodo = periodo/2;
	// primerWMA = Calculo.WMA(parametros);
	// // console.log(primerWMA);

	// //seteamos parametros para calcular el segundo WMA
	// parametros.candles = primerWMA;
	// parametros.periodo = periodo;
	// segundoWMA = Calculo.WMA(parametros);
	// // console.log(segundoWMA);

	// //Calculamos el HMA 
	// parametros.periodo =  Math.floor(Math.sqrt(periodo));
	// parametros.primerWMA = primerWMA;
	// parametros.segundoWMA = segundoWMA;
	// Calculo.HMA(parametros);
// }

Calculo.prototype.NuevoValor = function(candle){
	"use strict";
	if(!candle) throw new Error("No llego el candle");

	var parametros = {
			vector : this.valores
		};	


	this.timestamps.shift();
	this.valores.shift();
	this.primerWMA.shift();
	this.segundoWMA.shift();
	this.vectorCalculadoHMA.shift();
	this.HMA.shift();
	this.derivada1.shift();
	this.derivada2.shift();
	this.regresionLinealOrdenada.shift();
	this.regresionLinealPendiente.shift();

	// this.timestamps.push(candle.tiemstamp);
	this.valores.push(candle);

	parametros.periodo = Math.floor(this.config.periodo / 2);
	this.primerWMA.push(this.WMA(parametros));

	parametros.periodo = this.config.periodo;
	this.segundoWMA.push(this.WMA(parametros));
	

	this.vectorCalculadoHMA.push(2*this.primerWMA[this.primerWMA.length-1] - this.segundoWMA[this.segundoWMA.length-1]);

	parametros.periodo = Math.floor(Math.sqrt(this.config.periodo));
	parametros.vector = this.vectorCalculadoHMA;

	this.HMA.push(this.WMA(parametros));

	// this.derivada1.push();
	// this.derivada2.push();
	// this.regresionLinealOrdenada.push();
	// this.regresionLinealPendiente.push();

}

Calculo.prototype.WMA = function(parametros){
	"use strict";
	if(!parametros) parametros = {};
	if(!parametros.periodo)  throw new Error("No llego el periodo");
	if(!parametros.vector) throw new Error("No llego el vector para calcular");
	
	var sumaParcial = 0,
		sumaDenominador = 0;

	for (var i = 0; i <= parametros.periodo - 1; i++) {
		sumaParcial += parametros.vector[parametros.vector.length - parametros.periodo + i] * (i + 1);
		sumaDenominador += (i+1);
	};

 	return (sumaParcial/sumaDenominador);
}