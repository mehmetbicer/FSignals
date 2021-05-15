const fs = require('fs');
const clc = require('cli-color');
const Binance = require('node-binance-api');
const binance = new Binance().options({
    APIKEY: 'RsSOA9FqHROP75StJeM7IXphnVB3k5H2PIvF6sjLVN0eomZlKoFt0MLFbqpYmjkk',
    APISECRET: '9uYUsuSQ1xNpHAzO8Fson5Iajq9rr95aTI9J1WdzOoSAtgr5EbDn2Nt9jPrX7Oij',
    hedgeMode: false
});
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
//---------PARAMETRE ALANI---------------
var param_ ="15m";
var zamanlama_ = 10000;
var __recvWindow = 50000;
//---------OTOMATIK ALANLAR--------------
var logs_ ="";

var paralar_ = []

var json_data_= [];


ParaBul();

console.log('OK');

setInterval(function () {
    ////console.clear();
   
    //console.log("----------------------------------------------------------------------------------------------");
    //paralar_.forEach(Kontrols); 
  
    ParaBul();

    
    fs.writeFile('data.json', JSON.stringify(json_data_)  , function (err) {
        if (err) return console.log(err);
        //console.log('Dosya kayit edildi.');
    });
    json_data_= [];

	
}, zamanlama_ );


function ParaBul(){

    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://fapi.binance.com/fapi/v1/exchangeInfo',
    };

    try {
        request(options, function (error, response) {
            if (error == null || error == "undefined"){
                var params_  = JSON.parse(response.body);
               
                var paramm_ = params_.symbols;
               
                paramm_.forEach(element => {
                    if (element.quoteAsset=="USDT" && element.status=="TRADING" && element.contractType == "PERPETUAL" ){
                     
                        if(element.symbol != "DEFIUSDT"){
                            if(element.symbol != "1000SHIBUSDT"){
                                Kontrols(element.symbol);
                            }
                            
                        }

                          
                      
                    }

                });

            }

        });
    } catch (e) {
        console.log(e);
    }

    //paralar_.forEach(); 

    //zamanlama_=5000;
}

//'url': 'https://api.binance.com/api/v3/klines?' + deger_ ,

function Kontrols(item) {
    var limit_ = 8;
    var t_zaman = Date.now();
    var deger_ = "symbol="+ item  + "&interval=" + param_  + "&limit="  + limit_ + "&endTime=" + t_zaman 
    var request = require('request');
    var options = {
        'method': 'GET',
        'url': 'https://fapi.binance.com/fapi/v1/klines?' + deger_ ,
    };

   

    try {
        request(options, function (error, response) {
            if (error == null || error == "undefined"){
                var params_  = JSON.parse(response.body);
             
                var takip_time = (Date.now());
                var son_bar = params_[params_.length-1]; 
                var son_bar_close =0;
                var son_bar_time=0;
                var son_bar_zaman =0;
                var son_bar_vol =0;
                var son_bar_vol_buy=0;
                son_bar_close = son_bar[4];
                son_bar_open = son_bar[1];
                son_bar_time = son_bar[0];
                son_bar_vol = son_bar[5];
                son_bar_vol_buy = son_bar[9];
                
                var toplam_hacim = 0;
                var toplam_hacim_buy = 0;
                var en_yuksek =0;

                var sayac_ =0;
                var durum_ = "";
                
                params_.forEach(first_bar_ => {
                
                    var bar_open = parseFloat(first_bar_[1]);
                    var bar_close = parseFloat(first_bar_[4]);
                    var bar_volume = parseFloat(first_bar_[5]);
                    var bar_volume_buy = parseFloat(first_bar_[9]);

                    sayac_ += 1 ;
                    //console.log(item + " : " +  first_bar_[0] + " syc: " + sayac_ );
                   
                    if(sayac_ < 8){

                        toplam_hacim += parseFloat(bar_volume);
                        toplam_hacim_buy += parseFloat(bar_volume_buy);

                        if( parseFloat(bar_close) > parseFloat(en_yuksek)  ){
                            en_yuksek = parseFloat(bar_close);
                            //     console.log(item + " " + en_yuksek);
                        }

                    }

                });

		
                var oran__ =0;
                var hac_oran =0;
                hac_oran =( parseFloat(toplam_hacim_buy) / parseFloat(toplam_hacim)) * 100
				
               // console.log(item + " ORAN : " + oran__);
                if(  parseFloat(son_bar_vol) > parseFloat(toplam_hacim / 7) ){
                    durum_ ="HACIM GECTİ.";

                    oran__ = parseFloat(son_bar_vol)  /  parseFloat(toplam_hacim / 7) ; 
                    oran__ = parseFloat(oran__ * 100 );
                    oran__ = parseFloat(oran__ - 100 );
                }

                if(parseFloat(oran__) > 24 && parseFloat(son_bar_close) > parseFloat(son_bar_open) ){
                        // console.log(item + ";" + parseFloat(son_bar_close).toFixed(8) + ";" + parseFloat(en_yuksek).toFixed(8) + ";" + parseFloat(son_bar_vol).toFixed(0) + ";" + parseFloat(toplam_hacim / 7).toFixed(0) + ";" +  parseFloat(toplam_hacim).toFixed(0) );
                        //console.log(item + " " + parseFloat(oran__).toFixed(2) );
                        //console.log("-----------------------------------------------------------");
                        var status_ = "";
                        if(parseFloat(son_bar_close) > parseFloat(son_bar_open) ){
                            status_ ="thumbs-up";
                        }else
                        { status_ ="thumbs-down";
                        }
                        var renk_ = "";
                        if(parseFloat(oran__).toFixed(2)<100){ renk_ = "btn-default"}
                        if(parseFloat(oran__).toFixed(2)>100){ renk_ = "btn-primary"}
                        if(parseFloat(oran__).toFixed(2)>200){ renk_ = "btn-info"}
                        if(parseFloat(oran__).toFixed(2)>300){ renk_ = "btn-success"}
                        if(parseFloat(oran__).toFixed(2)>400){ renk_ = "btn-warning"}
                        if(parseFloat(oran__).toFixed(2)>500){ renk_ = "btn-danger"}

                        var g_hacim = parseFloat(oran__).toFixed(0);

                        var feed = {name: item , hacim: parseFloat(g_hacim) , renk: renk_ , status1:status_};
                        json_data_.push(feed);
					
                  
                }
             

         
                                  

            }
        });
    } catch (e) {
    
    }
}


