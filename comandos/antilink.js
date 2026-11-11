const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../antilink.json');
const arquivoAvisos = path.join(__dirname, '../../avisos.json');

function ler() {
  try { return JSON.parse(fs.readFileSync(arquivo)); } catch { return {}; }
}
function salvar(dados) {
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}
function lerAvisos() {
  try { return JSON.parse(fs.readFileSync(arquivoAvisos)); } catch { return {}; }
}
function salvarAvisos(dados) {
  fs.writeFileSync(arquivoAvisos, JSON.stringify(dados, null, 2));
}

function isAtivo(jid) {
  const dados = ler();
  return dados[jid] === true;
}

// Verifica se o bot é ADM de verdade - checa ID + LID
async function botEAdmin(sock, jid){
  try{
    const meta = await sock.groupMetadata(jid);
    const idsBot = [];
    if(sock.user?.id) idsBot.push(String(sock.user.id).split(':')[0].split('@')[0]);
    if(sock.user?.lid) idsBot.push(String(sock.user.lid).split(':')[0].split('@')[0]);
    for(const p of meta.participants){
      const pid = String(p.id || '').split('@')[0];
      const pFull = String(p.id || '');
      for(const b of idsBot){
        if(!b) continue;
        if(pid === b || pFull.includes(b)){
          if(p.admin === 'admin' || p.admin === 'superadmin') return true;
        }
      }
      if(pFull === String(sock.user?.id) && (p.admin === 'admin' || p.admin === 'superadmin')) return true;
    }
    return false;
  }catch{ return false; }
}

async function antilink({ sock, msg, args, isAdm, isBotAdmin }) {
  const jid = msg.key.remoteJid;
  if (!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ O antilink só funciona em grupo!' }, { quoted: msg });
  if (!isAdm) return sock.sendMessage(jid, { text: '⛔ Só admin pode usar isso.' }, { quoted: msg });

  const opcao = (args[0] || '').toLowerCase();
  const dados = ler();

  if (opcao === 'on') {
    // Confirma de novo aqui dentro, caso o handler falhe
    let souAdm = isBotAdmin;
    if(!souAdm) souAdm = await botEAdmin(sock, jid);
    console.log(`[ANTILINK ON] souAdm=${souAdm} | isBotAdmin param=${isBotAdmin} | meuId=${sock.user?.id} | meuLid=${sock.user?.lid}`);
    if (!souAdm) {
      return sock.sendMessage(jid, { text: '⚠️ Ei! Eu NÃO sou ADM nesse grupo! 🐺\n\nMe mete ADM primeiro senão eu não consigo apagar link nenhum!' }, { quoted: msg });
    }
    dados[jid] = true;
    salvar(dados);
    return sock.sendMessage(jid, { text: '🔗 *ANTILINK LIGADO!* 🐺\n\nModo: 1º aviso ⚠️, 2ª vez BANE! 🚨\nQuem mandar link vai ser comido pelo lobo! 🔥' }, { quoted: msg });
  }

  if (opcao === 'off') {
    dados[jid] = false;
    salvar(dados);
    return sock.sendMessage(jid, { text: '🔗 *ANTILINK DESLIGADO!* 🐺\n\nLinks liberados por agora!' }, { quoted: msg });
  }

  const status = isAtivo(jid) ? '🟢 LIGADO' : '🔴 DESLIGADO';
  return sock.sendMessage(jid, { text: `🐺 *ANTILINK - PACK ALPHA*\n\nStatus neste grupo: *${status}*\n\nUsa:\n• \`€antilink on\` - Ligar\n• \`€antilink off\` - Desligar` }, { quoted: msg });
}

antilink.isAtivo = isAtivo;
antilink.lerAvisos = lerAvisos;
antilink.salvarAvisos = salvarAvisos;
module.exports = antilink;
