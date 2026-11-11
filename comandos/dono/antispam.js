// comandos/dono/antispam.js - SOZINHO, sem precisar de utils
let ligadoPorGrupo = new Map();
let globalLigado = true;

module.exports = async ({ sock, msg, args }) => {
  const jid = msg.key.remoteJid;
  const acao = (args[0] || '').toLowerCase();

  if (acao === 'on' || acao === 'ligar' || acao === 'ativar') {
    ligadoPorGrupo.set(jid, true);
    globalLigado = true;
    return sock.sendMessage(jid, { text: '✅ *Antispam LIGADO* 🐺\nQuem fizer spam vai ser bloqueado 30s.' }, { quoted: msg });
  }

  if (acao === 'off' || acao === 'desligar' || acao === 'desativar') {
    ligadoPorGrupo.set(jid, false);
    globalLigado = false;
    return sock.sendMessage(jid, { text: '❌ *Antispam DESLIGADO*' }, { quoted: msg });
  }

  const ativo = ligadoPorGrupo.has(jid) ? ligadoPorGrupo.get(jid) : globalLigado;
  return sock.sendMessage(jid, { text: `🛡️ *ANTISPAM:* ${ativo ? '✅ LIGADO' : '❌ DESLIGADO'}\n\nUsa:\n€antispam on - ligar\n€antispam off - desligar` }, { quoted: msg });
};

// Funções para outros arquivos usarem se precisarem
module.exports.isAntispamAtivo = (jid) => ligadoPorGrupo.has(jid) ? ligadoPorGrupo.get(jid) : globalLigado;
module.exports.setAntispam = (jid, valor) => {
  const ligado = valor === true || valor === 'on';
  ligadoPorGrupo.set(jid, ligado);
  return ligado;
};
