const fs = require('fs');
const path = require('path');

function lerSubDonos(){
  try{ return JSON.parse(fs.readFileSync(path.join(__dirname, '../../subdonos.json'))); }catch{ return []; }
}

module.exports = async ({ sock, msg, args, config, isDono, isDonoPrincipal, isAdm }) => {
  const jid = msg.key.remoteJid;
  const isGrupo = jid.endsWith('@g.us');
  
  if (!isGrupo) {
    return sock.sendMessage(jid, { text: '⛔ Este comando só funciona em grupos.' }, { quoted: msg });
  }

  const quem = msg.key.participant || msg.key.participantAlt || msg.key.senderPn || '';
  
  try {
    const meta = await sock.groupMetadata(jid);
    
    // Pega alvo de 3 jeitos: marcado, respondido, número
    let alvo = null;
    const m = msg.message.extendedTextMessage;
    const ctx = m?.contextInfo;

    if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
      alvo = ctx.mentionedJid[0];
    } else if (ctx?.participant) {
      alvo = ctx.participant;
    } else if (args[0]) {
      let num = args[0].replace(/\D/g, '');
      if (num.length >= 9) {
        const achado = meta.participants.find(p => p.id.includes(num.slice(-9)) || (p.phoneNumber && p.phoneNumber.includes(num.slice(-9))));
        alvo = achado ? achado.id : num + '@s.whatsapp.net';
      }
    }

    if (!alvo) {
      return sock.sendMessage(jid, { 
        text: `🐺 *COMANDO BAN - PACK ALPHA*\n\nUse:\n• ${config.prefixo}ban @pessoa\n• Responda a mensagem da pessoa com ${config.prefixo}ban\n• ${config.prefixo}ban 2449xxxxxxx\n\nEx: ${config.prefixo}ban @joao` 
      }, { quoted: msg });
    }

    const soNum = (s) => String(s||'').replace(/\D/g,'').slice(-9);

    // ===== PROTEÇÃO PACK ALPHA - DONO + SUB DONOS =====
    const DONO_NUMS = ['941548791', '958566636', '244941548791', '244958566636', '244933353188'];
    const eDonoAlvo = DONO_NUMS.some(n => soNum(n) === soNum(alvo)) || alvo.includes('234033556488308') || alvo.includes('242473200808191');
    
    // Vê se o alvo é Sub Dono / Dono 3 / Dono 4
    const listaSubs = lerSubDonos();
    const eSubDonoAlvo = listaSubs.some(x => soNum(x.id) === soNum(alvo));

    if(eDonoAlvo){
      return sock.sendMessage(jid, { text: '👑 Não posso banir meu Dono! Tenta outro.' }, { quoted: msg });
    }
    if(eSubDonoAlvo && !isDonoPrincipal){
      return sock.sendMessage(jid, { text: '👑 Não podes banir um Sub Dono! Só o Dono principal pode!' }, { quoted: msg });
    }
    if(eSubDonoAlvo && isDonoPrincipal){
      // Dono principal pode banir sub dono, continua...
    }

    if (alvo.includes(sock.user.id.split(':')[0]) || alvo === sock.user.id) {
      return sock.sendMessage(jid, { text: '🤖 Quer me banir? Kkk não vai rolar. 🐺' }, { quoted: msg });
    }

    // Verifica se alvo é admin
    const alvoMeta = meta.participants.find(p => p.id === alvo);
    if (alvoMeta && alvoMeta.admin && !isDono) {
      return sock.sendMessage(jid, { text: '⛔ Não posso banir outro admin. Rebaixe ele primeiro com €rebaixar' }, { quoted: msg });
    }

    // BANE!
    await sock.groupParticipantsUpdate(jid, [alvo], 'remove');
    
    await sock.sendMessage(jid, { 
      text: `🐺 *BANIDO - PACK ALPHA* 🔥\n\n👤 Usuário: @${alvo.split('@')[0]}\n👮 Por: @${quem.split('@')[0]}\n\nFoi comido pelo lobo!`,
      mentions: [alvo, quem]
    }, { quoted: msg });

  } catch (e) {
    console.error('[BAN ERRO]', e);
    let erroMsg = e.message || '';
    if (erroMsg.includes('not-authorized') || erroMsg.includes('forbidden') || erroMsg.includes('401')) {
      return sock.sendMessage(jid, { text: '⛔ Eu não sou admin no grupo! Me promove a admin primeiro.' }, { quoted: msg });
    }
    await sock.sendMessage(jid, { text: `❌ Erro ao banir:\n${erroMsg.slice(0,200)}` }, { quoted: msg });
  }
};
