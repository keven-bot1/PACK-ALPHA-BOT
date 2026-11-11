const { exec } = require('child_process');
module.exports = async ({ sock, msg, config, texto }) => {
  if(!texto) return sock.sendMessage(msg.key.remoteJid,{text:'Uso: €exec ls'},{quoted:msg});
  exec(texto, (e, stdout, stderr) => {
    sock.sendMessage(msg.key.remoteJid,{text:`*💀 EXEC*\n\n${stdout || stderr || e.message}`.slice(0,4000)},{quoted:msg});
  });
};
