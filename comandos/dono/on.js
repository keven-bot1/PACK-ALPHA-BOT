const fs = require('fs');
const path = require('path');
const statePath = path.join(__dirname, '../../botState.json');

module.exports = async ({ sock, msg, isDono }) => {
  const jid = msg.key.remoteJid;
  if (!isDono) return sock.sendMessage(jid, { text: '⛔ Só o dono pode usar isso.' }, { quoted: msg });

  fs.writeFileSync(statePath, JSON.stringify({ ligado: true }));

  await sock.sendMessage(jid, { text: '🟢 *BOT LIGADO - ALPHA VOLTOU* 🐺🔥' }, { quoted: msg });
};
