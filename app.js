var config = require("./config"),
	btce = new require("./exchanges/btc-e")(config),
	mongoClient = require('mongodb').MongoClient,
	ema = new require("./methods/EMA")(btce);

	
mongoClient.connect('mongodb://nodejitsu:d558c04811085a87670aa6a1c38c1efe@dharma.mongohq.com:10051/nodejitsudb6947821225', function(err, db) {
	"use strict";
	
	try
	{
		if(err) throw err;

		var parametros = {
			seconds: config.seconds,
			pair : config.pair
		};
		 
		btce.getTradesBySeconds(parametros,db,ema.calculateCandles);

	}
	catch(err){
		console.log(err);
	}		
});



/*
Lucas
1.-Candles: 
	-TiempoInicio
	-TiempoFin
2.-Profundidad de datos por defecto 3 horas. 
3.-Cantidad de candles a utilizar por defecto 100 lo demas desaparece. 
4.-Periodo por defecto 5 minutos. 


Nico.
Etapa 1:Inicialización
1.-Armar vector con tiempo fin y precio close. Tiene que ser ordenado del mas viejo al mas nuevo. Con 100 candles. 
Por cada una calculo:
	WMA : Tomo 10 o menos valores hacia atras y hago la suma de cada valor x la distancia al que estoy calculando. 
2.-Calcular WMA 







*/