const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config, remetente }) => {
  const jid = msg.key.remoteJid;
  const p = (config.prefixo || '€').trim();
  const nomeUser = msg.pushName || 'LOBO';
  const numero = (remetente || msg.key.participant || jid).split('@')[0];

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

  const texto = `╭══〘  DONO SUPREMO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Dono: 『${nomeUser}』
┃𓆩ꨄ𓆪 Número: 『${numero}』
┃𓆩ꨄ𓆪 Cargo: 『DONO SUPREMO』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Status: 『Online』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪 ════════┛

┏════〘 MENU DONO 〙════┓
┃𓆩ꨄ𓆪 『${p}infodono』
┃𓆩ꨄ𓆪 『${p}menudono』
┃𓆩ꨄ𓆪 『${p}reiniciar』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 PREFIXO & SUBDONO 〙════┓
┃𓆩ꨄ𓆪 『${p}setprefixo <novo>』
┃𓆩ꨄ𓆪 『${p}setsub @pessoa』
┃𓆩ꨄ𓆪 『${p}setsub del @pessoa』
┃𓆩ꨄ𓆪 『${p}setsub @pessoa dono 3』
┃𓆩ꨄ𓆪 『${p}setsub @pessoa dono 4』
┃𓆩ꨄ𓆪 『${p}subdonos』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 IMUNIDADE 〙════┓
┃𓆩ꨄ𓆪 『${p}imunidade @pessoa』
┃𓆩ꨄ𓆪 『${p}imunidade tirar @pessoa』
┃𓆩ꨄ𓆪 『${p}imunidade lista』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 ANTISPAM 〙════┓
┃𓆩ꨄ𓆪 『${p}antispam』
┃𓆩ꨄ𓆪 『${p}antispam on / off』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 BOT ON / OFF 〙════┓
┃𓆩ꨄ𓆪 『${p}on』
┃𓆩ꨄ𓆪 『${p}off』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 GRUPOS 〙════┓
┃𓆩ꨄ𓆪 『${p}entrar <link>』
┃𓆩ꨄ𓆪 『${p}sair』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 BLOCK 〙════┓
┃𓆩ꨄ𓆪 『${p}block @pessoa』
┃𓆩ꨄ𓆪 『${p}unblock @pessoa』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 SISTEMA 〙════┓
┃𓆩ꨄ𓆪 『${p}exec』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 CANAL 〙════┓
┃𓆩ꨄ𓆪 『${p}canal』
┃𓆩ꨄ𓆪 『${p}canal on』
┃𓆩ꨄ𓆪 『${p}canal off』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  const possiveis = [
    path.join(__dirname, '../../midia/menudono.jpg'),
    path.join(__dirname, '../../media/menudono.jpg'),
    path.join(__dirname, '../../assets/menudono.jpg'),
    path.join(__dirname, '../../menudono.jpg'),
  ];
  if (config.fotoMenuDono) possiveis.unshift(path.join(__dirname, '../../', config.fotoMenuDono));
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
