var http = require('http');
var mongo = require('mongodb');
var url = require('url');
var mongoClient = require('mongodb').MongoClient;
var async = require('async');
var _ = require('lodash');
var btcePublic =  new require("./exchanges/btc-e")(config)

function Candel (con){
	"use strict";

    if(!(this instanceof Candel))
        return new Candel(con);

//var MONGOHQ_URL="mongodb://nodejitsu:de9720a1df0ff9ea226b0d60eaa61459@linus.mongohq.com:10032/nodejitsudb5735702882";
var MONGOHQ_URL="mongodb://localhost:27017/b106";

	this.MONGOHQ_URL= con.mongodbConnection;
    this.candelPeriod = con.candelPeriod;
    this.pair = con.pair;
	this.timeLastCandel = 0;
	_.bindAll(this);
}

module.exports = Candel;

Candel.prototype.createNewCandel = function() {
     var callbackConnect = function(error, db) {
		"use strict";

		var collectionTrades = db.collection("trades");
        var collectionCandels = db.collection("candels");

         var callbackTradesPeriodoCandel = function(err,result){
             var openPrice= 0;
             var closePrice=0;
             var minPrice=0;
             var maxPrice=0;
             var avgPrice=0;
             var avgAmountPrice=0;
             var transactions=0;
             var volumeBTC=0;
			 var timeOpen; 

             var candel = {};
             if (!err) {
                 if (result.length > 0 ){
                     //genero la candela
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


                     candel.timeOpen = this.timeLastCandel;
                     candel.timeClose = dateEnd;
                     candel.openPrice = openPrice;
                     candel.closePrice = closePrice;
                     candel.minPrice = minPrice;
                     candel.maxPrice = maxPrice;
                     candel.avgPrice = avgPrice;
                     candel.avgAmountPrice = avgAmountPrice;
                     candel.transactions = transactions;
                     candel.volumeBTC = volumeBTC;

                     if (maxPrice > 0) {
                         //return  candel;
                         var callbackInsert = function(){
                             //incremento el tiempo de la ultima candela
                             this.timeLastCandel +=this.candelPeriod;
                         };
                         collectionCandel.insert(candel, _.bind(callbackInsert,this));
                     }
                     else{
                         //hubo un problema en el calculo de la candela, lanzo error.
                     }
                 }
                 else{//Se cumplio el tiempo pero no hay trades, entonces incremento timeLastCandel en un periodo
                     this.timeLastCandel +=this.candelPeriod;
                 }
             }
             else{
                 //no hay trades en la DB, no hago nada. Lanzo error
             }
         }

        //si el timeLastCandel es = 0, lo cargo con el timeServer actual del ticker
        if (this.timeLastCandel ===0 ){
            this.actualizarTimeLastCandel();
        };

        //Si timeLastCandel es <> 0, entonces verfico si se cumplio el lapso de una candela nueva
        if (this.timeLastCandel <>0 ){
            //Levanto el ultimo trade para hacer la diferencia respecto del ultimo candel y verificar si se cumplio el lapso

         var callbackFindLastTrade =  fuction(err,resunlt){
                if (!err){
                    if (result.length > 0 ){
                        //verifico si se cumplio el lapso del candel
                        if ((result.date-this.timeLastCandel)>this.candelPeriod){
                            collectionTrades.find({{date: {$gte:this.timeLastCandel, $lt:(this.timeLastCandel+this.candelPeriod)}}}).toArray(_.bind(callbackTradesPeriodoCandel,this));
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


        };
       };
       mongoClient.connect(this.MONGOHQ_URL, _.bind(callbackConnect,this));
});
}


Candel.prototype.actualizarTimeLastCandel = function() {
	var callbackTicker = function(err, data) {
	    var timeServer;
	    if (!err) {
	        try{
	            this.timeLastCandel = data.ticker.server_time;
	        }
	        catch (err) {

	        }
	    }
	}

	btcePublic.getTicker(this.pair, _.bind(callbackTicker,this));
}




