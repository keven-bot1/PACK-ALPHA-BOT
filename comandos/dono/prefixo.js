module.exports = async ({ sock, msg, args, config, isDono }) => {
  if (!isDono) return;
  const novo = args[0]?.trim();
  if (!novo || novo.length > 2) {
    return sock.sendMessage(msg.key.remoteJid, { text: `⚙️ Use: ${config.prefixo}prefixo !` }, { quoted: msg });
  }
  config.prefixo = novo;
  await sock.sendMessage(msg.key.remoteJid, { text: `✅ Prefixo trocado para: ${novo}` }, { quoted: msg });
};
