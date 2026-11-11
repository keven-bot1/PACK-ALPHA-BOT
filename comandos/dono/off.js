const fs = require('fs');
const path = require('path');
const statePath = path.join(__dirname, '../../botState.json');

module.exports = async ({ sock, msg, isDono }) => {
  const jid = msg.key.remoteJid;
  if (!isDono) return sock.sendMessage(jid, { text: '⛔ Só o dono pode usar isso.' }, { quoted: msg });

  fs.writeFileSync(statePath, JSON.stringify({ ligado: false }));

  await sock.sendMessage(jid, { text: '🔴 *BOT DESLIGADO - ALPHA DORMIU* 😴🐺' }, { quoted: msg });
};
