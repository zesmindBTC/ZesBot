var _ = require('lodash');

function Calculo (con){
	"use strict";

	if(!(this instanceof Calculo))
		return new Calculo(con);

	this.timestamps = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.valores = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.primerWMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
	this.segundoWMA = Array.apply(null, new Array(con.candlesCount)).map(Number.prototype.valueOf,0);
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


Calculo.prototype.WMAi = function(parametros){
	if(!parametros) parametros = {};
	if(!parametros.periodo) parametros.periodo = 10;
	if(!parametros.candles) throw new Error("No llegaron los candles WMA");
		
	var resultadoWMA = [];

	for (var i = 0; i < parametros.candles.length; i++) {
		if(i < parametros.periodo - 1){
			resultadoWMA.push(this.PromedioWMA(parametros.candles.slice(0,i+1)));
		}
		else{
			resultadoWMA.push(this.PromedioWMA(parametros.candles.slice((i - parametros.periodo) + 1,i+1)));
		}
	};
	
	return resultadoWMA;
}

Calculo.prototype.NuevoValor = function(candle){
	"use strict";
	if(!candle) throw new Error("No llego el candle");

	this.timestamps.shift();
	this.valores.shift();
	this.primerWMA.shift();
	this.segundoWMA.shift();
	this.HMA.shift();
	this.derivada1.shift();
	this.derivada2.shift();
	this.regresionLinealOrdenada.shift();
	this.regresionLinealPendiente.shift();

	// this.timestamps.push(candle.tiemstamp);
	this.valores.push(candle);


	this.primerWMA.push(this.WMA(this.config.periodo / 2));

	this.segundoWMA.push(this.WMA(this.config.periodo));

	// this.HMA.push();
	// this.derivada1.push();
	// this.derivada2.push();
	// this.regresionLinealOrdenada.push();
	// this.regresionLinealPendiente.push();

}

Calculo.prototype.WMA = function(periodo){
	"use strict";
	if(!periodo)  throw new Error("No llego el periodo");
	
	var sumaParcial = 0,
		sumaDenominador = 0;

	for (var i = 0; i <= periodo - 1; i++) {
		sumaParcial += this.valores[this.valores.length - periodo + i] * (i + 1);
		sumaDenominador += (i+1);
	};

 	return (sumaParcial/sumaDenominador);
}

Calculo.prototype.PromedioWMA = function(candles){
	if(!candles) throw new Error("Faltan los valores para calcular el promedio");

	var periodos = candles.length,
		sumaParcial = 0,
		sumaDenominador = 0;

	for (var i = 0; i <= periodos - 1; i++) {
		sumaParcial += candles[i] * (i + 1);
		sumaDenominador += (i+1);
	};

 	return (sumaParcial/sumaDenominador);
}


Calculo.prototype.HMA = function(parametros){
	if(!parametros) parametros = {};
	if(!parametros.periodo) throw new Error("Falta periodo");
	if(!parametros.primerWMA) throw new Error("Falta el primer WMA");
	if(!parametros.segundoWMA) throw new Error("Falta el segundo WMA");
		
	var resultadoHMA = [],
		argumentos = {},
		vectorHMA = [];

	for (var i = 0; i < parametros.primerWMA.length; i++) {	
		vectorHMA.push(parametros.primerWMA[i]*2 - parametros.segundoWMA[i]);
	};

	argumentos.periodo = parametros.periodo;
	argumentos.candles = vectorHMA;

	resultadoHMA = this.WMA(argumentos);
	console.log(resultadoHMA);
	return resultadoHMA;
}

