// JOGO MATAMATA - PACK ALPHA 🐺
const fs = require('fs');
const path = './matamata.json';
let jogos = new Map();
let ranking = {};
try { if(fs.existsSync(path)) ranking = JSON.parse(fs.readFileSync(path)); } catch {}

const EMOJIS = [
  { e: '🍎', nome: ['maca','maçã'] },
  { e: '🍌', nome: ['banana'] },
  { e: '🍇', nome: ['uva'] },
  { e: '🍓', nome: ['morango'] },
  { e: '🍊', nome: ['laranja'] },
  { e: '🍋', nome: ['limao','limão'] },
  { e: '🍉', nome: ['melancia'] },
  { e: '🍍', nome: ['abacaxi','ananas','ananás'] },
  { e: '🥭', nome: ['manga'] },
  { e: '🍑', nome: ['pessego','pêssego'] },
  { e: '🍒', nome: ['cereja'] },
  { e: '🥝', nome: ['kiwi'] },
  { e: '🥥', nome: ['coco'] },
  { e: '🍅', nome: ['tomate'] },
  { e: '🥕', nome: ['cenoura'] },
  { e: '🌽', nome: ['milho'] },
  { e: '🥔', nome: ['batata'] },
  { e: '🍆', nome: ['beringela','berinjela'] },
  { e: '🥒', nome: ['pepino'] },
  { e: '🍞', nome: ['pao','pão'] },
  { e: '🧀', nome: ['queijo'] },
  { e: '🍕', nome: ['pizza'] },
  { e: '🍔', nome: ['hamburguer','hambúrguer'] },
  { e: '🍟', nome: ['batata frita','fritas'] },
  { e: '🌭', nome: ['cachorro quente','hotdog'] },
  { e: '🍿', nome: ['pipoca'] },
  { e: '🍩', nome: ['donut','rosquinha'] },
  { e: '🍪', nome: ['bolacha','biscoito'] },
  { e: '🍫', nome: ['chocolate'] },
  { e: '🍰', nome: ['bolo'] },
  { e: '🍦', nome: ['gelado','sorvete'] },
  { e: '🍭', nome: ['chupa','pirulito'] },
  { e: '🍬', nome: ['doce','rebuçado'] },
  { e: '☕', nome: ['cafe','café'] },
  { e: '🥤', nome: ['sumo','suco','refrigerante'] },
  { e: '🍺', nome: ['cerveja'] },
  { e: '🍷', nome: ['vinho'] },
  { e: '🐺', nome: ['lobo'] },
  { e: '🐱', nome: ['gato'] },
  { e: '🐶', nome: ['cao','cão','cachorro'] },
  { e: '🦁', nome: ['leao','leão'] },
  { e: '🐯', nome: ['tigre'] },
  { e: '🐍', nome: ['cobra'] },
  { e: '🐸', nome: ['sapo','ra'] },
  { e: '🐵', nome: ['macaco'] },
  { e: '🐷', nome: ['porco'] },
  { e: '🐮', nome: ['vaca'] },
  { e: '🐔', nome: ['galinha'] },
  { e: '🦆', nome: ['pato'] },
  { e: '🦅', nome: ['aguia','águia'] },
  { e: '🦉', nome: ['coruja'] },
  { e: '🦋', nome: ['borboleta'] },
  { e: '🐝', nome: ['abelha'] },
  { e: '🐜', nome: ['formiga'] },
  { e: '🕷️', nome: ['aranha'] },
  { e: '🐢', nome: ['tartaruga'] },
  { e: '🐙', nome: ['polvo'] },
  { e: '🦈', nome: ['tubarao','tubarão'] },
  { e: '🐬', nome: ['golfinho'] },
  { e: '🐳', nome: ['baleia'] },
  { e: '🦄', nome: ['unicornio','unicórnio'] },
  { e: '🐲', nome: ['dragao','dragão'] },
  { e: '🐴', nome: ['cavalo'] },
  { e: '🦒', nome: ['girafa'] },
  { e: '🐘', nome: ['elefante'] },
  { e: '🦘', nome: ['canguru'] },
  { e: '🐼', nome: ['panda'] },
  { e: '🐨', nome: ['coala'] },
  { e: '⚽', nome: ['bola','futebol'] },
  { e: '🏀', nome: ['basquete','basquetebol'] },
  { e: '🎾', nome: ['tenis','ténis'] },
  { e: '🏐', nome: ['volei','vôlei'] },
  { e: '🎱', nome: ['bilhar','sinuca'] },
  { e: '🎲', nome: ['dado'] },
  { e: '🎯', nome: ['alvo','dardo'] },
  { e: '🎮', nome: ['jogo','game','videojogo'] },
  { e: '🎸', nome: ['guitarra','viola'] },
  { e: '🎤', nome: ['microfone','mic'] },
  { e: '🎧', nome: ['fone','auscultadores','headset'] },
  { e: '📱', nome: ['telemovel','celular','telefone'] },
  { e: '💻', nome: ['computador','pc','laptop'] },
  { e: '⌚', nome: ['relogio','relógio'] },
  { e: '👑', nome: ['coroa','rei'] },
  { e: '💎', nome: ['diamante'] },
  { e: '💍', nome: ['anel','alianca','aliança'] },
  { e: '👓', nome: ['oculos','óculos'] },
  { e: '👟', nome: ['tenis','ténis','sapatilha'] },
  { e: '👗', nome: ['vestido'] },
  { e: '👒', nome: ['chapeu','chapéu'] },
  { e: '🧢', nome: ['bone','chapeu','chapéu'] },
  { e: '👜', nome: ['mala','bolsa'] },
  { e: '🔥', nome: ['fogo'] },
  { e: '💧', nome: ['agua','água','gota'] },
  { e: '❄️', nome: ['neve','gelo','frio'] },
  { e: '⚡', nome: ['raio','trovão','relampago'] },
  { e: '🌙', nome: ['lua'] },
  { e: '☀️', nome: ['sol'] },
  { e: '⭐', nome: ['estrela'] },
  { e: '🌈', nome: ['arco iris','arco-íris'] },
  { e: '🌊', nome: ['mar','onda','agua','água'] },
  { e: '🌋', nome: ['vulcao','vulcão'] },
  { e: '🌹', nome: ['rosa','flor'] },
  { e: '🌻', nome: ['girassol'] },
  { e: '🌵', nome: ['cacto'] },
  { e: '🍀', nome: ['trevo','sorte'] },
  { e: '🚗', nome: ['carro'] },
  { e: '🚲', nome: ['bicicleta','bike'] },
  { e: '✈️', nome: ['aviao','avião'] },
  { e: '🚀', nome: ['foguete','foguetao'] },
  { e: '🚢', nome: ['barco','navio'] },
  { e: '🏠', nome: ['casa'] },
  { e: '🏫', nome: ['escola'] },
  { e: '🏥', nome: ['hospital'] },
  { e: '💰', nome: ['dinheiro'] },
  { e: '💊', nome: ['remedio','remédio','comprimido'] },
  { e: '🔫', nome: ['arma','pistola'] },
  { e: '🔪', nome: ['faca'] },
  { e: '🧸', nome: ['urso','peluche','pelucia'] },
  { e: '🎁', nome: ['presente','prenda'] },
  { e: '🎈', nome: ['balao','balão'] },
];

function salvar() { fs.writeFileSync(path, JSON.stringify(ranking)); }
function coracao(vidas) {
  let t = '';
  for(let i=0;i<4;i++) t += i < vidas ? '❤️' : '💔';
  return t;
}
function mostrarJogadores(jogo) {
  return [...jogo.jogadores.values()].map(j => `@${j.id.split('@')[0]} ${coracao(j.vidas)} ${j.morto ? '💀 MORTO' : ''}`).join('\n');
}

async function novaRodada(sock, jid, jogo) {
  const pick = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
  jogo.emojiAtual = pick;
  jogo.podeMatar = null;
  jogo.aguardandoMatar = false;
  await sock.sendMessage(jid, { text: `🎯 *RODADA MATAMATA!*\n\nQual é o nome disso?\n\n${pick.e} ${pick.e} ${pick.e}\n\n*Quem falar PRIMEIRO ganha o tiro!* 🔫\nFala o nome no chat!` });
}

module.exports = {
  async handler(sock, msg, texto, remetente) {
    const jid = msg.key.remoteJid;
    const jogo = jogos.get(jid);
    if(!jogo) return;
    const low = texto.toLowerCase().trim();
    if(low === 'up' && jogo.fase === 'lobby') {
      if(jogo.jogadores.has(remetente)) return;
      jogo.jogadores.set(remetente, { id: remetente, vidas: 4, morto: false });
      await sock.sendMessage(jid, { text: `✅ @${remetente.split('@')[0]} ENTROU!\n❤️❤️❤️❤️\nJogadores: ${jogo.jogadores.size}\n\nQuem quiser entrar diz *up* marcando o bot!`, mentions: [remetente] });
      return;
    }
    if(jogo.fase === 'jogando' && jogo.emojiAtual && !jogo.aguardandoMatar) {
      const jogador = jogo.jogadores.get(remetente);
      if(!jogador || jogador.morto) return;
      if(jogo.emojiAtual.nome.includes(low)) {
        jogo.podeMatar = remetente;
        jogo.aguardandoMatar = true;
        await sock.sendMessage(jid, { text: `⚡ *@${remetente.split('@')[0]} FOI O MAIS RÁPIDO!*\n\nEmoji era: ${jogo.emojiAtual.e} = *${jogo.emojiAtual.nome[0]}*\n\nAgora tu podes matar!\nUsa: *€matar @pessoa*\nTens 30s!`, mentions: [remetente] });
        setTimeout(async () => {
          if(jogo.aguardandoMatar && jogo.podeMatar === remetente) {
            jogo.aguardandoMatar = false; jogo.podeMatar = null;
            await sock.sendMessage(jid, { text: `⏰ @${remetente.split('@')[0]} perdeu a vez! Ninguém morreu.` , mentions: [remetente] });
            if(jogos.get(jid)) novaRodada(sock, jid, jogo);
          }
        }, 30000);
      }
      return;
    }
  },
  async comando(sock, msg, remetente, args, comando) {
    const jid = msg.key.remoteJid;
    if(comando === 'rankingmatamata') {
      let txt = `👑 *RANKING MATAMATA - REIS* 👑\n\n`;
      const lista = Object.entries(ranking).sort((a,b)=>b[1]-a[1]).slice(0,10);
      if(!lista.length) txt += 'Ninguém ganhou ainda!\nJoga €matamata pra ser o primeiro rei!';
      else lista.forEach(([id,v,i]) => { txt += `${i===0?'👑':'🥇'} @${id.split('@')[0]} - ${v} vitória(s)\n`; });
      return sock.sendMessage(jid, { text: txt, mentions: Object.keys(ranking) }, { quoted: msg });
    }
    if(comando === 'matamata') {
      if(jogos.has(jid)) return sock.sendMessage(jid, { text: '⚠️ Já tem um jogo aqui! Diz *up* pra entrar!' }, { quoted: msg });
      jogos.set(jid, { criador: remetente, fase: 'lobby', jogadores: new Map([[remetente, { id: remetente, vidas: 4, morto: false }]]), emojiAtual: null, podeMatar: null });
      return sock.sendMessage(jid, { text: `🎮 *BORA UM JOGO DE MATAMATA!* 🎮\n\nQuem quiser jogar é só *marcar o bot e dizer UP*\n\n👑 Criador: @${remetente.split('@')[0]}\n❤️ Cada um tem: ❤️❤️❤️❤️\n\nJogadores:\n@${remetente.split('@')[0]} ❤️❤️❤️❤️\n\nQuando todos entrarem, o criador diz *€comecar*`, mentions: [remetente] }, { quoted: msg });
    }
    if(comando === 'comecar') {
      const jogo = jogos.get(jid);
      if(!jogo) return sock.sendMessage(jid, { text: 'Nenhum jogo! Usa €matamata' }, { quoted: msg });
      if(remetente !== jogo.criador) return sock.sendMessage(jid, { text: `⛔ Só quem criou pode começar! É @${jogo.criador.split('@')[0]}` , mentions: [jogo.criador] }, { quoted: msg });
      if(jogo.jogadores.size < 2) return sock.sendMessage(jid, { text: 'Precisa de no mínimo 2 jogadores! Chama mais gente com *up*' }, { quoted: msg });
      jogo.fase = 'jogando';
      await sock.sendMessage(jid, { text: `🔥 *COMEÇOU O MATAMATA!* 🔥\n\n${mostrarJogadores(jogo)}\n\nBoa sorte!` , mentions: [...jogo.jogadores.keys()] });
      return novaRodada(sock, jid, jogo);
    }
    if(comando === 'matar') {
      const jogo = jogos.get(jid);
      if(!jogo || jogo.fase !== 'jogando') return sock.sendMessage(jid, { text: 'Nenhum jogo rolando!' }, { quoted: msg });
      if(jogo.podeMatar !== remetente) return sock.sendMessage(jid, { text: '⛔ Não é a tua vez de matar! Ganha a rodada primeiro!' }, { quoted: msg });
      const alvoId = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0]?.replace('@','')+'@s.whatsapp.net';
      if(!jogo.jogadores.has(alvoId)) return sock.sendMessage(jid, { text: 'Marca alguém que está no jogo!' }, { quoted: msg });
      if(alvoId === remetente) return sock.sendMessage(jid, { text: 'Não podes te matar, burro! 😂' }, { quoted: msg });
      const alvo = jogo.jogadores.get(alvoId);
      if(alvo.morto) return sock.sendMessage(jid, { text: 'Essa pessoa já morreu!' }, { quoted: msg });
      alvo.vidas -= 1;
      jogo.aguardandoMatar = false; jogo.podeMatar = null;
      if(alvo.vidas <= 0) {
        alvo.morto = true;
        await sock.sendMessage(jid, { text: `💀 *BANG!* @${alvoId.split('@')[0]} MORREU!\n\n@${remetente.split('@')[0]} matou!\n\n${mostrarJogadores(jogo)}`, mentions: [alvoId, remetente, ...jogo.jogadores.keys()] });
      } else {
        await sock.sendMessage(jid, { text: `🔫 *BANG!* @${remetente.split('@')[0]} atirou em @${alvoId.split('@')[0]}!\n\nAntes: ❤️❤️❤️❤️\nAgora: ${coracao(alvo.vidas)}\n\n${mostrarJogadores(jogo)}`, mentions: [alvoId, remetente, ...jogo.jogadores.keys()] });
      }
      const vivos = [...jogo.jogadores.values()].filter(j=>!j.morto);
      if(vivos.length === 1) {
        const rei = vivos[0];
        ranking[rei.id] = (ranking[rei.id]||0)+1; salvar();
        await sock.sendMessage(jid, { text: `👑 *FIM DO JOGO!* 👑\n\nO REI DO MATAMATA É:\n\n👑 @${rei.id.split('@')[0]} 👑\n\nVê o ranking: €rankingmatamata`, mentions: [rei.id] });
        jogos.delete(jid);
        return;
      }
      return novaRodada(sock, jid, jogo);
    }
  }
};
