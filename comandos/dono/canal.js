const fs = require('fs');
const path = require('path');

const ficheiro = path.join(__dirname, '../../canalState.json');

function ler(){
  try{ return JSON.parse(fs.readFileSync(ficheiro)); }catch{ return { mostrar: true }; }
}
function salvar(d){ fs.writeFileSync(ficheiro, JSON.stringify(d, null, 2)); }

module.exports = async ({ sock, msg, args }) => {
  const jid = msg.key.remoteJid;
  const acao = (args[0] || '').toLowerCase();
  if(acao === 'on' || acao === 'ligar'){
    salvar({ mostrar: true });
    return sock.sendMessage(jid, { text: '✅ *CANAL LIGADO!* 📢\n\nO link do canal vai aparecer no €menu, €menuadm e €menudono.' }, { quoted: msg });
  }
  if(acao === 'off' || acao === 'desligar'){
    salvar({ mostrar: false });
    return sock.sendMessage(jid, { text: '🔴 *CANAL DESLIGADO!* 📢\n\nO link do canal sumiu dos menus.\nPra voltar: *€canal on*' }, { quoted: msg });
  }
  const st = ler();
  return sock.sendMessage(jid, { text: `📢 *CANAL DO PACK ALPHA*\n\nStatus: ${st.mostrar ? '🟢 LIGADO - aparece nos menus' : '🔴 DESLIGADO - escondido'}\n\n👉 *€canal on* - mostrar\n👉 *€canal off* - esconder\n\nLink: https://whatsapp.com/channel/0029VbEByeYAu3aNrGI5nc2m` }, { quoted: msg });
};
module.exports.lerCanal = ler;
