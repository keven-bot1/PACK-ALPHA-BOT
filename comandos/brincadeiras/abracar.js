module.exports = async (...args) => {
  try {
    // Descobre qual é o formato do teu bot automaticamente
    let sock, from, Info;
    if (args[0] && args[0].sock) {
      // Formato: { sock, from, msg }
      sock = args[0].sock;
      from = args[0].from || args[0].jid || args[0].msg?.key?.remoteJid;
      Info = args[0].msg || args[0].Info || args[0].message;
    } else {
      // Formato: (sock, from, Info)
      [sock, from, Info] = args;
    }

    let mentioned = [];
    const ctx = Info?.message?.extendedTextMessage?.contextInfo || Info?.contextInfo;
    if (ctx?.mentionedJid?.length) mentioned = ctx.mentionedJid;
    else if (ctx?.participant) mentioned = [ctx.participant];

    if (!mentioned.length) {
      return sock.sendMessage(from, { text: "❌ Marca alguém! Ex: €abracar @MARIANA" }, { quoted: Info });
    }

    const alvo = mentioned[0];
    const videoUrl = "https://chat.tedzinho.com.br/uploads2/j6f7lp6h7809.mp4";
    await sock.sendMessage(from, {
      video: { url: videoUrl },
      gifPlayback: true,
      caption: `Você acabou de dar um abraço bem apertado em @${alvo.split("@")[0]}! 🤗💖✨`,
      mentions: [alvo]
    }, { quoted: Info });

  } catch (err) {
    console.log("Erro abracar:", err);
  }
};
