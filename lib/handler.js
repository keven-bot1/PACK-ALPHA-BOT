const fs = require('fs');
const path = require('path');
const config = require('../config');
const comandos = new Map();
console.log('[PACK ALPHA - BOT] Handler iniciado. Prefixo:', config.prefixo);

function carregar(){
  comandos.clear();
  const base = path.join(__dirname,'../comandos');
  // ===== CORRIGIDO: ADICIONADO brincadeiras =====
  ['geral','dono','adm','brincadeiras'].forEach(cat=>{
    const pasta = path.join(base,cat);
    if(!fs.existsSync(pasta)) return;
    fs.readdirSync(pasta).forEach(f=>{
      if(!f.endsWith('.js')) return;
      try{
        const pth = path.join(pasta,f);
        delete require.cache[require.resolve(pth)];
        const fn = require(pth);
        if(typeof fn==='function'){
          const nome = f.replace('.js','').toLowerCase();
          if(comandos.has(nome)){
            console.log(`[AVISO] Comando duplicado: ${nome} em ${cat} - já existia, a sobrescrever!`);
          }
          comandos.set(nome, { fn, cat });
          console.log(`[CMD] Carregado: ${nome} [${cat}]`);
          // ===== FAMILIA: 1 ficheiro, vários comandos =====
          if (nome === 'familia') {
            ['namorar','aceitar','recusar','casar','filho','divorcio'].forEach(a => comandos.set(a, { fn, cat }));
            console.log(`[CMD] Carregado: namorar, aceitar, recusar, casar, filho, divorcio [${cat}] via familia`);
          }
        }
      }catch(e){ console.log(`[ERRO] ${f}:`, e.message) }
    });
  });
}
carregar();

function isDonoCheck(id){
  if(!id) return false;
  const s = String(id);
  if(s.includes('234033556488308')) return true;
  if(s.includes('244941548791')) return true;
  if(s.includes('941548791')) return true;
  if(config.donoNumero && s.includes(String(config.donoNumero))) return true;
  const nums = s.replace(/\D/g,'').slice(-9);
  if(nums==='958566636') return true;
  if(nums==='941548791') return true;
  try{
    const lista = lerSubDonos();
    for(const x of lista){
      const n = String(x.id || x.numero || x.jid || '').replace(/\D/g,'').slice(-9);
      if(n && n === nums) return true;
    }
  }catch{}
  return false;
}

function lerSubDonos(){
  try{ return JSON.parse(fs.readFileSync(path.join(__dirname, '../subdonos.json'))); }catch{ return []; }
}

function isDonoPrincipal(id){
  if(!id) return false;
  const s = String(id);
  const nums = s.replace(/\D/g,'').slice(-9);
  if(nums==='941548791' || nums==='958566636') return true;
  if(s.includes('234033556488308')) return true;
  if(s.includes('244941548791')) return true;
  if(config.donoNumero && String(config.donoNumero).replace(/\D/g,'').slice(-9) === nums) return true;
  return false;
}

function pegarCargo(id){
  if(!id) return 'membro';
  if(isDonoPrincipal(id)) return 'dono';
  const nums = String(id).replace(/\D/g,'').slice(-9);
  const lista = lerSubDonos();
  for(const x of lista){
    const n = String(x.id || x.numero || x.jid || '').replace(/\D/g,'').slice(-9);
    if(n && n === nums) return x.cargo || 'subdono';
  }
  return 'membro';
}

function isBotAdminCheck(meta, sock){
  try{
    if(!meta || !meta.participants) return false;
    const idsBot = [];
    if(sock.user?.id) idsBot.push(String(sock.user.id).split(':')[0].split('@')[0]);
    if(sock.user?.lid) idsBot.push(String(sock.user.lid).split(':')[0].split('@')[0]);
    if(sock.user?.id) idsBot.push(String(sock.user.id));
    if(config.numeroBot) idsBot.push(String(config.numeroBot).replace(/\D/g,''));
    for(const p of meta.participants){
      const pid = String(p.id || '').split('@')[0];
      const pFull = String(p.id || '');
      for(const b of idsBot){
        if(!b) continue;
        if(pid === b || pFull.includes(b) || b.includes(pid) && pid.length > 5){
          if(p.admin === 'admin' || p.admin === 'superadmin') return true;
        }
      }
      if(pFull === String(sock.user?.id) && (p.admin === 'admin' || p.admin === 'superadmin')) return true;
    }
    return false;
  }catch{ return false; }
}

function pegarTexto(m){
  if(!m) return '';
  return m.conversation || m.extendedTextMessage?.text || m.imageMessage?.caption || m.videoMessage?.caption || m.documentMessage?.caption || m.groupInviteMessage?.groupName || m.groupInviteMessage?.caption || m.groupInviteMessage?.inviteCode || m.buttonsResponseMessage?.selectedButtonId || m.listResponseMessage?.singleSelectReply?.selectedRowId || m.templateButtonReplyMessage?.selectedId || '';
}

function temLinkDetect(msg, texto){
  try{
    const m = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message || {};
    const soMidiaSemTexto = (m.stickerMessage || m.audioMessage || m.contactMessage || m.locationMessage || m.liveLocationMessage || m.reactionMessage) && !texto;
    if(soMidiaSemTexto) return false;
    if(m.groupInviteMessage || m.channelInviteMessage) return true;
    const t = (texto || '').toLowerCase();
    if(!t) return false;
    if(t.includes('chat.whatsapp.com')) return true;
    if(t.includes('whatsapp.com/channel')) return true;
    if(t.includes('whatsapp.com/newsletter')) return true;
    if(t.includes('wa.me/')) return true;
    if(t.includes('t.me/')) return true;
    if(t.includes('discord.gg')) return true;
    if(t.includes('discord.com/invite')) return true;
    if(/https?:\/\/|www\./i.test(t)) return true;
    if(/\b[a-z0-9-]+\.(com|ao|net|org|me|io|gg|xyz|online|store|link|site|app|br|pt)\b/i.test(t)) return true;
    if(m.extendedTextMessage?.contextInfo?.externalAdReply){
      const ad = JSON.stringify(m.extendedTextMessage.contextInfo.externalAdReply).toLowerCase();
      if(ad.includes('chat.whatsapp.com') || ad.includes('whatsapp.com/channel') || ad.includes('wa.me/')) return true;
    }
    return false;
  }catch{ return false; }
}

module.exports = async ({ sock, msg }) => {
  if(!msg?.message || msg.key.fromMe) return;
  const baseMsg = msg.message.ephemeralMessage?.message || msg.message.viewOnceMessage?.message || msg.message.viewOnceMessageV2?.message || msg.message;
  const texto = pegarTexto(baseMsg);
  if(texto) console.log(`[MSG CHEGOU] ${msg.key.remoteJid}: ${texto}`);
  const jid = msg.key.remoteJid;
  const isGrupo = jid.endsWith('@g.us');
  const quemCheck = msg.key.participant || msg.key.remoteJid;
  const prefixo = (config.prefixo || '€').trim();
  const eComando = texto.trim().startsWith(prefixo);

  const textoLimpo = texto.trim().toLowerCase();
  if (textoLimpo === 'prefixo' || textoLimpo === 'qual é o prefixo' || textoLimpo === 'qual o prefixo' || textoLimpo === 'qual e o prefixo') {
    return sock.sendMessage(jid, { text: `🐺 *EI LOBO!* \n\nMeu prefixo é: *『${prefixo}』*\n\nExemplo: *${prefixo}menu*` }, { quoted: msg });
  }

  if(isGrupo && !eComando){
    try{
      const antilink = require('../comandos/adm/antilink');
      const mute = require('../comandos/adm/mute');
      if(mute.isMutado && mute.isMutado(jid, quemCheck)){ await sock.sendMessage(jid,{delete: msg.key}); return; }
      if(antilink.isAtivo && antilink.isAtivo(jid)){
        const temLink = temLinkDetect(msg, texto);
        if(temLink){
          const meta = await sock.groupMetadata(jid);
          const isAdminDoAlvo = meta.participants.find(p=>p.id===quemCheck)?.admin;
          const isBotAdmin = isBotAdminCheck(meta, sock);
          const eDonoFiltro = isDonoCheck(quemCheck) || isDonoCheck(msg.key.participantAlt);
          if(!isAdminDoAlvo && !eDonoFiltro){
            await sock.sendMessage(jid,{delete: msg.key});
            let avisos = {};
            try{ avisos = antilink.lerAvisos ? antilink.lerAvisos() : {}; }catch{}
            let chave = jid + "_" + quemCheck;
            if(!avisos[chave]){
              avisos[chave] = 1;
              if(antilink.salvarAvisos) antilink.salvarAvisos(avisos);
              await sock.sendMessage(jid,{ text: `🤬 @${quemCheck.split('@')[0]} TU NÃO LEU BEM AS REGRAS ?? 📚🤦‍♂️\n\nVOLTA PRA ESCOLA E QUANDO APRENDERES A LER VOLTA!! 😤👊💥\n\n🔗 *LINK / CANAL PROIBIDO - 1º AVISO!* ⚠️\nDa próxima vais pra FORA!`, mentions: [quemCheck] });
              return;
            }
            delete avisos[chave];
            if(antilink.salvarAvisos) antilink.salvarAvisos(avisos);
            await sock.sendMessage(jid,{ text: `🚨 @${quemCheck.split('@')[0]} Já te avisei 1 vez e não ouviste! Tchau! 👋`, mentions: [quemCheck] });
            if(isBotAdmin){
              await new Promise(r=>setTimeout(r,1500));
              await sock.groupParticipantsUpdate(jid, [quemCheck], 'remove');
              await sock.sendMessage(jid,{text:`🐺 @${quemCheck.split('@')[0]} foi comido pelo lobo por mandar link! 🔥`,mentions:[quemCheck]});
            }
            return;
          }
        }
      }
    }catch(e){ console.log('[FILTRO ERRO]', e.message) }
  }

  if(!texto) return;
  if(!eComando) return;
  const semPrefixo = texto.trim().slice(prefixo.length).trim();
  if(!semPrefixo) return;
  const partes = semPrefixo.split(/\s+/);
  const nome = partes.shift().toLowerCase();
  const args = partes;
  const cmd = comandos.get(nome);

  if(!cmd){
    console.log(`[CMD] Não encontrado: ${nome}`);
    try{ await sock.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } }) }catch{}
    function distancia(a, b){
      const m = [];
      for(let i=0;i<=a.length;i++) m[i]=[i];
      for(let j=0;j<=b.length;j++) m[0][j]=j;
      for(let i=1;i<=a.length;i++){
        for(let j=1;j<=b.length;j++){
          m[i][j] = Math.min(m[i-1][j]+1, m[i][j-1]+1, m[i-1][j-1] + (a[i-1]===b[j-1] ? 0 : 1));
        }
      }
      return m[a.length][b.length];
    }
    const todosNomes = [...comandos.keys()];
    let sugestao = null;
    let menorDist = 999;
    for(const c of todosNomes){
      const d = distancia(nome, c);
      if(d < menorDist){ menorDist = d; sugestao = c; }
    }
    if(menorDist > 2 || Math.abs(sugestao.length - nome.length) > 2){
      sugestao = null;
    }
    const frases = [
      `🐺 *EI, MEU LOBO!* 😅\n\nTu mandaste *${prefixo}${nome}* mas eu não conheço esse truque! 🤔`,
      `🐺 *OPA!* 👀\n\n*${prefixo}${nome}* ?? Que comando é esse? 😂\n\nNem eu que sou lobo conheço!`,
      `🐺 *HMMM...* 🤨\n\nProcurei na floresta toda e não achei *${prefixo}${nome}* ! 🌲`,
      `🐺 *EI ALFA!* 👑\n\n*${prefixo}${nome}* não existe na minha alcateia! 😅`
    ];
    const frase = frases[Math.floor(Math.random() * frases.length)];
    let textoNaoAchado = `${frase}\n\n`;
    if (sugestao) {
      textoNaoAchado += `💡 *Será que querias dizer:*\n👉 *${prefixo}${sugestao}*\n\n`;
    }
    textoNaoAchado += `📋 *Vê no menu:*\n• ${prefixo}menu - Comandos gerais 🐺\n• ${prefixo}menuadm - Comandos de ADM 🚔\n• ${prefixo}menudono - Comandos do Dono 👑\n• ${prefixo}menubrincadeira - Brincadeira 😜\n\n🌙 *PACK ALPHA* - NO COMANDO!`;
    try { await sock.sendMessage(jid, { text: textoNaoAchado }, { quoted: msg }); } catch {}
    return;
  }

  const fn = cmd.fn;
  const cat = cmd.cat;
  let ligado = true;
  try {
    const st = JSON.parse(fs.readFileSync(path.join(__dirname, '../botState.json')));
    ligado = st.ligado !== false;
  } catch {}
  if (!ligado && nome !== 'on') {
    return sock.sendMessage(jid, { text: '😴 *ALPHA TÁ A DORMIR...*\n\nO dono mandou *€off*.\nManda *€on* pra me acordar! 🐺' }, { quoted: msg });
  }
  let emojiReacao = '🐺';
  if (cat === 'adm') emojiReacao = '🚔';
  if (cat === 'dono') emojiReacao = '👑';
  if (cat === 'brincadeiras') emojiReacao = '😜';
  try{ await sock.sendMessage(msg.key.remoteJid, { react: { text: emojiReacao, key: msg.key } }) }catch{}
  const isGrupoCmd = jid.endsWith('@g.us');
  const quem = isGrupoCmd ? (msg.key.participant || msg.key.remoteJid) : jid;
  const isDono = isDonoCheck(quem) || isDonoCheck(jid) || isDonoCheck(msg.key.participantAlt);
  const isPrincipal = isDonoPrincipal(quem) || isDonoPrincipal(jid) || isDonoPrincipal(msg.key.participantAlt);
  const cargoDono = pegarCargo(quem);
  console.log(`[EXEC] ${nome} [${cat}] | Grupo:${isGrupoCmd} | Dono:${isDono} | Cargo:${cargoDono} | Principal:${isPrincipal} | De:${quem}`);
  let isAdm = isDono;
  let cargo = isDono ? cargoDono : 'membro';
  if(isGrupoCmd && !isDono){
    try{
      const meta = await sock.groupMetadata(jid);
      const p = meta.participants.find(x=>x.id===quem || x.id.split('@')[0]===quem.split('@')[0]);
      if(p && (p.admin==='admin' || p.admin==='superadmin')){ isAdm=true; cargo='admin'; }
    }catch(e){ console.log('[ADM CHECK ERRO]', e.message) }
  }
  let isBotAdmin = false;
  try{
    if(isGrupoCmd){
      const meta2 = await sock.groupMetadata(jid);
      isBotAdmin = isBotAdminCheck(meta2, sock);
    }
  }catch{}
  const comandosAdm = ['ban','promover','rebaixar','fechar','abrir','todos','menuadm','antilink','mute','desmute','bemvindo','linkgrupo','regras','setnome'];
  if(comandosAdm.includes(nome) && !isAdm && isGrupoCmd){ return sock.sendMessage(jid,{text:'⛔ Só admin pode usar isso.'},{quoted:msg}); }
  const comandosDono = ['setprefixo','menudono','infodono','antispam','imunidade','on','off','entrar','sair','block','unblock','exec','reiniciar','setsub','subdonos','canal'];
  if(comandosDono.includes(nome) && !isDono){ return sock.sendMessage(jid,{text:'⛔ Só o dono pode usar isso.'},{quoted:msg}); }
  if(nome === 'setsub' && !isPrincipal){ return sock.sendMessage(jid,{text:'⛔ Só o Dono principal pode meter Sub Dono!'},{quoted:msg}); }
  if(['exec','reiniciar'].includes(nome) && !isPrincipal){ return sock.sendMessage(jid,{text:'⛔ Só o Dono principal pode usar isso!'},{quoted:msg}); }
  try{ await fn({ sock, msg, args, config, isDono, isDonoPrincipal: isPrincipal, isAdm, isBotAdmin, cargo, cargoDono, remetente:quem }); }catch(e){
    console.error('Erro ao executar',nome,e);
    await sock.sendMessage(jid,{text:`❌ Erro no ${nome}: ${e.message}`},{quoted:msg});
  }
};
