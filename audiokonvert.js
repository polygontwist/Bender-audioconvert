"use strict";

var audioconvert=function(){
	var audioSRC="test.wav";	
	var einedatei=true;
	
	//var audioSRC="phoneme.wav";	
	//var einedatei=false;
	
	var audacityliste=[
	{a:0.005554,e:0.060977,s:"t"},
{a:0.116174,e:0.188599,s:"ə"},
{a:0.345916,e:0.454044,s:"n"},
{a:0.490993,e:0.584386,s:"s"},
{a:0.627228,e:0.689113,s:"a"},
{a:0.736716,e:0.767091,s:"ʀr"},
{a:0.798373,e:0.849377,s:"l"},
{a:0.877485,e:0.945263,s:"ɛ"},
{a:0.972011,e:1.049310,s:"f"},
{a:1.068578,e:1.096233,s:"g"},
{a:1.122528,e:1.163784,s:"ɪ"},
{a:1.202547,e:1.221361,s:"k"},
{a:1.266244,e:1.326088,s:"m"},
{a:1.345356,e:1.388653,s:"b"},
{a:1.424922,e:1.494513,s:"ʃ"},
{a:1.518768,e:1.565691,s:"d"},
{a:1.600600,e:1.823655,s:"ɐ"},
{a:1.851990,e:1.989133,s:"n̩"},
{a:2.023362,e:2.122422,s:"ʦ"},
{a:2.158011,e:2.216948,s:"aː"},
{a:2.237576,e:2.286993,s:"p"},
{a:2.316461,e:2.410307,s:"ŋ"},
{a:2.436376,e:2.513901,s:"ɔ"},
{a:2.534076,e:2.569438,s:"v"},
{a:2.591199,e:2.660791,s:"ʊ"},
{a:2.680739,e:2.743530,s:"ɐ̯"},
{a:2.773678,e:2.855510,s:"z"},
{a:2.879312,e:2.989026,s:"aɪ̯"},
{a:3.013961,e:3.169238,s:"iː"},
{a:3.208227,e:3.277592,s:"ç"},
{a:3.297087,e:3.375972,s:"eː"},
{a:3.391159,e:3.496567,s:"h"},
{a:3.514701,e:3.616255,s:"i"},
{a:3.636429,e:3.712594,s:"ɛː"},
{a:3.737756,e:3.820495,s:"uː"},
{a:3.848603,e:4.031989,s:"aʊ̯"},
{a:4.057831,e:4.172985,s:"ʏ"},
{a:4.201094,e:4.290406,s:"oː"},
{a:4.318742,e:4.427549,s:"yː"},
{a:4.453164,e:4.619549,s:"x"},
{a:4.646751,e:4.768933,s:"ɔɪ̯"},
{a:4.792962,e:4.921264,s:"ks"},
{a:4.943255,e:5.044128,s:"e"},
{a:5.067481,e:5.208477,s:"øː"},
{a:5.241130,e:5.321828,s:"i̯"},
{a:5.351091,e:5.440403,s:"l̩"},
{a:5.470139,e:5.594053,s:"j"},
{a:5.642951,e:5.735437,s:"u"},
{a:5.764614,e:5.865034,s:"o"},
{a:5.891652,e:6.146896,s:"m̩"},
{a:6.175197,e:6.279017,s:"œ"},
{a:6.315898,e:6.409745,s:"pf"},
{a:6.451545,e:6.493027,s:"ʁ"},
{a:6.524264,e:6.598162,s:"kv"},
{a:6.638647,e:6.854674,s:"y"},
{a:6.883054,e:6.942218,s:"ɪ̯"},
{a:6.976081,e:7.013937,s:"-"},
{a:7.031568,e:7.054689,s:"ʔ"}
	];
	
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var media;
	var audioQuelle;
	
	//--------basics-------
	var cE=function(ziel,e,id,cn){
		var newNode=document.createElement(e);
		if(id!=undefined && id!="")newNode.id=id;
		if(cn!=undefined && cn!="")newNode.className=cn;
		if(ziel)ziel.appendChild(newNode);
		return newNode;
		}

	var gE=function(id){if(id=="")return undefined; else return document.getElementById(id);}
	
	//---------------------
	
	var ObjaudioQuelle=function(){
		var request= new XMLHttpRequest();
			request.responseType = 'arraybuffer';
		
		
		//API
		this.load=function(url){
			console.log("open",url);
			request.open('GET',url, true);			
			request.send();
		}
		
		
		//Request
		request.onreadystatechange =function(){
					console.log("onreadystatechange",this.readyState);
					if(this.readyState==4){
						//console.log("getData 4");//geladen
					}
		};
		
		request.onload = function() {
			console.log("*onload*");
			
			
			var audioData = request.response;
			console.log("audioData",audioData);
			audioCtx.decodeAudioData(audioData,
								decodeAudioData, 
								function(e){"Error with decoding audio data" + e.err}
								);
			
		}
		
		var decodeAudioData=function(buffer){
			var i,t,data,dinfo,ichan ,as,es,pos,node;
			
			var chan = buffer.getChannelData(0);//nur ein Kanal nehmen
			// Kanal 1  Float32Array containing the PCM data associated with the channel
			// float32  8(1) 16(2) 32(4)
			
			
			//console.log(70/buffer.sampleRate);//0.0015873015873015873sec
			//console.log(buffer);
			
			
			console.log('chan.length',chan.length);
			console.log('buffer.sampleRate',buffer.sampleRate);
			console.log('buffer.length',buffer.length);
			console.log('buffer.duration',buffer.duration);
			//duration=buffer.length/buffer.sampleRate);//=buffer.duration
			
			//-->22kHz!
			var sampelstepp=buffer.sampleRate/22050;//48000->22050
			console.log('sampelstepp',sampelstepp);
			
			var minbuff;
			
			var ziel=gE("outputs");
			var decoder = new TextDecoder('utf8');
			var datadec;
			
			//Audio anhand der Liste zerlegen und einzelne Daten erzeugen
			
			if(einedatei){
				for(t=0;t<buffer.length;t+=sampelstepp){
					pos=Math.floor(t);
					data=chan[pos];// -1..0..+1
					minbuff+=String.fromCharCode(Math.floor(127+data*127));//+-1 to byte
					//minbuff.push(data);
				}
				datadec=window.btoa(minbuff);
				
				var fname=audioSRC.split('.')[0];
				
				node=cE(ziel,"a");
				node.setAttribute("download",fname+".dat");
				node.innerHTML=fname+".dat";
				node.href="data:multipart/byteranges;base64,"+datadec;
				
				node=cE(ziel,"br");
			}
			else			
			for(i=0;i<audacityliste.length;i++){
				dinfo=audacityliste[i];//.a .e
				as=Math.floor(dinfo.a*buffer.sampleRate);
				es=Math.floor(dinfo.e*buffer.sampleRate);
				minbuff="";
				//teil in minbuff speichern
				for(t=as;t<es;t+=sampelstepp){
					pos=Math.floor(t);
					data=chan[pos];// -1..0..+1
					minbuff+=String.fromCharCode(Math.floor(127+data*127));//+-1 to byte
					//minbuff.push(data);
				}
				
				if(i>-1){
					console.log(">",as,es,"<",dinfo.s);
					//console.log(minbuff);
					/*for(t=0;t<10;t++){
						console.log(minbuff.charCodeAt(t).toString(16));
					}*/
					datadec=window.btoa(minbuff);
					
					node=cE(ziel,"a");
					node.setAttribute("download",i+".dat");
					node.innerHTML=i+".dat";
					node.href="data:multipart/byteranges;base64,"+datadec;
					
					node=cE(ziel,"br");
					//tempcan.toDataURL("image/png");
					//data:image/png;base64,
				}
				
			}
			
			
		}
	}
	
	//-----------------
	
	var ini=function(){
		audioQuelle=new ObjaudioQuelle();
		audioQuelle.load(audioSRC);
	}
	
	
	ini();
}



window.addEventListener('load', function (event){
	var e=new audioconvert();
});