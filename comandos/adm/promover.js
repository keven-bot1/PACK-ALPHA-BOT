module.exports = async ({ sock, msg, args, config, isDono }) => {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) {
    return sock.sendMessage(jid, { text: '⛔ Ei, meu lobo! Isso só funciona em grupo! 🐺' }, { quoted: msg });
  }

  const quem = msg.key.participant || msg.key.participantAlt || '';

  try {
    const meta = await sock.groupMetadata(jid);
    
    let alvo = null;
    const ctx = msg.message.extendedTextMessage?.contextInfo;

    if (ctx?.mentionedJid?.length) {
      alvo = ctx.mentionedJid[0];
    } else if (ctx?.participant) {
      alvo = ctx.participant;
    } else if (args[0]) {
      let num = args[0].replace(/\D/g, '');
      if (num.length >= 9) {
        const achado = meta.participants.find(p => p.id.includes(num.slice(-9)) || (p.phoneNumber && p.phoneNumber.includes(num.slice(-9))));
        alvo = achado ? achado.id : num + '@s.whatsapp.net';
        if (achado) alvo = achado.id;
      }
    }

    if (!alvo) {
      return sock.sendMessage(jid, { 
        text: `👑 *PROMOVER A ADMIN - COROAÇÃO!* 🐺\n\nEi Alfa, marca quem tu queres coroar!\n\nUsa assim:\n• ${config.prefixo}promover @pessoa\n• Responde na mensagem com ${config.prefixo}promover\n\nSem marcar eu não sei quem coroar! 😅👑` 
      }, { quoted: msg });
    }

    // Não promove dono (já é)
    await sock.groupParticipantsUpdate(jid, [alvo], 'promote');
    
    await sock.sendMessage(jid, { 
      text: `👑 *COROADO! NOVO ALFA NA ALCATEIA!* 🐺🔥\n\n🎉 PARABÉNS @${alvo.split('@')[0]}! 🎉\n\nTu agora és ADMIN! 👑🐺\nCoroado por: @${quem.split('@')[0]} 👑\n\nUsa esse poder com sabedoria, lobo!\nNão deixa a alcateia na bagunça! 🌙🔥\n\n🌙 *PACK ALPHA* - NO COMANDO!`,
      mentions: [alvo, quem]
    }, { quoted: msg });

  } catch (e) {
    console.error('[PROMOVER ERRO]', e);
    if (e.message.includes('not-authorized')) {
      return sock.sendMessage(jid, { text: '⛔ Aiiii! Eu não sou admin! 😭🐺\n\nMe promove primeiro que eu promovo os outros! 🙏👑' }, { quoted: msg });
    }
    await sock.sendMessage(jid, { text: `❌ Eita, deu erro! 😅🐺\n\n${e.message.slice(0,150)}\n\nTenta de novo, meu lobo!` }, { quoted: msg });
  }
};
