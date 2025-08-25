// Sélecteurs
const talkBtn = document.getElementById("talkBtn");
const homeScreen = document.getElementById("home");
const talkScreen = document.getElementById("talk");
const chatBox = document.getElementById("chat");
const backFromTalk = document.getElementById("backFromTalk");
const pttBtn = document.getElementById("ptt");

// Aller sur l'écran TALK
talkBtn.addEventListener("click", () => {
  homeScreen.classList.remove("active");
  talkScreen.classList.add("active");
});

// Retour à l'accueil
backFromTalk.addEventListener("click", () => {
  talkScreen.classList.remove("active");
  homeScreen.classList.add("active");
});

// Test voix TTS
function speak(text, lang = "fr-FR") {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  speechSynthesis.speak(msg);
}

// Démo micro → texte
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage("Moi", transcript);
    // Réponse simple IA démo
    let reply = "Je comprends. Continue à me parler.";
    addMessage("AI", reply);
    speak(reply, "fr-FR");
  };

  recognition.onerror = (event) => {
    console.error("Erreur micro:", event.error);
  };
}

// Gérer bouton PTT
pttBtn.addEventListener("mousedown", () => {
  if (recognition) recognition.start();
});

pttBtn.addEventListener("mouseup", () => {
  if (recognition) recognition.stop();
});

// Affichage messages
function addMessage(from, text) {
  const div = document.createElement("div");
  div.className = from === "AI" ? "msg ai" : "msg you";
  div.textContent = from + " : " + text;
  chatBox.appendChild(div);
}
