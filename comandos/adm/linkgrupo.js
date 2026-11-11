module.exports=async({sock,msg})=>{
  const jid=msg.key.remoteJid;
  if(!jid.endsWith('@g.us')) return sock.sendMessage(jid,{text:'⛔ Ei, meu lobo! Isso só funciona em grupo! 🐺'},{quoted:msg});
  try{
    const code=await sock.groupInviteCode(jid);
    await sock.sendMessage(jid,{text:`🔗 *LINK DA ALCATEIA!* 🐺🔥\n\nTá aqui a chave da nossa casa! 🏠🌙\n\nhttps://chat.whatsapp.com/${code}\n\nChama teus lobos, chama teus amigos, chama todo mundo! 🎉🐺\nMas cuidado... só manda pra quem é de confiança, senão o lobo vai ter que caçar! 😈🔥\n\n🌙 *PACK ALPHA* - NO COMANDO!`},{quoted:msg});
  }catch(e){ await sock.sendMessage(jid,{text:'❌ Aiiii! Não consegui pegar o link! 😭🐺\n\nSerá que eu não sou ADMIN? Me dá ADMIN que eu trago o link na hora! 🙏👑'},{quoted:msg}); }
}
