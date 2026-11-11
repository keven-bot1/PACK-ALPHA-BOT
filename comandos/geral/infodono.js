const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config, cargo }) => {
  const jid = msg.key.remoteJid;
  const p = config.prefixo;

  const texto = `╭══〘  DONO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Dono: 『${config.donoNome}』
┃𓆩ꨄ𓆪 Bot: 『${config.nomeBot}』
┃𓆩ꨄ𓆪 Versão: 『${config.versao}』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Cargo: 『${(cargo || 'MEMBRO').toUpperCase()}』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 CONTATO DO DONO 〙════┓
┃𓆩ꨄ𓆪 『wa.me/${config.numeroDono}』
┃𓆩ꨄ𓆪 『${p}dono』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 AVISO 〙════┓
┃𓆩ꨄ𓆪 Não perturba o dono atoa!
┃𓆩ꨄ𓆪 Chama só se for importante.
┃𓆩ꨄ𓆪 Respeita o Lendário!
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  // ===== VCARD DO DONO - aqui é onde estava cortado =====
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.donoNome || 'DONO SUPREMO'}
TEL;TYPE=CELL;waid=${config.numeroDono}:${config.numeroDono}
END:VCARD`;

  // ===== FOTO DONO SUPREMO =====
  const possiveis = [
    path.join(__dirname, '../../midia/menudono.jpg'),
    path.join(__dirname, '../../media/menudono.jpg'),
    path.join(__dirname, '../../assets/menudono.jpg'),
    path.join(__dirname, '../../menudono.jpg'),
  ];

  if (config.fotoMenuDono) possiveis.unshift(path.join(__dirname, '../../', config.fotoMenuDono));
  if (config.fotoDono) possiveis.unshift(path.join(__dirname, '../../', config.fotoDono));

  let achouFoto = null;
  for (const f of possiveis) {
    if (fs.existsSync(f)) { achouFoto = f; break; }
  }

  try {
    // 1. Manda a foto + texto
    if (achouFoto) {
      await sock.sendMessage(jid, { image: fs.readFileSync(achouFoto), caption: texto }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, { text: texto }, { quoted: msg });
    }

    // 2. Manda o contato do dono logo a seguir
    await sock.sendMessage(jid, {
      contacts: {
        displayName: config.donoNome || 'DONO SUPREMO',
        contacts: [{ vcard }]
      }
    }, { quoted: msg });

  } catch (e) {
    console.log('[INFODONO ERRO]', e.message);
    await sock.sendMessage(jid, { text: texto }, { quoted: msg });
  }
};
