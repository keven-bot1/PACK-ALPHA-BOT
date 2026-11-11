// block.js
module.exports = async ({ sock, msg, msgInfo }) => {
  let alvo = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || msgInfo?.quoted?.participant;
  if(!alvo) return sock.sendMessage(msg.key.remoteJid,{text:'Marca a pessoa: €block @pessoa'},{quoted:msg});
  await sock.updateBlockStatus(alvo, 'block');
  await sock.sendMessage(msg.key.remoteJid,{text:'🚫 Bloqueado pelo DONO'},{quoted:msg});
};
// unblock.js - troca 'block' por 'unblock' e o texto
