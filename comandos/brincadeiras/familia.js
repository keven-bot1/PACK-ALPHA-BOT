const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../../familia.json');

function load() {
  try { return JSON.parse(fs.readFileSync(file)); }
  catch { return {}; }
}
function save(d) {
  fs.writeFileSync(file, JSON.stringify(d, null, 2));
}
const pick = (a) => a[Math.floor(Math.random() * a.length)];

module.exports = async ({ sock, msg, config, args, remetente }) => {
  const jid = msg.key.remoteJid;
  const p = (config.prefixo || '€').trim();
  const eu = remetente || msg.key.participant || jid;
  const db = load();
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  const alvo = ctx?.mentionedJid?.[0] || null;
  const txt = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').toLowerCase();
  const sub = txt.replace(p, '').trim().split(/\s+/)[0];
  const top = (t) => `╭──〘 ${t} 〙──╮`;
  const fim = `╰──〘 PACK BOT 〙──╯`;

  if (sub === 'namorar') {
    if (!alvo) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Marca quem queres namorar!\n┃ Ex: 『${p}namorar @pessoa』\n${fim}` }, { quoted: msg });
    if (alvo === eu) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Não dá pra namorar contigo mesmo! 😂\n${fim}` }, { quoted: msg });
    if (db[eu]?.parceiro) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Tu já tens alguém! 👀\n${fim}` }, { quoted: msg });
    if (db[alvo]?.parceiro) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Essa pessoa já tem dono(a)! 💔\n${fim}` }, { quoted: msg });
    db[alvo] = db[alvo] || {};
    db[alvo].pedidoDe = eu;
    save(db);
    return sock.sendMessage(jid, { text: `${top('PEDIDO DE NAMORO')}\n┃ @${eu.split('@')[0]} pediu @${alvo.split('@')[0]} em namoro!\n┃ Aceitas? 『${p}aceitar』 ou 『${p}recusar』\n${fim}`, mentions: [eu, alvo] }, { quoted: msg });
  }

  if (sub === 'aceitar') {
    const de = db[eu]?.pedidoDe;
    if (!de) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Ninguém te pediu... 🥺\n${fim}` }, { quoted: msg });
    db[eu] = { parceiro: de, estado: 'namorando', filhos: [] };
    db[de] = { parceiro: eu, estado: 'namorando', filhos: [] };
    save(db);
    return sock.sendMessage(jid, { text: `${top('NAMORO ACEITO!')}\n┃ @${eu.split('@')[0]} disse SIM!\n┃ Pra casar: 『${p}casar』\n${fim}`, mentions: [eu, de] }, { quoted: msg });
  }

  if (sub === 'recusar') {
    const de = db[eu]?.pedidoDe;
    if (!de) return sock.sendMessage(jid, { text: `${top('NAMORO')}\n┃ Ninguém te pediu... 😅\n${fim}` }, { quoted: msg });
    delete db[eu].pedidoDe; save(db);
    return sock.sendMessage(jid, { text: `${top('FORA!')}\n┃ @${eu.split('@')[0]} recusou @${de.split('@')[0]}...\n${fim}`, mentions: [eu, de] }, { quoted: msg });
  }

  if (sub === 'casar') {
    const meu = db[eu];
    if (!meu?.parceiro || meu.estado !== 'namorando') return sock.sendMessage(jid, { text: `${top('CASAMENTO')}\n┃ Primeiro namora! 『${p}namorar @pessoa』\n${fim}` }, { quoted: msg });
    const par = meu.parceiro;
    db[eu].estado = 'casado'; db[par].estado = 'casado';
    save(db);
    return sock.sendMessage(jid, { text: `${top('CASADOS!')}\n┃ @${eu.split('@')[0]} ❤ @${par.split('@')[0]}\n┃ Pra ter filho: 『${p}filho [nome]』\n${fim}`, mentions: [eu, par] }, { quoted: msg });
  }

  if (sub === 'filho') {
    const meu = db[eu];
    if (!meu?.parceiro || meu.estado !== 'casado') return sock.sendMessage(jid, { text: `${top('FILHOS')}\n┃ Só casado pode ter filho! Primeiro 『${p}casar』\n${fim}` }, { quoted: msg });
    const nomeFilho = args.join(' ') || pick(['Luna', 'Théo', 'Maya', 'Kiko', 'Zoe', 'Leo']);
    const sexo = pick(['Menina', 'Menino']);
    db[eu].filhos.push({ nome: nomeFilho, sexo });
    db[meu.parceiro].filhos.push({ nome: nomeFilho, sexo });
    save(db);
    return sock.sendMessage(jid, { text: `${top('NASCEU UM BEBÊ!')}\n┃ Nome: 『${nomeFilho}』\n┃ Sexo: 『${sexo}』\n${fim}`, mentions: [eu, meu.parceiro] }, { quoted: msg });
  }

  if (sub === 'familia') {
    const meu = db[eu];
    if (!meu?.parceiro) return sock.sendMessage(jid, { text: `${top('FAMÍLIA')}\n┃ Tu estás solteiro(a)... Usa 『${p}namorar @pessoa』\n${fim}` }, { quoted: msg });
    const filhosTxt = meu.filhos.length ? meu.filhos.map(f => `┃ ${f.nome} (${f.sexo})`).join('\n') : `┃ Ainda sem filhos...`;
    return sock.sendMessage(jid, { text: `${top('MINHA FAMÍLIA')}\n┃ Estado: 『${meu.estado}』\n┃ Parceiro: @${meu.parceiro.split('@')[0]}\n┃ Filhos (${meu.filhos.length}):\n${filhosTxt}\n${fim}`, mentions: [eu, meu.parceiro] }, { quoted: msg });
  }

  if (sub === 'divorcio') {
    const meu = db[eu];
    if (!meu?.parceiro) return sock.sendMessage(jid, { text: `${top('DIVÓRCIO')}\n┃ Tu nem estás com ninguém... 😅\n${fim}` }, { quoted: msg });
    const ex = meu.parceiro;
    delete db[eu]; delete db[ex]; save(db);
    return sock.sendMessage(jid, { text: `${top('FIM...')}\n┃ @${eu.split('@')[0]} e @${ex.split('@')[0]} terminaram...\n${fim}`, mentions: [eu, ex] }, { quoted: msg });
  }

  return sock.sendMessage(jid, { text: `${top('FAMÍLIA')}\n┃ 『${p}namorar @pessoa』\n┃ 『${p}aceitar』 / 『${p}recusar』\n┃ 『${p}casar』\n┃ 『${p}filho [nome]』\n┃ 『${p}familia』\n┃ 『${p}divorcio』\n${fim}` }, { quoted: msg });
};
