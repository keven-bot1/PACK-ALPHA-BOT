module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ Ei ei ei! Isso aqui só funciona em grupo, meu lobo! 🐺' }, { quoted: msg });

  try {
    await sock.groupSettingUpdate(jid, 'not_announcement');
    await sock.sendMessage(jid, { text: '🔓 *GRUPO ABERTO PELA ALCATEIA!* 🐺🔥\n\nACORDA ALCATEIA! PODEM FALAR, PODEM GRITAR, PODEM UIVAR! 🌕🐺\n\nNinguém mais calado aqui! Quem tava com saudade de falar, agora é a hora! 💬🔥\n\n🌙 *PACK ALPHA* - NO COMANDO!' }, { quoted: msg });
  } catch (e) {
    console.error('[ABRIR ERRO]', e);
    await sock.sendMessage(jid, { text: '⛔ Aiiiii! Não consegui abrir! 😭🐺\n\nMe dá ADMIN primeiro que eu abro na hora, prometo! 🙏👑' }, { quoted: msg });
  }
};
