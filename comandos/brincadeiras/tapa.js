module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    let mentioned = [];
    const ctx = Info?.message?.extendedTextMessage?.contextInfo || Info?.contextInfo;
    if (ctx?.mentionedJid?.length) mentioned = ctx.mentionedJid;
    else if (ctx?.participant) mentioned = [ctx.participant];
    if (!mentioned.length) return sock.sendMessage(from, { text: "❌ Marca alguém! Ex: €tapa @MARIANA" }, { quoted: Info });
    const alvo = mentioned[0];
    await sock.sendMessage(from, { video: { url: "https://chat.tedzinho.com.br/uploads2/tapa.mp4" }, gifPlayback: true, caption: `Você deu um tapa em @${alvo.split("@")[0]}! 👋💥`, mentions: [alvo] }, { quoted: Info });
  } catch(e){ console.log("Erro tapa:", e); }
};
