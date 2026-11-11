module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  try {
    const data = await sock.newsletterMetadata('invite', '0029VbEByeYAu3aNrGI5nc2m');
    console.log('=== CANAL JID ===', data.id);
    await sock.sendMessage(jid, { text: `ID verdadeiro do canal:\n${data.id}\n\nCopia e manda-me esse ID` }, { quoted: msg });
  } catch(e) {
    console.log('ERRO GETCANAL', e);
    await sock.sendMessage(jid, { text: 'Erro: ' + e.message }, { quoted: msg });
  }
};
