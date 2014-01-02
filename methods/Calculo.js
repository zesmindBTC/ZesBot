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

    this.timestamps.push(candle.timestamp);
	this.valores.push(candle.valor);

	parametros.periodo = Math.floor(this.config.periodo / 2);
	this.primerWMA.push(this.WMA(parametros));

	parametros.periodo = this.config.periodo;
	this.segundoWMA.push(this.WMA(parametros));
	

	this.vectorCalculadoHMA.push(2*this.primerWMA[this.primerWMA.length-1] - this.segundoWMA[this.segundoWMA.length-1]);

	parametros.periodo = Math.floor(Math.sqrt(this.config.periodo));
	parametros.vector = this.vectorCalculadoHMA;


	this.HMA.push(this.WMA(parametros));

	this.derivada1.push(this.CalculoDerivada1());
	this.derivada2.push(this.CalculoDerivada2());
	
	this.regresionLinealPendiente.push(this.CalcularRegresionLinealPendiente());
	this.regresionLinealOrdenada.push(this.CalcularRegresionLinealOrdenada());
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

Calculo.prototype.CalculoDerivada1 = function(){
	"use strict";
	return (this.HMA[this.HMA.length-1]-this.HMA[this.HMA.length-2])/(this.timestamps[this.timestamps.length-1]-this.timestamps[this.timestamps.length-2]);
}

Calculo.prototype.CalculoDerivada2 = function(){
	"use strict";
	return (this.derivada1[this.derivada1.length-1]-this.derivada1[this.derivada1.length-2])/(this.timestamps[this.timestamps.length-1]-this.timestamps[this.timestamps.length-2]);
}

Calculo.prototype.CalcularRegresionLinealPendiente = function(){
	"use strict";
	var resultado,
		sumaTime = 0,
		sumaValores = 0,
		promedioTime=0,
		promedioValores=0,
		sumatoriaNumerador=0,
		sumatoriaDenominador=0; 

	for (var i = 0; i < this.timestamps.length; i++) {
		sumaTime +=this.timestamps[i];
		sumaValores +=this.valores[i];
	};

	promedioTime = sumaTime/this.timestamps.length;
	promedioValores = sumaValores/this.valores.length;


	for (var i = 0; i < this.timestamps.length; i++) {
		sumatoriaNumerador += (this.timestamps[i]-promedioTime)*(this.valores[i] - promedioValores);
		sumatoriaDenominador+= (this.timestamps[i]-promedioTime)*(this.timestamps[i]-promedioTime);
	};

	if(sumatoriaDenominador != 0)
		return sumatoriaNumerador/sumatoriaDenominador;
	else
		throw new Error("El denominador es 0..cagaste");
}

Calculo.prototype.CalcularRegresionLinealOrdenada = function(){
	"use strict";
	var resultado,
		sumaTime = 0,
		sumaValores = 0,
		promedioTime=0,
		promedioValores=0;

	for (var i = 0; i < this.timestamps.length; i++) {
		sumaTime +=this.timestamps[i];
		sumaValores +=this.valores[i];
	};

	promedioTime = sumaTime/this.timestamps.length;
	promedioValores = sumaValores/this.valores.length;
	
	return promedioValores-(this.regresionLinealPendiente[this.regresionLinealPendiente.length-1]*promedioTime);
}
