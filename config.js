var config = {};

config.key = '5Z4XCWOC-P56WH2TN-D8DLB2PL-DOUNSY4U-QZNGU7F3';
config.secret = '21686c96b6520c60c452ebc9742b3f4d30382d97a80a96b298886b3fd986dbcd';

//Configuracion para operar
config.pair = 'btc_usd'; //PAIR PERMITIDOS: btc_usd,ltc_usd,nmc_usd,nvc_usd,ppc_usd
config.periodo = 4;    //periodo para realizar calculos HMA 10
config.candlesCount = 5;  //A partir de que candle se empieza a operar 
config.candleProperty = "avgAmountPrice"; 
config.timeProperty = "timeClose";
config.mongodbConnection = "mongodb://nodejitsu:2a714a4c81707a77b8b5cad1ef44eb65@linus.mongohq.com:10050/nodejitsudb3696440756";
config.candlePeriod = 10; //Periodo entre candle.

config.InitialItemAmount = 1.7;
config.usd = 1000;
config.fee = 0.02;

module.exports = config;
