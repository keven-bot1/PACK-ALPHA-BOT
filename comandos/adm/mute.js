const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname,'../../db/mute.json');
function load(){ try{ return JSON.parse(fs.readFileSync(dbPath)); }catch{ return {}; } }
function save(d){ if(!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath),{recursive:true}); fs.writeFileSync(dbPath, JSON.stringify(d,null,2)); }

module.exports = async ({ sock, msg, args, config }) => {
  const jid = msg.key.remoteJid;
  if(!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ Ei, meu lobo! Isso só funciona em grupo! 🐺' }, { quoted: msg });
  const meta = await sock.groupMetadata(jid);
  const ctx = msg.message.extendedTextMessage?.contextInfo;
  let alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
  if(!alvo && args[0]){ let n=args[0].replace(/\D/g,''); const a=meta.participants.find(p=>p.id.includes(n.slice(-9))); alvo=a?a.id:n+'@s.whatsapp.net'; }
  if(!alvo) return sock.sendMessage(jid,{text:`🐺 Ei Alfa! Marca quem tu queres calar!\n\nUsa assim: ${config.prefixo}mute @pessoa 🔇\n\nSem marcar eu não sei quem calar! 😅`},{quoted:msg});
  const db=load(); if(!db[jid]) db[jid]=[]; if(!db[jid].includes(alvo)){ db[jid].push(alvo); save(db); }
  await sock.sendMessage(jid,{text:`🔇 *SILÊNCIO!* 🐺😈\n\n@${alvo.split('@')[0]} FOI MUTADO! 🤫\n\nO LOBO ALFA MANDOU CALAR! 👑🐺\n\nAgora fica só a ouvir, sem falar nada! Fala uma palavra que eu apago! 💥🔥\n\nQuem manda aqui é a alcateia! 🌙\n\n🌙 *PACK ALPHA* - NO COMANDO!`,mentions:[alvo]},{quoted:msg});
};

module.exports.isMutado = (jid,user) => {
  try{ const db=JSON.parse(fs.readFileSync(dbPath)); return db[jid]?.includes(user); }catch{ return false; }
};

module.exports.desmutar = (jid,user) => {
  try{
    const db=JSON.parse(fs.readFileSync(dbPath));
    if(!db[jid]) return;
    db[jid]=db[jid].filter(x=>x!==user);
    fs.writeFileSync(dbPath, JSON.stringify(db,null,2));
  }catch{}
};
