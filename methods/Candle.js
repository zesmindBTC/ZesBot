var _ = require('lodash');

function Candle (con,Trader){
	"use strict";

    if(!(this instanceof Candle))
        return new Candle(con);

//var MONGOHQ_URL="mongodb://nodejitsu:de9720a1df0ff9ea226b0d60eaa61459@linus.mongohq.com:10032/nodejitsudb5735702882";
    this.candlePeriod = con.candlePeriod;
    this.pair = con.pair;
	this.timeLastCandle = 0;
    this.btcePublic = Trader;
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
                     candle.timeClose = dateEnd;
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
                         var callbackInsert = function(){
                             //incremento el tiempo de la ultima candlea
                             this.timeLastCandle +=this.candlePeriod;
                         };
                         collectionCandle.insert(candle, _.bind(callbackInsert,this));
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
            this.actualizarTimeLastCandle();
        }
        else {  //Si timeLastCandle es <> 0, entonces verfico si se cumplio el lapso de una candlea nueva
            //Levanto el ultimo trade para hacer la diferencia respecto del ultimo candle y verificar si se cumplio el lapso
         var callbackFindLastTrade =  fuction(err,result){
                if (!err){
                    if (result.length > 0 ){
                        //verifico si se cumplio el lapso del candle
                        if ((result.date-this.timeLastCandle)>this.candlePeriod){
                            collectionTrades.find({{date: {$gte:this.timeLastCandle, $lt:(this.timeLastCandle+this.candlePeriod)}}}).toArray(_.bind(this.callbackTradesPeriodoCandle,this));
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

          collectionTrades.findOne({},{ sort: [['date':-1]]},_.bind(callbackFindLastTrade,this));


        }
}



Candle.prototype.actualizarTimeLastCandle = function() {
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

	btcePublic.getTicker(this.pair, _.bind(callbackTicker,this));
}




