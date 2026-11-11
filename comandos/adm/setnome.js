module.exports=async({sock,msg,args})=>{
  const jid=msg.key.remoteJid;
  if(!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ Ei, meu lobo! Isso só funciona em grupo! 🐺' }, { quoted: msg });
  if(!args.length) return sock.sendMessage(jid,{text:'🐺 Ei Alfa! Me diz o nome novo!\n\nUsa assim: €setnome Novo nome da alcateia 🌙'},{quoted:msg});
  try{
    await sock.groupUpdateSubject(jid, args.join(' '));
    await sock.sendMessage(jid,{text:`✨ *NOME NOVO NA ALCATEIA!* 🐺🔥\n\nO grupo agora se chama:\n\n👑 *${args.join(' ')}* 👑\n\n🌙 *PACK ALPHA* - NO COMANDO!`},{quoted:msg});
  }catch(e){ 
    console.log('[SETNOME ERRO]', e.message);
    await sock.sendMessage(jid,{text:'❌ Não consegui mudar! 😭🐺\n\nMotivo: ' + e.message.slice(0,100) + '\n\nSerá que eu não sou ADMIN? Me dá ADMIN! 🙏👑'},{quoted:msg}); 
  }
}
