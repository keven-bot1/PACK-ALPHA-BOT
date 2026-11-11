const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config }) => {
  const jid = msg.key.remoteJid;
  const p = config.prefixo || '€';

  const texto = `╭══〘  DONO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Dono: 『${config.donoNome || 'ALPHA'}』
┃𓆩ꨄ𓆪 Bot: 『${config.nomeBot || 'PACK ALPHA BOT'}』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

𓆩ꨄ𓆪 Fale com o Alpha da Alcateia, o meu dono!

Ele está disponível sempre, pergunta pra ele o que quiseres.

𓆩ꨄ𓆪 Contacto do dono abaixo
𓆩ꨄ𓆪 wa.me/${config.numeroDono}

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.donoNome || 'DONO SUPREMO'}
TEL;TYPE=CELL;waid=${config.numeroDono}:${config.numeroDono}
END:VCARD`;

  // ===== FOTO DONO =====
  const possiveis = [
    path.join(__dirname, '../../midia/menudono.jpg'),
    path.join(__dirname, '../../media/menudono.jpg'),
    path.join(__dirname, '../../menudono.jpg'),
  ];

  if (config.fotoMenuDono) possiveis.unshift(path.join(__dirname, '../../', config.fotoMenuDono));

  let achouFoto = null;
  for (const f of possiveis) {
    if (fs.existsSync(f)) { achouFoto = f; break; }
  }

  try {
    if (achouFoto) {
      await sock.sendMessage(jid, { image: fs.readFileSync(achouFoto), caption: texto }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, { text: texto }, { quoted: msg });
    }

    // Manda o contacto clicável
    await sock.sendMessage(jid, {
      contacts: {
        displayName: config.donoNome || 'DONO SUPREMO',
        contacts: [{ vcard }]
      }
    }, { quoted: msg });

  } catch (e) {
    console.log('[DONO ERRO]', e.message);
    await sock.sendMessage(jid, { text: texto }, { quoted: msg });
  }
};
