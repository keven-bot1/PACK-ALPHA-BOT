module.exports = async (...args) => {
  try {
    let sock, from, Info;
    if (args[0] && args[0].sock) { sock = args[0].sock; from = args[0].from || args[0].msg?.key?.remoteJid; Info = args[0].msg || args[0].Info; }
    else { [sock, from, Info] = args; }
    const emojis = ["🍒","🍋","🍇","💎","7️⃣","🔔"];
    const a = emojis[Math.floor(Math.random()*emojis.length)];
    const b = emojis[Math.floor(Math.random()*emojis.length)];
    const c = emojis[Math.floor(Math.random()*emojis.length)];
    const win = (a===b && b===c) ? "\n🎉 JACKPOT! Você ganhou!" : "\nTenta de novo 😅";
    await sock.sendMessage(from, { text: `🎰 *SLOT*\n\n| ${a} | ${b} | ${c} |${win}` }, { quoted: Info });
  } catch(e){ console.log("Erro slot:", e); }
};
