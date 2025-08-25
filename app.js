(function(){
  const qs=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const screens={home:qs('#home'),talk:qs('#talk'),urge:qs('#urge'),progress:qs('#progress')};
  const langBtn=qs('#langBtn'),talkBtn=qs('#talkBtn'),urgeBtn=qs('#urgeBtn'),progressBtn=qs('#progressBtn');
  const backFromTalk=qs('#backFromTalk'),backFromUrge=qs('#backFromUrge'),backFromProg=qs('#backFromProg');
  const chat=qs('#chat'),ptt=qs('#ptt'),speakToggle=qs('#speakToggle');
  const daysEl=qs('#days'),crave=qs('#crave'),saveDay=qs('#saveDay');
  let lang=localStorage.getItem('lang')||'FR',ttsOn=true,days=Number(localStorage.getItem('days')||'0');

  function tr(fr,en){return(lang==='FR')?fr:en}
  function applyLang(){$$('[data-fr]').forEach(el=>el.textContent=tr(el.getAttribute('data-fr'),el.getAttribute('data-en')));langBtn.textContent=(lang==='FR')?'EN':'FR'}
  function show(s){Object.values(screens).forEach(x=>x.classList.remove('active'));screens[s].classList.add('active')}
  langBtn.onclick=()=>{lang=(lang==='FR')?'EN':'FR';localStorage.setItem('lang',lang);applyLang()}
  talkBtn.onclick=()=>{show('talk');greet()};urgeBtn.onclick=()=>show('urge');progressBtn.onclick=()=>{daysEl.textContent=String(days);show('progress')}
  backFromTalk.onclick=()=>show('home');backFromUrge.onclick=()=>show('home');backFromProg.onclick=()=>show('home')
  saveDay.onclick=()=>{days++;localStorage.setItem('days',String(days));daysEl.textContent=String(days);alert(tr('Victoire enregistrée ✅','Victory saved ✅'))}

  function msg(t,who='ai'){const el=document.createElement('div');el.className='msg '+(who==='ai'?'ai':'you');el.textContent=t;chat.appendChild(el);chat.scrollTop=chat.scrollHeight;if(who==='ai'&&ttsOn)speak(t)}
  function greet(){chat.innerHTML='';msg(tr('Bonjour 👋 Je suis ton coach. Parle-moi de ton envie.','Hello 👋 I\\'m your coach. Tell me about your craving.'))}
  function speak(t){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=(lang==='FR')?'fr-CA':'en-CA';speechSynthesis.speak(u)}
  speakToggle.onclick=()=>{ttsOn=!ttsOn;speakToggle.style.background=ttsOn?'#10b981':'#9ca3af'}

  let rec,listening=false;const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){rec=new SR();rec.continuous=false;rec.interimResults=false;
    function start(){try{if(window.speechSynthesis)speechSynthesis.cancel();rec.lang=(lang==='FR')?'fr-CA':'en-CA';rec.start();listening=true;ptt.classList.add('listening');ptt.textContent=tr('Écoute… (relâche)','Listening… (release)')}catch(e){}}
    function stop(){try{rec.stop()}catch(e){};listening=false;ptt.classList.remove('listening');ptt.innerHTML='🎤 <span>'+tr('Appuie pour parler','Press to talk')+'</span>'}
    ptt.onmousedown=start;ptt.ontouchstart=(e)=>{e.preventDefault();start()};const end=()=>stop();ptt.onmouseup=end;ptt.onmouseleave=()=>{if(listening)stop()};ptt.ontouchend=end
    rec.onresult=(ev)=>{const text=ev.results[0][0].transcript;msg(text,'you');coach(text)};rec.onend=()=>{if(listening)stop()};rec.onerror=()=>stop()}
  else{ptt.onclick=()=>{const text=prompt(tr('Dis-moi ce que tu ressens :','Tell me how you feel:'));if(text){msg(text,'you');coach(text)}}}

  function coach(input){const low=input.toLowerCase();if(/(suicide|me tuer|kill myself|end my life)/.test(low)){msg(tr('Je suis là avec toi. Tu comptes. Si tu es en danger, appelle le 911 ou 988.','I am here. You matter. If you are in danger, call 911 or 988.'));return}
    if(/(envie|craving|urge|boire|drink|smoke|gamble|porn|jeu|alcool|drogue)/.test(low)){msg(tr('On fait respiration 4-7-8 ensemble.','Let\\'s do 4-7-8 breathing together.'));setTimeout(()=>msg(tr('De 0 à 10, intensité ?','From 0 to 10, how strong?')),3000);return}
    if(/\\b(10|9|8|7|6|5|4|3|2|1|zero|one|two|three|four|five|six|seven|eight|nine|ten)\\b/.test(low)){msg(tr('Choisis une alternative 3 min: marche, eau, musique ?','Pick a 3-min alternative: walk, water, music?'));return}
    if(/(walk|marche|eau|water|music|musique)/.test(low)){msg(tr('Parfait. 3 min timer. Ensuite victoire.','Perfect. 3-min timer. Then log a victory.'));return}
    msg(tr('Je t\\'écoute. Dis-m\\'en plus.','I\\'m listening. Tell me more.'))}
  applyLang()
})()
