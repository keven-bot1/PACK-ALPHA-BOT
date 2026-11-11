module.exports = async ({ sock, msg, args, config }) => {
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
        text: `📉 *REBAIXAR ADMIN - TIRAR A COROA!* 👑🐺\n\nEi Alfa, marca quem tu queres rebaixar!\n\nUsa assim:\n• ${config.prefixo}rebaixar @admin\n• Responde na mensagem com ${config.prefixo}rebaixar\n\nSem marcar eu não sei quem tirar a coroa! 😅👑` 
      }, { quoted: msg });
    }

    // Protege dono
    const soNum = (s) => String(s||'').replace(/\D/g,'').slice(-9);
    if (soNum(alvo) === '958566636' || alvo.includes('234033556488308') || alvo.includes('242473200808191')) {
      return sock.sendMessage(jid, { text: '🐺⛔ NEM PENSES! 😈\n\nEsse é o DONO DA ALCATEIA! O LOBO SUPREMO! 👑🌙\n\nNinguém tira a coroa dele! Nem eu! 🙏🔥' }, { quoted: msg });
    }

    await sock.groupParticipantsUpdate(jid, [alvo], 'demote');
    
    await sock.sendMessage(jid, { 
      text: `📉 *COROA TIRADA!* 👑😱\n\n@${alvo.split('@')[0]} NÃO É MAIS ADMIN! 🐺💔\n\nRebaixado por: @${quem.split('@')[0]} 👮\n\nDe alfa voltou a ser lobo normal... 😅\nA vida é assim, hoje coroa, amanhã coleira! 😂👑\n\n🌙 *PACK ALPHA* - NO COMANDO!`,
      mentions: [alvo, quem]
    }, { quoted: msg });

  } catch (e) {
    console.error('[REBAIXAR ERRO]', e);
    if (e.message.includes('not-authorized')) {
      return sock.sendMessage(jid, { text: '⛔ Aiiii! Eu não sou admin! 😭🐺\n\nMe dá ADMIN que eu tiro a coroa de quem tu quiser! 🙏👑' }, { quoted: msg });
    }
    await sock.sendMessage(jid, { text: `❌ Eita, deu erro! 😅🐺\n\n${e.message.slice(0,150)}\n\nTenta de novo, meu lobo!` }, { quoted: msg });
  }
};
