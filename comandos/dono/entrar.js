module.exports = async ({ sock, msg, args, isDono }) => {
  const jid = msg.key.remoteJid;
  if (!isDono) return sock.sendMessage(jid, { text: '⛔ Só o dono pode usar isso.' }, { quoted: msg });

  const texto = args.join(' ').trim();
  if (!texto) {
    return sock.sendMessage(jid, { text: '🐺 *Ei, meu lobo!*\n\nManda assim:\n`€entrar LINK_DO_GRUPO`\n\nExemplo:\n`€entrar https://chat.whatsapp.com/H3GzS4XE9GsBvrmCStDBWj`\n\nOu só o código:\n`€entrar H3GzS4XE9GsBvrmCStDBWj`' }, { quoted: msg });
  }

  // Pega só o código, limpa lixo do WhatsApp (?s=cl...)
  let codigo = texto;
  if (texto.includes('chat.whatsapp.com/')) {
    codigo = texto.split('chat.whatsapp.com/')[1].split('?')[0].split('/')[0].trim();
  } else {
    codigo = texto.split('?')[0].split('/')[0].trim();
  }

  if (!codigo || codigo.length < 10) {
    return sock.sendMessage(jid, { text: '❌ Código inválido, meu lobo! Copia o link todo de novo.' }, { quoted: msg });
  }

  try {
    await sock.sendMessage(jid, { text: `🐺 A entrar no grupo... aguenta aí!` }, { quoted: msg });
    const idGrupo = await sock.groupAcceptInvite(codigo);
    await sock.sendMessage(jid, { text: `✅ *Entrei!* 🐺🔥\n\nID do grupo: ${idGrupo}\nALPHA manda!` }, { quoted: msg });
  } catch (e) {
    console.log('[ENTRAR ERRO]', e.message);
    let motivo = 'Timed Out';
    if (e.message.includes('expired') || e.message.includes('invalid')) motivo = 'Link expirado ou inválido! Pede um link novo.';
    if (e.message.includes('already')) motivo = 'Eu já estou nesse grupo!';
    await sock.sendMessage(jid, { text: `❌ *Erro no entrar:* ${motivo}\n\nTenta de novo com um link novo, sem copiar o "?s=cl..." do fim.` }, { quoted: msg });
  }
};
