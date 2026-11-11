module.exports = async ({ sock, msg, isDono }) => {
  const jid = msg.key.remoteJid;
  if (!isDono) return sock.sendMessage(jid, { text: '⛔ Só o dono pode usar isso.' }, { quoted: msg });

  // Só sai se for grupo
  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, { text: '🐺 *Ei, meu lobo!*\n\nManda o `€sair` DENTRO do grupo que queres que eu saia!\n\nAqui no PV eu não saio de lado nenhum! 😅' }, { quoted: msg });
  }

  try {
    await sock.sendMessage(jid, { text: '👋 Saindo... ALPHA manda! 🐺' }, { quoted: msg });
    await new Promise(r => setTimeout(r, 1000));
    await sock.groupLeave(jid);
  } catch (e) {
    console.log('[SAIR ERRO]', e.message);
    await sock.sendMessage(jid, { text: `❌ Erro ao sair: ${e.message}` }, { quoted: msg });
  }
};
