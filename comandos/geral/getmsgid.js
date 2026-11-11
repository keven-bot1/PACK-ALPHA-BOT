module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  try {
    const msgs = await sock.newsletterFetchMessages('120363412547510056@newsletter', 5);
    console.log(JSON.stringify(msgs, null, 2));
    let txt = 'Últimas mensagens do canal:\n\n';
    for (const m of msgs) {
      txt += `ID: ${m.key?.id} | serverMessageId: ${m.serverMessageId || m.key?.serverMessageId || '?'} | texto: ${(m.message?.extendedTextMessage?.text || m.message?.conversation || '').slice(0,40)}\n\n`;
    }
    await sock.sendMessage(jid, { text: txt }, { quoted: msg });
  } catch(e) {
    await sock.sendMessage(jid, { text: 'Erro: ' + e.message }, { quoted: msg });
  }
};
