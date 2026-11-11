module.exports = async ({ sock, msg }) => {
  await sock.sendMessage(msg.key.remoteJid,{text:'🐺 Reiniciando PACK ALPHA... 3s'},{quoted:msg});
  setTimeout(()=> process.exit(0), 2000);
};
