var _ = require('lodash');

function Candle (con,Trader,Opera){
	"use strict";

    if(!(this instanceof Candle))
        return new Candle(con,Trader,Opera);
//var MONGOHQ_URL="mongodb://nodejitsu:de9720a1df0ff9ea226b0d60eaa61459@linus.mongohq.com:10032/nodejitsudb5735702882";
    this.candlePeriod = con.candlePeriod;
    this.pair = con.pair;
	this.timeLastCandle = 0;
    this.Operacion = Opera;
    this.btcePublic = Trader;
    this.contador = 0;
	_.bindAll(this);
}


module.exports = Candle;

Candle.prototype.createNewCandle = function(db) {
		"use strict";

		var collectionTrades = db.collection("trades"),
            collectionCandles = db.collection("candles");

         var callbackTradesPeriodoCandle = function(err,result){
             var openPrice= 0,
                closePrice= 0,
                minPrice=0,
                maxPrice= 0,
                avgPrice= 0,
                avgAmountPrice= 0,
                transactions= 0,
                volumeBTC= 0,
			    timeOpen= 0,
                candle = {};

             if (!err) {
                 if (result.length > 0 ){
                     //genero la candlea
                     openPrice = result[0].price;
                     closePrice = result[result.length-1].price;
                     transactions = result.length;
                     minPrice = result[0].price;
                     maxPrice = result[0].price;

                     result.forEach(function(a){
                         avgPrice += a.price;
                         avgAmountPrice += a.price * a.amount;
                         volumeBTC += a.amount;
                         if (a.price < minPrice) (minPrice = a.price);
                         if (a.price > maxPrice)(maxPrice = a.price);
                     });

                     avgPrice = avgPrice/transactions;
                     avgAmountPrice = avgAmountPrice/volumeBTC;


                     candle.timeOpen = this.timeLastCandle;
                     candle.timeClose = this.timeLastCandle+this.candlePeriod;
                     candle.openPrice = openPrice;
                     candle.closePrice = closePrice;
                     candle.minPrice = minPrice;
                     candle.maxPrice = maxPrice;
                     candle.avgPrice = avgPrice;
                     candle.avgAmountPrice = avgAmountPrice;
                     candle.transactions = transactions;
                     candle.volumeBTC = volumeBTC;

                     if (maxPrice > 0) {
                         //return  candle;
                         var callbackInsert = function(err, result){
                            //incremento el tiempo de la ultima candlea
                            if (!err){
                                //aca se dispara el evento
                                this.timeLastCandle +=this.candlePeriod;
                                console.log(result[0]);
                                this.Operacion.Operar(result[0]);
                            }
                            else{
                                console.log(err);
                            }
                         };
                         collectionCandles.insert(candle, _.bind(callbackInsert,this));
                     }
                     else{
                         //hubo un problema en el calculo de la candlea, lanzo error.
                     }
                 }
                 else{//Se cumplio el tiempo pero no hay trades, entonces incremento timeLastCandle en un periodo
                     this.timeLastCandle +=this.candlePeriod;
                 }
             }
             else{
                 //no hay trades en la DB, no hago nada. Lanzo error
             }
         }

        //si el timeLastCandle es = 0, lo cargo con el timeServer actual del ticker
        if (this.timeLastCandle ===0 ){
            this.actualizarCandles(db);
        }
        else {  //Si timeLastCandle es <> 0, entonces verfico si se cumplio el lapso de una candlea nueva
            //Levanto el ultimo trade para hacer la diferencia respecto del ultimo candle y verificar si se cumplio el lapso
         var callbackFindLastTrade =  function(err,result){
                if (!err){
                    if (result){
                        //verifico si se cumplio el lapso del candle
                        if ((result.date-this.timeLastCandle)>this.candlePeriod){
                            collectionTrades.find({date: {$gte:this.timeLastCandle, $lt:(this.timeLastCandle+this.candlePeriod)}}).toArray(_.bind(callbackTradesPeriodoCandle,this));
                        }
                    }
                    else{
                        //no hay trades en la DB, no hago nada. Lanzo error
                    }

                }
                else {
                    //lanzar error
                }
            };

          collectionTrades.findOne({},{sort: {'date':-1}},_.bind(callbackFindLastTrade,this));


        }
}

Candle.prototype.createFirstCandle = function(db, timeServer) {
    "use strict";

    var collectionTrades = db.collection("trades"),
        collectionCandles = db.collection("candles");

        var timeActual = timeServer;

        //creo el indice para las candles
        db.collection('candles', function(err,collection){
		collection.ensureIndex({'timeOpen':1}, function(){})
		});
        console.time("creacion-candles");
		for (var i=1;i<300;i++){
			this.createCandle(timeActual-(this.candlePeriod*(300-i)),timeActual-(this.candlePeriod*(299-i)),db);
			 if (i===299) {
                this.timeLastCandle = timeActual;
			      //this.actualizarTimeLastCandle(db);
			 };
		}
        console.timeEnd("creacion-candles");
	    

}

Candle.prototype.createCandle = function (tInicio, tFin,db) {
    var  timeInicio = tInicio;
    var timeFin = tFin;
    var collectionTrades = db.collection("trades"),
            collectionCandles = db.collection("candles");

    var self = this;


		var operarNico = function(err,result) {
       		 if (!err) {
            	if (result.length > 0 ){

            		result.reverse();
                    console.log(result.length);
            		result.forEach(function(a){
        	            self.Operacion.Operar(a);
            		});
            	}

            }
        }

        var final  = function(){
            if (isNaN(this.contador)) {this.contador = 0};
        	this.contador += 1;
        	//console.log("contador: " + this.contador);
        	if (this.contador===299){
	        	collectionCandles.find({},{sort: {'timeOpen':-1},limit:200}).toArray(_.bind(operarNico,self));
	    	}
	    };



        var callbackTradesPeriodoCandle = function(err,result){
        var openPrice= 0,
            closePrice= 0,
            minPrice=0,
            maxPrice= 0,
            avgPrice= 0,
            avgAmountPrice= 0,
            transactions= 0,
            volumeBTC= 0,
            timeOpen= 0,
            candle = {};

            var timeInicioI = timeInicio;
            var timeFinI = timeFin;

        if (!err) {
            final();
            if (result.length > 0 ){
                //genero la candlea
                openPrice = result[0].price;
                closePrice = result[result.length-1].price;
                transactions = result.length;
                minPrice = result[0].price;
                maxPrice = result[0].price;

                result.forEach(function(a){
                    avgPrice += a.price;
                    avgAmountPrice += a.price * a.amount;
                    volumeBTC += a.amount;
                    if (a.price < minPrice) (minPrice = a.price);
                    if (a.price > maxPrice)(maxPrice = a.price);
                });

                avgPrice = avgPrice/transactions;
                avgAmountPrice = avgAmountPrice/volumeBTC;


                candle.timeOpen = timeInicioI;
                candle.timeClose = timeFinI;
                candle.openPrice = openPrice;
                candle.closePrice = closePrice;
                candle.minPrice = minPrice;
                candle.maxPrice = maxPrice;
                candle.avgPrice = avgPrice;
                candle.avgAmountPrice = avgAmountPrice;
                candle.transactions = transactions;
                candle.volumeBTC = volumeBTC;

                if (maxPrice > 0) {
                    //return  candle;
                    var callbackInsert = function(err, result){
                        //incremento el tiempo de la ultima candlea
                        if (!err){
                            //aca se dispara el evento
                               // console.log(result);
                        }
                        else{
                            console.log(err);
                        }
                    };
                    collectionCandles.insert(candle, _.bind(callbackInsert,self));
                }
                else{
                    //hubo un problema en el calculo de la candlea, lanzo error.
                }
            }
            else {
            	//console.log("length = 0");
            }
        }
       else{
            //no hay trades en la DB, no hago nada. Lanzo error
            //console.log("no hay candle")
       }
    }
    try {
        collectionTrades.find({date: {$gte:tInicio, $lt:tFin}}).toArray(_.bind(callbackTradesPeriodoCandle,self));
    }
    catch(err)
        {
            console.log(err);
        }
}



Candle.prototype.actualizarTimeLastCandle = function(db) {
	var callbackTicker = function(err, data) {
	    var timeServer;
	    if (!err) {
	        try{
	            this.timeLastCandle = data.ticker.server_time;
	        }
	        catch (err) {

	        }
	    }
	}
	this.btcePublic.getTicker(this.pair, _.bind(callbackTicker,this));
}

Candle.prototype.actualizarCandles = function(db) {
   var callbackTicker = function(err, data) {
   var timeServer;
       if (!err) {
           try{
                this.createFirstCandle(db,data.ticker.server_time);
               }
           catch (err) {

            }
        }
       };
    this.btcePublic.getTicker(this.pair, _.bind(callbackTicker,this));
}




