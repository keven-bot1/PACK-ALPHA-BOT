module.exports = async ({ sock, msg, args, config }) => {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, { text: '𓆩ꨄ𓆪 Ei, meu lobo! Isso só funciona em grupo!' }, { quoted: msg });
  }

  try {
    const meta = await sock.groupMetadata(jid);
    const participantes = meta.participants.map(p => p.id);
    
    const textoBase = args.join(' ') || '';
    
    // Um @ por linha, em ordem
    const listaMarcacao = participantes.map(id => `@${id.split('@')[0]}`).join('\n');

    const mensagem = textoBase 
      ? `╭══〘  CHAMADO DA ALCATEIA 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 ${textoBase}
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════════┛

𓆩ꨄ𓆪 TODO MUNDO AQUI!
${listaMarcacao}

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯` 
      : `╭══〘  ACORDA ALCATEIA 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Grupo: 『${meta.subject}』
┃𓆩ꨄ𓆪 Total: 『${participantes.length} lobos!』
┃𓆩ꨄ𓆪 Todo mundo pra cá! O Alfa chamou!
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════════┛

𓆩ꨄ𓆪 TODO MUNDO AQUI!
${listaMarcacao}

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

    await sock.sendMessage(jid, { 
      text: mensagem,
      mentions: participantes
    }, { quoted: msg });

  } catch (e) {
    console.error('[TODOS ERRO]', e);
    await sock.sendMessage(jid, { text: `𓆩ꨄ𓆪 Eita, deu erro!\n\n${e.message.slice(0,150)}` }, { quoted: msg });
  }
};
