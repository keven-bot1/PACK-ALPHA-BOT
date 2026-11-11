const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config, cargo, remetente }) => {
  const jid = msg.key.remoteJid;
  const p = (config.prefixo || '€').trim();
  const nomeUser = msg.pushName || 'LOBO';
  const numero = (remetente || msg.key.participant || jid).split('@')[0];
  const cargoTxt = (cargo || 'ADMIN').toUpperCase();

  let mostrarCanal = true;
  try{ mostrarCanal = JSON.parse(fs.readFileSync(path.join(__dirname, '../../canalState.json'))).mostrar !== false; }catch{}

  const canalInfo = mostrarCanal ? {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363412547510056@newsletter',
      newsletterName: 'PACK ALPHA BOT'
    }
  } : undefined;

  const texto = `╭══〘  ADM 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Usuário: 『${nomeUser}』
┃𓆩ꨄ𓆪 Número: 『${numero}』
┃𓆩ꨄ𓆪 Cargo: 『${cargoTxt}』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Status: 『Online』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 ADMINISTRACAO 〙════┓
┃𓆩ꨄ𓆪 『${p}ban』
┃𓆩ꨄ𓆪 『${p}promover』
┃𓆩ꨄ𓆪 『${p}rebaixar』
┃𓆩ꨄ𓆪 『${p}fechar』
┃𓆩ꨄ𓆪 『${p}abrir』
┃𓆩ꨄ𓆪 『${p}todos』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 SISTEMAS 〙════┓
┃𓆩ꨄ𓆪 『${p}antilink』
┃𓆩ꨄ𓆪 『${p}mute』
┃𓆩ꨄ𓆪 『${p}desmute』
┃𓆩ꨄ𓆪 『${p}bemvindo』
┃𓆩ꨄ𓆪 『${p}linkgrupo』
┃𓆩ꨄ𓆪 『${p}regras』
┃𓆩ꨄ𓆪 『${p}setnome』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  const possiveis = [
    path.join(__dirname, '../../midia/menuadm.jpg'),
    path.join(__dirname, '../../media/menuadm.jpg'),
    path.join(__dirname, '../../assets/menuadm.jpg'),
    path.join(__dirname, '../../menuadm.jpg'),
    path.join(__dirname, '../../midia/adm.jpg'),
    path.join(__dirname, '../../midia/menu.jpg'),
    path.join(__dirname, '../../media/menu.jpg'),
  ];
  if (config.fotoMenuAdm) possiveis.unshift(path.join(__dirname, '../../', config.fotoMenuAdm));
  if (config.fotoAdm) possiveis.unshift(path.join(__dirname, '../../', config.fotoAdm));
  let achouFoto = null;
  for (const f of possiveis) {
    if (fs.existsSync(f)) { achouFoto = f; break; }
  }
  try {
    if (achouFoto) {
      await sock.sendMessage(jid, { image: fs.readFileSync(achouFoto), caption: texto, contextInfo: canalInfo }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, { text: texto, contextInfo: canalInfo }, { quoted: msg });
    }
  } catch (e) {
    await sock.sendMessage(jid, { text: texto, contextInfo: canalInfo }, { quoted: msg });
  }
};
