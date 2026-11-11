module.exports = async ({ sock, msg, config, cargo, remetente }) => {
  const jid = msg.key.remoteJid;
  const isGrupo = jid.endsWith('@g.us');
  
  let alvo = remetente;
  const context = msg.message?.extendedTextMessage?.contextInfo;
  if (context?.mentionedJid && context.mentionedJid.length > 0) {
    alvo = context.mentionedJid[0];
  } else if (context?.participant) {
    alvo = context.participant;
  }

  const numero = alvo.split('@')[0];
  const pushName = msg.pushName || 'Lendário';
  
  let fotoUrl;
  let cargoFinal = (cargo || 'MEMBRO').toUpperCase();
  let nomeGrupo = '';

  try {
    fotoUrl = await sock.profilePictureUrl(alvo, 'image');
    if (isGrupo) {
      const meta = await sock.groupMetadata(jid);
      nomeGrupo = meta.subject;
      const part = meta.participants.find(p => p.id === alvo);
      if (part?.admin === 'admin') cargoFinal = 'ADMIN';
      if (part?.admin === 'superadmin') cargoFinal = 'SUPER ADMIN';
      if (cargoFinal === 'DONO') cargoFinal = 'DONO SUPREMO';
      if (cargoFinal === 'SUBDONO') cargoFinal = 'SUB DONO';
      if (cargoFinal === 'DONO3') cargoFinal = 'DONO 3';
      if (cargoFinal === 'DONO4') cargoFinal = 'DONO 4';
    }
  } catch (e) {
    fotoUrl = null;
  }

  const pct = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const bonito = pct(70, 100);
  const inteligente = pct(60, 100);
  const lendario = pct(80, 100);
  const perigoso = pct(40, 99);
  const fiel = pct(70, 100);
  const sorte = pct(30, 100);
  const alfa = pct(75, 100);

  const texto = `╭══〘  PERFIL 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Nome: 『${pushName}』
┃𓆩ꨄ𓆪 User: @${numero}
┃𓆩ꨄ𓆪 Número: 『+${numero}』
┃𓆩ꨄ𓆪 Cargo: 『${cargoFinal}』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 STATUS 〙════┓
┃𓆩ꨄ𓆪 Ativo: 『Sim』
┃𓆩ꨄ𓆪 Nível: 『LENDÁRIO』
┃𓆩ꨄ𓆪 Clã: 『ALPHA』
${isGrupo ? `┃𓆩ꨄ𓆪 Grupo: 『${nomeGrupo}』\n` : ''}┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 PORCENTAGEM 〙════┓
┃𓆩ꨄ𓆪 Bonito: 『${bonito}%』
┃𓆩ꨄ𓆪 Inteligente: 『${inteligente}%』
┃𓆩ꨄ𓆪 Lendário: 『${lendario}%』
┃𓆩ꨄ𓆪 Perigoso: 『${perigoso}%』
┃𓆩ꨄ𓆪 Fiel: 『${fiel}%』
┃𓆩ꨄ𓆪 Sorte: 『${sorte}%』
┃𓆩ꨄ𓆪 Alfa: 『${alfa}%』
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

┏════〘 CONTATO 〙════┓
┃𓆩ꨄ𓆪 『wa.me/${numero}』
┃𓆩ꨄ𓆪 Falar no PV
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  if (fotoUrl) {
    await sock.sendMessage(jid, {
      image: { url: fotoUrl },
      caption: texto,
      mentions: [alvo]
    }, { quoted: msg });
  } else {
    await sock.sendMessage(jid, {
      text: texto,
      mentions: [alvo]
    }, { quoted: msg });
  }
};
