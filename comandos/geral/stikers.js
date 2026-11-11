const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

async function getBuffer(message) {
  const type = Object.keys(message)[0];
  const stream = await downloadContentFromMessage(message[type], type.replace('Message',''));
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  return buffer;
}

module.exports = async ({ sock, msg, config }) => {
  const jid = msg.key.remoteJid;
  const context = msg.message?.extendedTextMessage?.contextInfo;
  let target = context?.quotedMessage || msg.message;

  const hasMedia = target.imageMessage || target.videoMessage;
  if (!hasMedia) {
    return sock.sendMessage(jid, { text: `❌ Responde a uma FOTO com ${config.prefixo}s` }, { quoted: msg });
  }

  try {
    await sock.sendMessage(jid, { react: { text: '⏳', key: msg.key } });
    let buffer = await getBuffer(target);
    const webpBuffer = await sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 80 }).toBuffer();
    await sock.sendMessage(jid, { sticker: webpBuffer }, { quoted: msg });
    await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });
  } catch (e) {
    await sock.sendMessage(jid, { text: `❌ Erro: ${e.message}` }, { quoted: msg });
  }
};
