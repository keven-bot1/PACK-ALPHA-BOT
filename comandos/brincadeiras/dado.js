module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    const n = Math.floor(Math.random() * 6) + 1;
    await sock.sendMessage(from, { text: `🎲 Você tirou: *${n}*` }, { quoted: Info });
  } catch(e){ console.log("Erro dado:", e); }
};
