const fs = require('fs');
const path = require('path');

module.exports = async ({ sock, msg, config }) => {
  const jid = msg.key.remoteJid;
  const inicio = Date.now();

  const temp = await sock.sendMessage(jid, { text: '🐺 Uivando...' }, { quoted: msg });

  const latencia = Date.now() - inicio;

  const up = process.uptime();
  const h = Math.floor(up / 3600);
  const m = Math.floor((up % 3600) / 60);
  const s = Math.floor(up % 60);
  const uptime = `${h}h ${m}m ${s}s`;

  let barra = '▓▓▓▓▓▓▓▓▓▓';
  let nivel = 'ULTRA';
  if (latencia > 100) { barra = '▓▓▓▓▓▓▓▓░░'; nivel = 'RÁPIDO'; }
  if (latencia > 300) { barra = '▓▓▓▓▓▓░░░░'; nivel = 'OK'; }
  if (latencia > 800) { barra = '▓▓▓▓░░░░░░'; nivel = 'LENTO'; }

  const agora = new Date().toLocaleString('pt-AO', { timeZone: 'Africa/Luanda', hour: '2-digit', minute: '2-digit' });

  const texto = `╭══〘  ALPHA 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Bot: 『${config.nomeBot || 'PACK ALPHA BOT'}』
┃𓆩ꨄ𓆪 Dono: 『${config.donoNome || 'ALPHA'}』
┃𓆩ꨄ𓆪 Versão: 『${config.versao || '1.0'}』
┃𓆩ꨄ𓆪 Status: 『ON』
┃𓆩ꨄ𓆪 Hora: 『${agora}』
┃𓆩ꨄ𓆪 Up: 『${uptime}』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 PING 〙════┓
┃𓆩ꨄ𓆪 Ping: 『${latencia}ms』
┃𓆩ꨄ𓆪 『[${barra}]』
┃𓆩ꨄ𓆪 『${nivel}』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 SISTEMA 〙════┓
┃𓆩ꨄ𓆪 Lua: 『On』
┃𓆩ꨄ𓆪 Proteção: 『On』
┃𓆩ꨄ𓆪 Sistema: 『100%』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  try {
    const foto = config.fotoPing ? path.join(__dirname, '../../', config.fotoPing) : path.join(__dirname, '../../midia/ping.jpg');

    if (fs.existsSync(foto)) {
      await sock.sendMessage(jid, {
        image: fs.readFileSync(foto),
        caption: texto
      }, { quoted: msg });
      // Apaga a msg "Uivando..." - se falhar não crasha
      try { await sock.sendMessage(jid, { delete: temp.key }); } catch {}
    } else {
      // Sem foto, edita a msg temporária
      await sock.sendMessage(jid, { text: texto, edit: temp.key });
    }
  } catch (e) {
    console.log('[PING ERRO]', e.message);
    // Fallback: manda texto normal se o edit falhar
    try {
      await sock.sendMessage(jid, { text: texto }, { quoted: msg });
    } catch {}
  }
};
