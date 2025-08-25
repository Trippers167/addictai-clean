// Sélecteurs principaux
const talkBtn = document.getElementById("talkBtn");
const homeScreen = document.getElementById("home");
const talkScreen = document.getElementById("talk");
const chatBox = document.getElementById("chat");
const backFromTalk = document.getElementById("backFromTalk");
const pttBtn = document.getElementById("ptt");

// Historique conversation
let conversation = [];

// Fonction TTS (parle)
function speak(text, lang = "fr-FR") {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  msg.rate = 1; // vitesse de lecture
  speechSynthesis.speak(msg);
}

// Afficher un message dans la boîte + sauvegarde
function addMessage(from, text) {
  const div = document.createElement("div");
  div.className = from === "AI" ? "msg ai" : "msg you";
  div.textContent = from + " : " + text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight; // auto scroll
  conversation.push({ from, text });
  localStorage.setItem("conversation", JSON.stringify(conversation));
}

// 🔑 Mini moteur IA local
function miniAI(userText) {
  const lower = userText.toLowerCase();

  // Cas spécifiques (émotions, envies…)
  if (lower.includes("triste") || lower.includes("seul") || lower.includes("mal")) {
    return "Je ressens ta tristesse. Respire doucement, tu n’es pas seul.";
  }
  if (lower.includes("envie") || lower.includes("craving")) {
    return "Je comprends ton envie. Bois un verre d’eau, attends 2 minutes avec moi.";
  }
  if (lower.includes("stress") || lower.includes("angoisse") || lower.includes("peur")) {
    return "Ok, faisons 3 respirations ensemble : inspire… expire… ça va passer.";
  }
  if (lower.includes("bien") || lower.includes("ça va")) {
    return "Super ! C’est bien de partager ce positif. Continue comme ça.";
  }

  // Réponses génériques variées
  const replies = [
    "Je comprends. Continue à me parler.",
    "Merci de partager ça avec moi.",
    "Chaque mot compte, bravo de le dire.",
    "Je t’écoute. Qu’est-ce que tu ressens en ce moment ?",
    "Tu fais un bon pas en parlant de ça."
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

// Navigation entre écrans
talkBtn.addEventListener("click", () => {
  homeScreen.classList.remove("active");
  talkScreen.classList.add("active");
});
backFromTalk.addEventListener("click", () => {
  talkScreen.classList.remove("active");
  homeScreen.classList.add("active");
});

// Reconnaissance vocale (Chrome uniquement)
if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage("Moi", transcript);

    // IA génère une réponse
    const reply = miniAI(transcript);
    addMessage("AI", reply);
    speak(reply, "fr-FR");
  };

  recognition.onerror = (event) => {
    console.error("Erreur micro:", event.error);
  };

  // Bouton PTT (appuie pour parler)
  pttBtn.addEventListener("mousedown", () => recognition.start());
  pttBtn.addEventListener("mouseup", () => recognition.stop());
} else {
  console.warn("Reconnaissance vocale non supportée sur ce navigateur.");
  pttBtn.disabled = true;
}
