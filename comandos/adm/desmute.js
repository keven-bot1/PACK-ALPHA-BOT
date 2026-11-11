const mute = require('./mute');
module.exports = async ({ sock, msg, args, config }) => {
  const jid = msg.key.remoteJid;
  if(!jid.endsWith('@g.us')) return sock.sendMessage(jid, { text: '⛔ Ei, meu lobo! Isso só funciona em grupo! 🐺' }, { quoted: msg });
  const meta = await sock.groupMetadata(jid);
  const ctx = msg.message.extendedTextMessage?.contextInfo;
  let alvo = ctx?.mentionedJid?.[0] || ctx?.participant;
  if(!alvo && args[0]){ let n=args[0].replace(/\D/g,''); const a=meta.participants.find(p=>p.id.includes(n.slice(-9))); alvo=a?a.id:n+'@s.whatsapp.net'; }
  if(!alvo) return sock.sendMessage(jid,{text:`🐺 Ei Alfa! Marca quem tu queres libertar!\n\nUsa assim: ${config.prefixo}desmute @pessoa 🔓\n\nSem marcar eu não sei quem soltar! 😅`},{quoted:msg});
  mute.desmutar(jid,alvo);
  await sock.sendMessage(jid,{text:`🔊 *LIBERDADE!* 🐺🔥\n\n@${alvo.split('@')[0]} FOI DESMUTADO! 🎉\n\nPode falar, pode gritar, pode uivar à vontade! 🌕🐺\nA alcateia quer te ouvir de novo! 💬🔥\n\nSeja bem-vindo de volta, lobo! 🤗\n\n🌙 *PACK ALPHA* - NO COMANDO!`,mentions:[alvo]},{quoted:msg});
};
