(function(){
    "use strict";

    var CFG={startDate:"2026-01-08",themes:['#ff007f','#00f3ff','#ffd700','#9d00ff','#ff3366','#00ff88','#ff6b35'],symbols:['\u2764\uFE0F','\u2728','\uD83C\uDF38','\uD83D\uDC96','\uD83D\uDC95','\uD83E\uDD8B','\u2B50','\uD83C\uDF39','\uD83D\uDCAB'],memories:["Terima kasih telah hadir di hidupku.\nSetiap detik bersamamu terasa seperti mimpi yang nyata.","Senyummu adalah favoritku,\ndan tawamu adalah melodi terbaik di telingaku.","Aku mungkin tidak selalu bisa berjanji hari esok sempurna,\ntapi aku berjanji selalu ada untukmu.","You are my today and all of my tomorrows.\nAku sayang kamu!","Dunia mungkin bising,\ntapi bersamamu segalanya terasa tenang dan bermakna.","Kamu bukan hanya cintaku,\ntapi juga rumah tempatku pulang."],wishes:["Kamu lebih kuat dari yang kamu kira,\nlebih dicintai dari yang kamu rasa.","Setiap hari bersamamu adalah hadiah\nyang tidak pernah aku sia-siakan.","Jangan lupa tersenyum hari ini,\nkarena senyummu menerangi duniaku.","Di antara miliaran bintang,\nkamu yang paling terang di hatiku.","Apapun yang terjadi, ingat bahwa\nada seseorang yang selalu mendoakanmu.","Kamu adalah alasan aku percaya\npada keindahan hidup.","Tidak perlu sempurna untuk dicintai.\nKamu sudah lebih dari cukup.","Setiap napas yang kita ambil bersama\nadalah berkah yang tak ternilai.","Bahagia itu sederhana:\ncukup melihat kamu tertawa.","Kamu adalah rumah,\ntempatku selalu ingin kembali.","Cinta bukan tentang menemukan orang sempurna,\ntapi melihat ketidaksempurnaan dengan cara sempurna.","Terima kasih sudah menjadi\nversi terbaik dari dirimu untukku."],galleryImages:["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"],locations:{Malang:{city:"Malang",country:"ID",method:20},Bogor:{city:"Bogor",country:"ID",method:20}},fallbackPrayers:{Malang:{Fajr:"04:28",Dhuhr:"11:58",Asr:"15:18",Maghrib:"17:52",Isha:"19:02"},Bogor:{Fajr:"04:30",Dhuhr:"12:00",Asr:"15:20",Maghrib:"17:55",Isha:"19:05"}},fallbackDate:{gregorian:"12 Agustus 2026",hijri:"17 Safar 1448 AH"},bfColors:['rgba(255,0,127,0.6)','rgba(0,243,255,0.5)','rgba(255,215,0,0.5)','rgba(157,0,255,0.5)','rgba(255,51,102,0.5)','rgba(0,255,136,0.4)','rgba(255,107,53,0.5)']};
    var PN={Fajr:{l:"Subuh",e:"\uD83C\uDF19"},Dhuhr:{l:"Dzuhur",e:"\u2600\uFE0F"},Asr:{l:"Ashar",e:"\uD83C\uDF24\uFE0F"},Maghrib:{l:"Maghrib",e:"\uD83C\uDF05"},Isha:{l:"Isya",e:"\uD83C\uDF1F"}};
    var DI=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    var MI=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    var memIdx=0,twTimer=null,twDone=false,particles=[],audioOn=false;
    var lastPr='',prTimer=null,curCity='Malang',pTimes=null,cardOff=false,usedW=[];
    var tSX=0,tSY=0,lpT=null,lpF=false;
    var isTouch=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
    var audioCtx=null,analyser=null,vizData=null,vizRun=false,vizSm=[0,0,0,0,0];

    function $(id){return document.getElementById(id)||null;}

    function initHearts(){var cv=$('hearts-canvas');if(!cv)return;var c=cv.getContext('2d'),hs=[];function rs(){cv.width=innerWidth;cv.height=innerHeight;}rs();addEventListener('resize',rs);(function lp(){c.clearRect(0,0,cv.width,cv.height);if(Math.random()<.03&&hs.length<25)hs.push({x:Math.random()*cv.width,y:cv.height+10,s:Math.random()*8+4,vy:-(Math.random()*.3+.2),o:Math.random()*.15+.05,w:Math.random()*6.28,ws:Math.random()*.02+.01});for(var i=hs.length-1;i>=0;i--){var h=hs[i];h.y+=h.vy;h.x+=Math.sin(h.w)*.3;h.w+=h.ws;if(h.y<-20){hs.splice(i,1);continue;}c.save();c.translate(h.x,h.y);c.globalAlpha=h.o;c.fillStyle='rgba(255,0,127,0.8)';c.beginPath();c.moveTo(0,-h.s*.3);c.bezierCurveTo(-h.s*.5,-h.s*.8,-h.s,-.1*h.s,0,h.s*.5);c.bezierCurveTo(h.s,-.1*h.s,h.s*.5,-h.s*.8,0,-h.s*.3);c.fill();c.restore();}requestAnimationFrame(lp);})();}

    function initBF(){var cv=$('butterfly-canvas');if(!cv)return;var c=cv.getContext('2d'),bs=[],tk=0;function rs(){cv.width=innerWidth;cv.height=innerHeight;}rs();addEventListener('resize',rs);(function lp(){c.clearRect(0,0,cv.width,cv.height);tk++;if(tk%50===0&&bs.length<15){var cl=CFG.bfColors;bs.push({x:Math.random()*cv.width,y:cv.height+20,vx:(Math.random()-.5)*.8,vy:-(Math.random()*1.2+.5),sz:Math.random()*12+8,co:cl[Math.floor(Math.random()*cl.length)],wp:Math.random()*6.28,ws:Math.random()*.15+.08,do_:Math.random()*6.28,da:Math.random()*1.5+.5,li:0,ml:Math.random()*400+500});}for(var i=bs.length-1;i>=0;i--){var b=bs[i];b.li++;b.wp+=b.ws;b.x+=b.vx+Math.sin(tk*.02+b.do_)*b.da*.3;b.y+=b.vy;if(b.li>=b.ml||b.y<-50){bs.splice(i,1);continue;}var w=Math.abs(Math.sin(b.wp)),a=Math.min(b.li/30,1,(b.ml-b.li)/30);c.save();c.translate(b.x,b.y);c.globalAlpha=a;c.save();c.scale(-w,1);c.beginPath();c.ellipse(b.sz*.6,-b.sz*.2,b.sz*.7,b.sz*.45,-.3,0,6.28);c.fillStyle=b.co;c.fill();c.beginPath();c.ellipse(b.sz*.4,b.sz*.3,b.sz*.45,b.sz*.3,.2,0,6.28);c.fillStyle=b.co;c.fill();c.restore();c.save();c.scale(w,1);c.beginPath();c.ellipse(b.sz*.6,-b.sz*.2,b.sz*.7,b.sz*.45,.3,0,6.28);c.fillStyle=b.co;c.fill();c.beginPath();c.ellipse(b.sz*.4,b.sz*.3,b.sz*.45,b.sz*.3,-.2,0,6.28);c.fillStyle=b.co;c.fill();c.restore();c.beginPath();c.ellipse(0,0,b.sz*.08,b.sz*.5,0,0,6.28);c.fillStyle='rgba(255,255,255,0.7)';c.fill();c.restore();}requestAnimationFrame(lp);})();}

    var pCv,pCx;
    function initPart(){pCv=$('particle-canvas');if(pCv)pCx=pCv.getContext('2d');function rs(){if(pCv){pCv.width=innerWidth;pCv.height=innerHeight;}}rs();addEventListener('resize',rs);(function lp(){if(!pCx)return;pCx.clearRect(0,0,pCv.width,pCv.height);for(var i=particles.length-1;i>=0;i--){var p=particles[i];p.x+=p.vx;p.y+=p.vy;p.r+=p.rs;p.l-=.003;if(p.l<=0){particles.splice(i,1);continue;}pCx.save();pCx.translate(p.x,p.y);pCx.rotate(p.r*Math.PI/180);pCx.globalAlpha=Math.max(p.l,0);pCx.font=p.sz+'px serif';pCx.textAlign='center';pCx.textBaseline='middle';pCx.fillText(p.sy,0,0);pCx.restore();}requestAnimationFrame(lp);})();}
    function spawnPart(){if(!pCv)return;for(var i=0;i<60;i++)particles.push({x:Math.random()*pCv.width,y:-20,vx:(Math.random()-.5)*2,vy:Math.random()*3+1,sz:Math.random()*18+10,sy:CFG.symbols[Math.floor(Math.random()*CFG.symbols.length)],r:Math.random()*360,rs:(Math.random()-.5)*4,l:1});}

    function initViz(au){var bars=document.querySelectorAll('.viz-bar');if(!bars.length)return;try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioCtx=new AC();var src=audioCtx.createMediaElementSource(au);analyser=audioCtx.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=0.8;src.connect(analyser);analyser.connect(audioCtx.destination);vizData=new Uint8Array(analyser.frequencyBinCount);}catch(e){}(function lp(){if(!vizRun){requestAnimationFrame(lp);return;}if(analyser&&vizData){analyser.getByteFrequencyData(vizData);var bc=vizData.length,bands=[[0,Math.floor(bc*.1)],[Math.floor(bc*.1),Math.floor(bc*.25)],[Math.floor(bc*.25),Math.floor(bc*.5)],[Math.floor(bc*.5),Math.floor(bc*.75)],[Math.floor(bc*.75),bc]];for(var i=0;i<5;i++){var s=0,a=bands[i][0],b=bands[i][1];for(var j=a;j<b;j++)s+=vizData[j];var t=s/(b-a)/255*38;vizSm[i]+=(t-vizSm[i])*.2;if(bars[i])bars[i].style.height=Math.max(4,vizSm[i])+'px';}}else{var t=Date.now()*.003;for(var i=0;i<5;i++){var v=Math.abs(Math.sin(t+i*.8))*30+5;if(bars[i])bars[i].style.height=v+'px';}}requestAnimationFrame(lp);})();}

    function finTW(){clearTimeout(twTimer);twDone=true;var tb=$('text');if(tb){tb.innerText=CFG.memories[memIdx];tb.style.opacity='1';}}
    function typeTx(txt){var tb=$('text');if(!tb)return;tb.innerText='';twDone=false;var i=0;(function st(){if(i<txt.length){tb.innerText+=txt.charAt(i);i++;twTimer=setTimeout(st,45);}else{twDone=true;tb.style.opacity='1';}})();tb.style.opacity='1';}
    function updDots(){var d=$('dots');if(!d)return;var ch=d.children;for(var i=0;i<ch.length;i++){if(i===memIdx)ch[i].classList.add('active');else ch[i].classList.remove('active');}}
    function updProg(){var p=$('progress-fill');if(p)p.style.width=((memIdx+1)/CFG.memories.length*100)+'%';}
    function nextM(){finTW();memIdx=(memIdx+1)%CFG.memories.length;var tb=$('text');if(tb)tb.style.opacity='0';setTimeout(function(){typeTx(CFG.memories[memIdx]);updDots();updProg();},400);}
    function prevM(){finTW();memIdx=(memIdx-1+CFG.memories.length)%CFG.memories.length;var tb=$('text');if(tb)tb.style.opacity='0';setTimeout(function(){typeTx(CFG.memories[memIdx]);updDots();updProg();},400);}
    function jumpR(){finTW();var r;do{r=Math.floor(Math.random()*CFG.memories.length);}while(r===memIdx);memIdx=r;var tb=$('text');if(tb)tb.style.opacity='0';setTimeout(function(){typeTx(CFG.memories[r]);updDots();updProg();},300);}

    function updClk(){var n=new Date();var ck=$('live-clock');if(ck)ck.innerText=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')+':'+String(n.getSeconds()).padStart(2,'0');var dg=$('date-gregorian');if(dg)dg.innerText=DI[n.getDay()]+', '+n.getDate()+' '+MI[n.getMonth()]+' '+n.getFullYear();}
    function updGr(){var h=new Date().getHours(),g='';if(h>=4&&h<6)g='Selamat Subuh MyLup \uD83C\uDF19';else if(h>=6&&h<11)g='Selamat Pagi Bubu \u2728';else if(h>=11&&h<15)g='Selamat Siang Sayang \u2600\uFE0F';else if(h>=15&&h<18)g='Selamat Sore Cintaku \uD83C\uDF05';else if(h>=18&&h<21)g='Selamat Malam MyLove \uD83C\uDF19';else g='Jangan Begadang Ya Sayang \uD83D\uDE34';var ti=$('title');if(ti&&ti.innerText!==g){ti.style.opacity='0';setTimeout(function(){ti.innerText=g;ti.style.opacity='1';ti.classList.remove('pulse');void ti.offsetWidth;ti.classList.add('pulse');},300);}}

    function fetchPr(ct){var loc=CFG.locations[ct];if(!loc)return;var t=new Date(),ds=t.getDate()+'-'+(t.getMonth()+1)+'-'+t.getFullYear();var url='https://api.aladhan.com/v1/timingsByCity/'+ds+'?city='+loc.city+'&country='+loc.country+'&method='+loc.method;var sd=$('prayer-schedule-display');if(sd)sd.innerText='Memuat jadwal '+ct+'...';fetch(url).then(function(r){return r.json();}).then(function(j){if(j.code===200&&j.data&&j.data.timings){pTimes=j.data.timings;if(j.data.date){var dg=$('date-gregorian');if(j.data.date.readable&&dg)dg.innerText=j.data.date.readable;var dh=$('date-hijri');if(j.data.date.hijri&&dh){var hj=j.data.date.hijri;dh.innerText=(hj.weekday&&hj.weekday.ar?hj.weekday.ar:'')+' '+(hj.day||'')+' '+(hj.month&&hj.month.en?hj.month.en:'')+' '+(hj.year||'')+' H';}}showSch();}else{useFB(ct);}}).catch(function(){useFB(ct);});}
    function useFB(ct){pTimes=CFG.fallbackPrayers[ct]||CFG.fallbackPrayers.Malang;var dg=$('date-gregorian');if(dg)dg.innerText=CFG.fallbackDate.gregorian;var dh=$('date-hijri');if(dh)dh.innerText=CFG.fallbackDate.hijri;showSch();}
    function showSch(){if(!pTimes)return;var sd=$('prayer-schedule-display');if(!sd)return;var p=[],ks=['Fajr','Dhuhr','Asr','Maghrib','Isha'];for(var i=0;i<ks.length;i++)p.push(PN[ks[i]].l+' '+pTimes[ks[i]]);sd.innerText='\uD83D\uDD50 '+curCity+': '+p.join(' | ');}
    function chkPr(){if(!pTimes)return;var n=new Date(),ct=String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0'),ks=['Fajr','Dhuhr','Asr','Maghrib','Isha'];for(var i=0;i<ks.length;i++){if(pTimes[ks[i]]===ct&&lastPr!==ks[i]){lastPr=ks[i];showPrN(ks[i]);}}}
    function showPrN(k){var info=PN[k];clearTimeout(prTimer);var pr=$('prayer-reminder');if(pr){pr.innerHTML=info.e+' Waktunya Sholat '+info.l+' '+info.e+'<br><small>Jangan lupa ya sayang \u2764\uFE0F | '+curCity+'</small>';pr.classList.add('show');prTimer=setTimeout(function(){var pr2=$('prayer-reminder');if(pr2)pr2.classList.remove('show');},60000);}}

    function togCard(){
        cardOff=!cardOff;
        var cd=$('card');
        var vd=$('bg-video');
        if(cd){
            if(cardOff){
                cd.classList.add('card-hidden');
                cd.style.opacity='0';
                cd.style.pointerEvents='none';
            }else{
                cd.classList.remove('card-hidden');
                cd.style.opacity='';
                cd.style.pointerEvents='';
            }
        }
        if(vd)vd.style.opacity=cardOff?'1':'0.35';
    }

    function togAudio(){var au=$('audio');if(!au)return;if(au.paused){if(audioCtx&&audioCtx.state==='suspended')audioCtx.resume();var p=au.play();if(p!==undefined)p.then(function(){audioOn=true;vizRun=true;var vis=$('vis');if(vis)vis.classList.add('active');var mb=$('btn-music');if(mb)mb.innerText='Pause \u23F8\uFE0F';}).catch(function(){var mb=$('btn-music');if(mb)mb.innerText='Klik Lagi \uD83C\uDFB5';});}else{au.pause();vizRun=false;var vis=$('vis');if(vis)vis.classList.remove('active');var mb=$('btn-music');if(mb)mb.innerText='Musik \uD83C\uDFB5';}}

    function chgTheme(){var c=CFG.themes[Math.floor(Math.random()*CFG.themes.length)];document.documentElement.style.setProperty('--accent',c);document.documentElement.style.setProperty('--accent-glow',c+'66');}

    function showWish(){var av=[];for(var i=0;i<CFG.wishes.length;i++){if(usedW.indexOf(i)===-1)av.push(i);}if(av.length===0){usedW=[];for(var j=0;j<CFG.wishes.length;j++)av.push(j);}var pk=av[Math.floor(Math.random()*av.length)];usedW.push(pk);var wt=$('wish-text');if(wt)wt.innerText=CFG.wishes[pk];var wo=$('wish-overlay');if(wo)wo.classList.add('open');}
    function closeWish(){var wo=$('wish-overlay');if(wo)wo.classList.remove('open');}

    function showGal(){var gg=$('gallery-grid'),gm=$('gallery-modal');if(!gg||!gm)return;gg.innerHTML='';for(var i=0;i<CFG.galleryImages.length;i++){var img=document.createElement('img');img.src=CFG.galleryImages[i];img.loading='lazy';img.alt='Momen';img.onerror=function(){this.style.display='none';};(function(el){el.onclick=function(){closeGal();};})(img);gg.appendChild(img);}gm.classList.add('open');}
    function closeGal(){var gm=$('gallery-modal');if(gm)gm.classList.remove('open');}

    function showSurp(){var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.9);backdrop-filter:blur(15px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s;cursor:pointer;';o.innerHTML='<div style="text-align:center;color:white;padding:40px;max-width:350px;pointer-events:none;"><div style="font-size:3.5rem;margin-bottom:20px;animation:bounce 1s infinite alternate;">\uD83D\uDC8C</div><p style="font-size:1.3rem;line-height:1.9;font-family:\'Dancing Script\',cursive;">Terima kasih sudah menjadi alasan aku bahagia.<br><strong style="font-size:1.6rem;">I Love You Forever!</strong></p><p style="font-size:.7rem;opacity:.5;margin-top:15px;">Ketuk di mana saja untuk menutup</p></div>';document.body.appendChild(o);requestAnimationFrame(function(){o.style.opacity='1';});o.onclick=function(){o.style.opacity='0';setTimeout(function(){if(o.parentNode)o.parentNode.removeChild(o);},400);};}

    function bindAll(){
        function bind(id,fn){var el=$(id);if(!el)return;el.addEventListener('click',function(e){e.stopPropagation();e.preventDefault();try{fn();}catch(err){console.warn(err);}});}
        bind('btn-particles',spawnPart);
        bind('btn-music',togAudio);
        bind('btn-theme',chgTheme);
        bind('btn-gallery',showGal);
        bind('btn-surprise',showSurp);
        bind('btn-wish',showWish);
        bind('btn-prev',prevM);
        bind('btn-next',nextM);
        bind('btn-close-gallery',closeGal);
        bind('btn-close-wish',closeWish);

        var gm=$('gallery-modal');if(gm)gm.addEventListener('click',function(e){if(e.target===gm){e.stopPropagation();closeGal();}});
        var wo=$('wish-overlay');if(wo)wo.addEventListener('click',function(e){if(e.target===wo){e.stopPropagation();closeWish();}});
        var cs=$('city-select');if(cs)cs.addEventListener('change',function(e){curCity=e.target.value;lastPr='';var pr=$('prayer-reminder');if(pr)pr.classList.remove('show');fetchPr(curCity);});

        var eye=$('eye-btn');
        if(eye){
            var eyeHandled=false;
            eye.addEventListener('touchstart',function(e){
                e.stopPropagation();e.preventDefault();
                if(eyeHandled)return;eyeHandled=true;
                togCard();
                setTimeout(function(){eyeHandled=false;},300);
            },{passive:false});
            eye.addEventListener('mousedown',function(e){
                e.stopPropagation();e.preventDefault();
                if(eyeHandled)return;eyeHandled=true;
                togCard();
                setTimeout(function(){eyeHandled=false;},300);
            });
        }
    }

    function bindTB(){
        var tb=$('text');if(!tb)return;
        if(isTouch){
            tb.addEventListener('touchstart',function(e){tSX=e.changedTouches[0].screenX;tSY=e.changedTouches[0].screenY;lpF=false;lpT=setTimeout(function(){lpF=true;tb.classList.add('lp-fb');setTimeout(function(){tb.classList.remove('lp-fb');},200);jumpR();},600);},{passive:true});
            tb.addEventListener('touchend',function(e){clearTimeout(lpT);if(lpF)return;var dx=e.changedTouches[0].screenX-tSX,dy=e.changedTouches[0].screenY-tSY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){if(dx<0)nextM();else prevM();}else if(Math.abs(dx)<10&&Math.abs(dy)<10){nextM();}},{passive:true});
        }else{
            tb.addEventListener('mousedown',function(){lpF=false;lpT=setTimeout(function(){lpF=true;tb.classList.add('lp-fb');setTimeout(function(){tb.classList.remove('lp-fb');},200);jumpR();},600);});
            tb.addEventListener('mouseup',function(){clearTimeout(lpT);if(!lpF)nextM();});
            tb.addEventListener('mouseleave',function(){clearTimeout(lpT);});
        }
    }

    function setupUnlock(){
        var ov=$('unlock-overlay');if(!ov)return;
        function unlock(){
            if(audioOn)return;
            var au=$('audio');if(au){var p=au.play();if(p!==undefined)p.then(function(){audioOn=true;vizRun=true;var vis=$('vis');if(vis)vis.classList.add('active');var mb=$('btn-music');if(mb)mb.innerText='Pause \u23F8\uFE0F';}).catch(function(){});}
            ov.classList.add('gone');
            setTimeout(function(){if(ov.parentNode)ov.parentNode.removeChild(ov);},600);
            ov.removeEventListener('click',unlock);
            ov.removeEventListener('touchstart',unlock);
        }
        ov.addEventListener('click',unlock);
        ov.addEventListener('touchstart',unlock,{passive:true});
    }

    function init(){
        bindAll();bindTB();setupUnlock();
        var dc=$('date-counter');if(dc)dc.innerText='\u2764\uFE0F '+Math.floor((new Date()-new Date(CFG.startDate))/86400000)+' Hari Bersama \u2764\uFE0F';
        var dots=$('dots');if(dots){dots.innerHTML='';for(var i=0;i<CFG.memories.length;i++){var d=document.createElement('div');d.className='dot'+(i===0?' active':'');dots.appendChild(d);}}
        updClk();updGr();typeTx(CFG.memories[0]);updProg();initPart();
        var au=$('audio');if(au)initViz(au);
        fetchPr(curCity);
        setInterval(function(){updClk();updGr();chkPr();},1000);
        setInterval(function(){var n=new Date();if(n.getHours()===0&&n.getMinutes()===0)fetchPr(curCity);},60000);
        initHearts();initBF();
    }

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();