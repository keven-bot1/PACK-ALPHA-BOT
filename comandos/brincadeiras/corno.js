module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    const participantes = Info?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const porcentagem = Math.floor(Math.random() * 101);
    const frases = ["Macho alfa 😎", "Quase nada 😉", "Suspeito 👀", "Meio termo 💅", "Forte presença ✨", "Quase explodindo 🦄", "ÍCONE SUPREMO 💃"];
    const idx = porcentagem === 0 ? 0 : porcentagem <= 20 ? 1 : porcentagem <= 40 ? 2 : porcentagem <= 60 ? 3 : porcentagem <= 80 ? 4 : porcentagem < 100 ? 5 : 6;
    const alvo = participantes[0] || Info?.key?.participant || Info?.key?.remoteJid;
    await sock.sendMessage(from, { text: `👤 Alvo: @${alvo.split("@")[0]}\n📊 Nível: ${porcentagem}%\n📝 ${frases[idx]}`, mentions: [alvo] }, { quoted: Info });
  } catch(e){ console.log("Erro corno:", e); }
};
