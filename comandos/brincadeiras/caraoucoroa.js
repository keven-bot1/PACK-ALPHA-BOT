module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    const res = Math.random() < 0.5 ? "🪙 CARA!" : "👑 COROA!";
    await sock.sendMessage(from, { text: `*CARA OU COROA*\n\nResultado: ${res}` }, { quoted: Info });
  } catch(e){ console.log("Erro caraoucoroa:", e); }
};
