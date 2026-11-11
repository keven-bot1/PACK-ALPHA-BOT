module.exports = async ({ sock, msg, config }) => {
  const texto = `╭══〘  INFO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Bot: 『${config.nomeBot}』
┃𓆩ꨄ𓆪 Versão: 『${config.versao}』
┃𓆩ꨄ𓆪 Criador: 『${config.donoNome}』
┃𓆩ꨄ𓆪 Proprietário: 『${config.donoNumeroLimpo}』
┃𓆩ꨄ𓆪 Linguagem: 『JavaScript』
┃𓆩ꨄ𓆪 Tecnologia: 『Node.js』
┃𓆩ꨄ𓆪 Estado: 『Online』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════════┛

𓆩ꨄ𓆪 POWER • SPEED • QUALITY
𓆩ꨄ𓆪 FUTURE TECHNOLOGY

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  await sock.sendMessage(msg.key.remoteJid, {
    text: texto
  }, { quoted: msg });
};
