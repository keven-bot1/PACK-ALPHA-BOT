module.exports = async ({ sock, msg, args }) => {
  const jid = msg.key.remoteJid;
  const nomeUser = msg.pushName || 'LOBO';
  const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (args[0] ? args[0].replace('@','') + '@s.whatsapp.net' : null);
  if (!mencionado) return sock.sendMessage(jid, { text: `Marca alguém! Ex: €sexo @Maria` }, { quoted: msg });
  const frases = [`🔥 *${nomeUser}* e *@${mencionado.split('@')[0]}* foram para o quarto! 🛏️💦`, `🥵 *${nomeUser}* levou *@${mencionado.split('@')[0]}* para fazer amor a noite toda! 🔥`, `😈 *${nomeUser}* e *@${mencionado.split('@')[0]}* estão a fazer coisas proibidas! 👀`];
  await sock.sendMessage(jid, { text: frases[Math.floor(Math.random()*frases.length)], mentions: [mencionado] }, { quoted: msg });
};
