module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    const ctx = Info?.message?.extendedTextMessage?.contextInfo || Info?.contextInfo;
    let target = ctx?.mentionedJid?.[0] || ctx?.participant || Info?.key?.participant || Info?.key?.remoteJid;
    const p = Math.floor(Math.random()*101);
    let frase = p===0 ? "ZERO GAY! Macho alfa 😎" : p<=20 ? "Quase nada 😉" : p<=40 ? "Suspeito 👀" : p<=60 ? "Meio termo 💅" : p<=80 ? "Forte presença ✨" : p<100 ? "Quase explodindo 🦄" : "100% ÍCONE SUPREMO 💃";
    await sock.sendMessage(from, { image: { url: "https://files.catbox.moe/6z8xwy.jpg" }, caption: `🏳️‍🌈 *MEDIDOR GAY*\n\n👤 Alvo: @${target.split("@")[0]}\n📊 Nível: ${p}%\n📝 ${frase}`, mentions: [target] }, { quoted: Info });
  } catch(e){ console.log("Erro gay:", e); }
};
