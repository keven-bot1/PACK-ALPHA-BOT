module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  const n = Math.floor(Math.random() * 101);
  let frase = "🍀 Sorte normal";
  if (n >= 80) frase = "🔥 Hoje é teu dia de sorte, aproveita!";
  if (n < 30) frase = "😅 Hoje fica em casa, Lobo...";
  await sock.sendMessage(jid, { text: `🔮 *SUA SORTE DE HOJE*\n\n🍀 Sorte: *${n}%*\n${frase}` }, { quoted: msg });
};
