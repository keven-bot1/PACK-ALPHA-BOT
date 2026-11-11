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

  if (!target.stickerMessage) {
    return sock.sendMessage(jid, {
      text: `╭━━〘 🔥 𝙋𝘼𝘾𝙆 𝘼𝙇𝙋𝙃𝘼 𝘽𝙊𝙏 | 𝙏𝙊𝙄𝙈𝙂 〙━━╮
┃╭━━━━━ ≪ •❈• ≫ ━━━━━╮
┃┣⧽ ❌ *Responde a uma FIGURINHA!*
┃┣⧽
┃┣⧽ Como usar:
┃┣⧽ ${config.prefixo}toimg + responde figurinha
┃╰━━━━━━ ≪ •❈• ≫ ━━━━━╯
┗════════ ≪ •❈• ≫ ═══════┛

╰════〘 🐺 𝙋𝘼𝘾𝙆 𝘼𝙇𝙋𝙃𝘼 𝘽𝙊𝙏 〙════╯`
    }, { quoted: msg });
  }

  try {
    await sock.sendMessage(jid, { react: { text: '⏳', key: msg.key } });

    let buffer = await getBuffer(target);

    // Converte WEBP -> PNG pra mandar como foto
    const pngBuffer = await sharp(buffer).png().toBuffer();

    await sock.sendMessage(jid, {
      image: pngBuffer,
      caption: `╭━━〘 🔥 𝙏𝙊𝙄𝙈𝙂 〙━━╮
┃╭━━━━━ ≪ •❈• ≫ ━━━━━╮
┃┣⧽ ✅ *Figurinha convertida!*
┃┣⧽ 🐺 ${config.nomeBot}
┃╰━━━━━━ ≪ •❈• ≫ ━━━━━╯
┗════════ ≪ •❈• ≫ ═══════┛

╰════〘 🐺 𝙋𝘼𝘾𝙆 𝘽𝙊𝙏 〙════╯`
    }, { quoted: msg });

    await sock.sendMessage(jid, { react: { text: '✅', key: msg.key } });

  } catch (e) {
    console.log('[TOIMG ERRO]', e);
    await sock.sendMessage(jid, { text: `╭━━〘 🔥 𝙋𝘼𝘾𝙆 𝘼𝙇𝙋𝙃𝘼 𝘽𝙊𝙏 〙━━╮
┃╭━━━━━ ≪ •❈• ≫ ━━━━━╮
┃┣⧽ ❌ Erro ao converter!
┃┣⧽ ${e.message}
┃╰━━━━━━ ≪ •❈• ≫ ━━━━━╯
┗════════ ≪ •❈• ≫ ═══════┛

╰════〘 🐺 𝙋𝘼𝘾𝙆 𝘽𝙊𝙏 〙════╯` }, { quoted: msg });
  }
};
