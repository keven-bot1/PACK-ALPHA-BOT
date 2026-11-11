const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config, cargo, remetente }) => {
  const p = (config.prefixo || '€').trim();
  const jid = msg.key.remoteJid;
  const nomeUser = msg.pushName || 'LOBO';
  const numero = (remetente || msg.key.participant || jid).split('@')[0];
  const nomeBot = config.nomeBot || 'PACK ALPHA BOT';
  const donoNome = config.donoNome || 'ALPHA';
  const versao = config.versao || '1.0';

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

  const menu = `╭══〘  BOT | GERAL 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Usuário: 『${nomeUser}』
┃𓆩ꨄ𓆪 Número: 『${numero}』
┃𓆩ꨄ𓆪 Cargo: 『${(cargo || 'MEMBRO').toUpperCase()}』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Bot: 『${nomeBot}』
┃𓆩ꨄ𓆪 Dono: 『${donoNome}』
┃𓆩ꨄ𓆪 Versão: 『${versao}』
┃𓆩ꨄ𓆪 Status: 『Online』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 GERAIS 〙════┓
┃𓆩ꨄ𓆪 『${p}ping』
┃𓆩ꨄ𓆪 『${p}perfil』
┃𓆩ꨄ𓆪 『${p}s』
┃𓆩ꨄ𓆪 『${p}toimg』
┃𓆩ꨄ𓆪 『${p}revelar』
┃𓆩ꨄ𓆪 『${p}dono』
┃𓆩ꨄ𓆪 『${p}infodono』
┃𓆩ꨄ𓆪 『${p}info』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 MENUS 〙════┓
┃𓆩ꨄ𓆪 『${p}menuadm』
┃𓆩ꨄ𓆪 『${p}menudono』
┃𓆩ꨄ𓆪 『${p}menubrincadeira』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  try {
    const foto = config.fotoMenu || './midia/menu.jpg';
    if (fs.existsSync(foto)) {
      await sock.sendMessage(jid, { image: fs.readFileSync(foto), caption: menu, contextInfo: canalInfo }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, { text: menu, contextInfo: canalInfo }, { quoted: msg });
    }
  } catch (e) {
    await sock.sendMessage(jid, { text: menu, contextInfo: canalInfo }, { quoted: msg });
  }
};
