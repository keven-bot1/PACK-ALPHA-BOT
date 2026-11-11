const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../subdonos.json');

module.exports = async ({ sock, msg }) => {
  const jid = msg.key.remoteJid;
  let lista = [];
  try{ lista = JSON.parse(fs.readFileSync(arquivo)); }catch{ lista = []; }

  if(!lista.length) return sock.sendMessage(jid, { text: '📋 *LISTA DE SUB DONOS*\n\nNinguém ainda! 😅\n\nUsa `€setsub @pessoa` pra meter alguém!' }, { quoted: msg });

  let texto = `👑 *LISTA DA ALCATEIA - DONOS* 🐺\n\n`;
  let mentions = [];
  lista.forEach((x, i) => {
    const emoji = x.cargo === 'subdono' ? '🥈' : x.cargo === 'dono3' ? '🥉' : '🏅';
    texto += `${i+1}. ${emoji} *${x.cargo.toUpperCase()}* - @${x.id.split('@')[0]}\n`;
    mentions.push(x.id);
  });
  texto += `\nTotal: ${lista.length} donos`;
  await sock.sendMessage(jid, { text: texto, mentions }, { quoted: msg });
};
