module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ Ei ei ei! Isso aqui só funciona em grupo, meu lobo! 🐺' }, { quoted: msg });

  try {
    await sock.groupSettingUpdate(jid, 'announcement');
    await sock.sendMessage(jid, { text: '🔒 *GRUPO FECHADO PELA ALCATEIA!* 🐺🌙\n\nSHHHH! SILÊNCIO NA ALCATEIA! 🤫🔥\n\nSó os ALFAS (admins) podem falar agora! 👑🐺\nO resto fica só a ouvir e a aprender! 👀📚\n\nQuem desobedecer vai ser comido pelo lobo! 😈🔥\n\n🌙 *PACK ALPHA* - NO COMANDO!' }, { quoted: msg });
  } catch (e) {
    console.error('[FECHAR ERRO]', e);
    await sock.sendMessage(jid, { text: '⛔ Aiiiii! Não consegui fechar! 😭🐺\n\nMe dá ADMIN primeiro que eu fecho na hora, prometo! 🙏👑' }, { quoted: msg });
  }
};
