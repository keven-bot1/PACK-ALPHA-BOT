const fs = require('fs');
const path = require('path');
const arquivo = path.join(__dirname, '../../subdonos.json');

function ler(){
  try{ return JSON.parse(fs.readFileSync(arquivo)); }catch{ return []; }
}
function salvar(d){
  fs.writeFileSync(arquivo, JSON.stringify(d, null, 2));
}

module.exports = async ({ sock, msg, args, isDono }) => {
  const jid = msg.key.remoteJid;
  if(!isDono) return sock.sendMessage(jid, { text: '⛔ Só o Dono pode usar isso!' }, { quoted: msg });

  const mencionado = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const numero = mencionado || (args[0] && args[0].toLowerCase() !== 'del' ? args[0].replace(/[^0-9]/g,'') + '@s.whatsapp.net' : null);
  
  if(!numero) return sock.sendMessage(jid, { text: '👑 Usa assim:\n\n• `€setsub @pessoa` - Meter como Sub Dono\n• `€setsub del @pessoa` - Tirar Sub Dono\n• `€setsub @pessoa dono3` - Meter como Dono 3\n• `€setsub @pessoa dono4` - Meter como Dono 4' }, { quoted: msg });

  let lista = ler();
  const idLimpo = numero.split('@')[0];
  const acao = (args[0] || '').toLowerCase() === 'del' ? 'del' : 'add';

  // ===== CORRIGIDO: só olha o cargo, nunca o número =====
  // Se usaste menção: cargo está em args[1]
  // Se usaste número: cargo está em args[1]
  // Se usaste del: cargo não interessa
  const cargoArg = (args[1] || '').toLowerCase();
  let cargoFinal = 'subdono';
  if(cargoArg === 'dono3' || cargoArg === '3') cargoFinal = 'dono3';
  if(cargoArg === 'dono4' || cargoArg === '4') cargoFinal = 'dono4';
  if(cargoArg === 'sub' || cargoArg === 'subdono') cargoFinal = 'subdono';

  if(acao === 'del'){
    lista = lista.filter(x => x.id.split('@')[0] !== idLimpo);
    salvar(lista);
    return sock.sendMessage(jid, { text: `✅ @${idLimpo} já NÃO é mais Sub Dono!`, mentions: [numero] }, { quoted: msg });
  }

  // Se já existe, atualiza o cargo
  const ja = lista.find(x => x.id.split('@')[0] === idLimpo);
  if(ja){
    ja.cargo = cargoFinal;
    salvar(lista);
    return sock.sendMessage(jid, { text: `🔄 @${idLimpo} agora é *${cargoFinal.toUpperCase()}*!`, mentions: [numero] }, { quoted: msg });
  }

  lista.push({ id: numero, cargo: cargoFinal, por: msg.key.participant, data: new Date().toISOString() });
  salvar(lista);
  return sock.sendMessage(jid, { text: `👑 *${cargoFinal.toUpperCase()} ADICIONADO!*\n\n@${idLimpo} agora é ${cargoFinal.toUpperCase()} da alcateia! 🐺`, mentions: [numero] }, { quoted: msg });
};

module.exports.lerSubDonos = ler;
