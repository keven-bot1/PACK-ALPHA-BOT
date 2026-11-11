const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = async ({ sock, msg, config }) => {
  const jid = msg.key.remoteJid;
  const p = (config.prefixo || '€').trim();
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const quoted = ctx?.quotedMessage;
  const stickerMsg = quoted?.stickerMessage;

  if (!stickerMsg) {
    return sock.sendMessage(jid, { text: `╭──〘 ROUBAR 〙──╮\n┃ 𓆩ꨄ𓆪 Responde num sticker com:\n┃ 𓆩ꨄ𓆪 『${p}roubar』\n╰──〘 PACK BOT 〙──╯` }, { quoted: msg });
  }

  try {
    const stream = await downloadContentFromMessage(stickerMsg, 'sticker');
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    await sock.sendMessage(jid, { sticker: buffer }, { quoted: msg });
    await sock.sendMessage(jid, { text: `╭──〘 ROUBADO! 〙──╮\n┃ 𓆩ꨄ𓆪 Missão cumprida! Roubei sem deixar rasto!\n╰──〘 PACK BOT 〙──╯` }, { quoted: msg });
  } catch (e) {
    await sock.sendMessage(jid, { text: `Não consegui roubar esse sticker! Tenta outro.` }, { quoted: msg });
  }
};
