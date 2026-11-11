const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config, cargo, remetente }) => {
  const p = (config.prefixo || '€').trim();
  const jid = msg.key.remoteJid;
  const nomeUser = msg.pushName || 'LOBO';
  const numero = (remetente || msg.key.participant || jid).split('@')[0];
  const nomeBot = config.nomeBot || 'PACK ALPHA BOT';

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

  const texto = `╭══〘  BRINCADEIRA 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Usuário: 『${nomeUser}』
┃𓆩ꨄ𓆪 Número: 『${numero}』
┃𓆩ꨄ𓆪 Cargo: 『${(cargo || 'MEMBRO').toUpperCase()}』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Bot: 『${nomeBot}』
┃𓆩ꨄ𓆪 Status: 『Online』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 QUENTES 〙════┓
┃𓆩ꨄ𓆪 『${p}sexo @pessoa』
┃𓆩ꨄ𓆪 『${p}beijo @pessoa』
┃𓆩ꨄ𓆪 『${p}abracar @pessoa』
┃𓆩ꨄ𓆪 『${p}comer @pessoa』
┃𓆩ꨄ𓆪 『${p}dancar @pessoa』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 BATALHA 〙════┓
┃𓆩ꨄ𓆪 『${p}mata @pessoa』
┃𓆩ꨄ𓆪 『${p}tapa @pessoa』
┃𓆩ꨄ𓆪 『${p}chutar @pessoa』
┃𓆩ꨄ𓆪 『${p}soco @pessoa』
┃𓆩ꨄ𓆪 『${p}atirar @pessoa』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 MATAMATA 〙════┓
┃𓆩ꨄ𓆪 『${p}matamata』
┃𓆩ꨄ𓆪 『up』
┃𓆩ꨄ𓆪 『${p}comecar』
┃𓆩ꨄ𓆪 『${p}matar @pessoa』
┃𓆩ꨄ𓆪 『${p}rankingmatamata』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 DIVERSAO 〙════┓
┃𓆩ꨄ𓆪 『${p}gay @pessoa』
┃𓆩ꨄ𓆪 『${p}corno @pessoa』
┃𓆩ꨄ𓆪 『${p}dado』
┃𓆩ꨄ𓆪 『${p}caraoucoroa』
┃𓆩ꨄ𓆪 『${p}slot』
┃𓆩ꨄ𓆪 『${p}sorte』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 FAMILIA 〙════┓
┃𓆩ꨄ𓆪 『${p}namorar @pessoa』
┃𓆩ꨄ𓆪 『${p}aceitar』
┃𓆩ꨄ𓆪 『${p}recusar』
┃𓆩ꨄ𓆪 『${p}casar』
┃𓆩ꨄ𓆪 『${p}filho [nome]』
┃𓆩ꨄ𓆪 『${p}familia』
┃𓆩ꨄ𓆪 『${p}divorcio』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 STICKER 〙════┓
┃𓆩ꨄ𓆪 『${p}roubar』
┃𓆩ꨄ𓆪 Responde num sticker
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  const possiveis = [
    path.join(__dirname, '../../midia/menubrincadeira.jpg'),
    path.join(__dirname, '../../media/menubrincadeira.jpg'),
    path.join(__dirname, '../../midia/menu.jpg'),
    path.join(__dirname, '../../media/menu.jpg'),
  ];
  if (config.fotoMenuBrincadeira) possiveis.unshift(path.join(__dirname, '../../', config.fotoMenuBrincadeira));
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
