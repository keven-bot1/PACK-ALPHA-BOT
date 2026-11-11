// comandos/geral/revelar.js - VERSÃO PRIVACIDADE
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = async ({ sock, msg }) => {
  try {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quoted) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `👁️ *REVELAR - MODO PRIVADO*\n\n⚠️ Só revela quando tu mandar\n\nMarca a mídia única e digita €revelar\n\n🔒 Respeita a privacidade`
      }, { quoted: msg });
    }

    let viewOnceMsg = quoted.viewOnceMessageV2?.message || 
                      quoted.viewOnceMessage?.message ||
                      quoted;

    const type = Object.keys(viewOnceMsg)[0];
    let mediaMsg = viewOnceMsg[type];
    if (mediaMsg?.message) {
      mediaMsg = mediaMsg.message[Object.keys(mediaMsg.message)[0]];
    }

    const buffer = await downloadMediaMessage(
      { message: { [type]: mediaMsg } },
      'buffer',
      {},
      { logger: console, reuploadRequest: sock.updateMediaMessage }
    );

    if (type.includes('image')) {
      await sock.sendMessage(msg.key.remoteJid, { image: buffer, caption: `📸 Revelado com €revelar` }, { quoted: msg });
    } else if (type.includes('video')) {
      await sock.sendMessage(msg.key.remoteJid, { video: buffer, caption: `🎥 Revelado com €revelar` }, { quoted: msg });
    } else if (type.includes('audio')) {
      await sock.sendMessage(msg.key.remoteJid, { audio: buffer, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: msg });
    }

  } catch (e) {
    await sock.sendMessage(msg.key.remoteJid, { text: `❌ Erro: ${e.message}` }, { quoted: msg });
  }
};
