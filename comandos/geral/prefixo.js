module.exports = async ({ sock, msg, config }) => {
  const jid = msg.key.remoteJid;
  const p = config.prefixo || '€';

  const texto = `╭══〘  PREFIXO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Bot: 『${config.nomeBot || 'PACK ALPHA BOT'}』
┃𓆩ꨄ𓆪 Prefixo: 『${p}』
┃𓆩ꨄ𓆪 Exemplo: 『${p}menu』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════════┛

𓆩ꨄ𓆪 Usa 『${p}』 antes de todos os comandos!
𓆩ꨄ𓆪 Ex: 『${p}menu』 / 『${p}ping』 / 『${p}dono』

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯`;

  await sock.sendMessage(jid, { text: texto }, { quoted: msg });
};
