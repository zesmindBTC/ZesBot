var config = {};

config.key = '5Z4XCWOC-P56WH2TN-D8DLB2PL-DOUNSY4U-QZNGU7F3';
config.secret = '21686c96b6520c60c452ebc9742b3f4d30382d97a80a96b298886b3fd986dbcd';

//Configuracion para operar
config.pair = 'btc_usd'; //PAIR PERMITIDOS: btc_usd,ltc_usd,nmc_usd,nvc_usd,ppc_usd
config.periodo = 10;    //periodo para realizar calculos
config.candlesCount = 200; 
config.candleProperty = "valores";
config.mongodbConnection = "mongodb://localhost:27017/nico1";
config.candlePeriod = 300;

config.InitialItemAmount = 1.7;
config.usd = 1000;
config.fee = 0.02;


module.exports = config;
