const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/bemvindo.json');

function loadDB(){
  try{
    if(!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    if(!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '{}');
    return JSON.parse(fs.readFileSync(dbPath));
  }catch{ return {}; }
}
function saveDB(db){
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function isAtivo(groupId){
  const db = loadDB();
  return db[groupId] === true;
}

async function bemvindoCmd({ sock, msg, args, config }){
  const jid = msg.key.remoteJid;
  const db = loadDB();
  const p = config.prefixo;

  if(!args[0]){
    return sock.sendMessage(jid, { text: `👋 *BEM-VINDO*\n\nUse:\n${p}bemvindo on - ativa\n${p}bemvindo off - desativa\n\nStatus: ${db[jid] ? '✅ ATIVO' : '❌ DESATIVADO'}` }, { quoted: msg });
  }

  if(args[0].toLowerCase() === 'on' || args[0].toLowerCase() === 'ativar'){
    db[jid] = true;
    saveDB(db);
    return sock.sendMessage(jid, { text: `✅ Bem-vindo ATIVADO!\nAgora vou receber novos membros com foto.` }, { quoted: msg });
  }
  
  if(args[0].toLowerCase() === 'off' || args[0].toLowerCase() === 'desativar'){
    db[jid] = false;
    saveDB(db);
    return sock.sendMessage(jid, { text: `❌ Bem-vindo DESATIVADO!` }, { quoted: msg });
  }
}

bemvindoCmd.isAtivo = isAtivo;
module.exports = bemvindoCmd;
