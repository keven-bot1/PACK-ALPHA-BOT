const { darImunidade, tirarImunidade, listarImunes } = require('../../utils/antispamBot');

module.exports = async ({ sock, msg, args }) => {
  let alvo = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const acao = (args?.[0] || '').toLowerCase();

  if (acao === 'lista') {
    let lista = listarImunes();
    if (lista.length === 0) return sock.sendMessage(msg.key.remoteJid, { text: '🛡️ Ninguém tem imunidade.\nSó tu, DONO, és imune sempre.' }, { quoted: msg });
    let txt = `🛡️ *IMUNES:*\n\n` + lista.map(n => `• @${n.split('@')[0]}`).join('\n');
    return sock.sendMessage(msg.key.remoteJid, { text: txt, mentions: lista }, { quoted: msg });
  }
  if (!alvo) return sock.sendMessage(msg.key.remoteJid, { text: 'Uso:\n€imunidade @pessoa\n€imunidade tirar @pessoa\n€imunidade lista' }, { quoted: msg });

  if (acao === 'tirar') {
    tirarImunidade(alvo);
    return sock.sendMessage(msg.key.remoteJid, { text: `❌ Imunidade tirada de @${alvo.split('@')[0]}`, mentions: [alvo] }, { quoted: msg });
  }
  darImunidade(alvo);
  return sock.sendMessage(msg.key.remoteJid, { text: `👑 @${alvo.split('@')[0]} AGORA É IMUNE! 🛡️`, mentions: [alvo] }, { quoted: msg });
};
