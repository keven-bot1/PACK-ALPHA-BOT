module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const mentioned = ctx?.mentionedJid || [];
  if (!mentioned.length) return sock.sendMessage(jid, { text: "❌ Marca alguém! Ex: €soco @MARIANA" }, { quoted: msg });
  const alvo = mentioned[0];
  const autor = msg.key.participant || jid;
  try {
    await sock.sendMessage(jid, { video: { url: "https://chat.tedzinho.com.br/uploads2/frmdr2n10719.mp4" }, gifPlayback: true, caption: `Você deu um soco em @${alvo.split("@")[0]}! 👊💥`, mentions: [alvo] }, { quoted: msg });
  } catch {
    await sock.sendMessage(jid, { text: `👊 @${autor.split("@")[0]} deu um soco bem forte em @${alvo.split("@")[0]}! 💥😵`, mentions: [autor, alvo] }, { quoted: msg });
  }
};
