var config = {};

config.key = 'G14V5S3K-01DAPGT2-N6NUBE51-MTXCO8LU-MEJM5OZV';
config.secret = '36e52c53ff5ced5b62fbb5f4e0c2b0d18b4d4aa848f801ee69ff70f8a144c754';

//Configuracion para operar
config.pair = 'btc_usd'; //PAIR PERMITIDOS: btc_usd,ltc_usd,nmc_usd,nvc_usd,ppc_usd
config.periodo = 9;    //periodo para realizar calculos HMA 10
config.candlesCount = 100;  //A partir de que candle se empieza a operar 
config.candleProperty = "closePrice"; 
config.timeProperty = "timeClose";
config.mongodbConnection = "mongodb://nodejitsu:2a714a4c81707a77b8b5cad1ef44eb65@linus.mongohq.com:10050/nodejitsudb3696440756";
config.candlePeriod = 300; //Periodo entre candle.

config.periodoRSI = 30;
config.RSIlimiteSuperior = 50;
config.RSIlimiteInferior = 50;
config.periodoDesviacionEstandar = 10;
config.minimoDesviacionEstandar = 3

config.InitialItemAmount = 0.3224;
config.usd = 0.0122;
config.fee = 0.002;

module.exports = config;
