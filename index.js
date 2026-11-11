const fs = require('fs');
const config = require('./config');
const matamata = require('./matamata');

// ANTI-SPAM SEGURO - Se o arquivo não existir, o bot continua a funcionar
let podeUsarBot = () => true;
try { podeUsarBot = require('./utils/antispamBot').podeUsarBot; } catch(e) { console.log('[ANTI-SPAM] Arquivo não encontrado, bot vai rodar sem anti-spam'); }

const qrcode = './qr-code';

// CORREÇÃO LID - igual ao handler.js - COM O TEU NÚMERO NOVO!
function isDonoCheck(id){
  if(!id) return false;
  const s = String(id);
  if(s.includes('234033556488308')) return true; // TEU LID
  if(s.includes('244941548791')) return true; // TEU NÚMERO ATUAL
  if(s.includes('941548791')) return true; // final do teu número
  const nums = s.replace(/\D/g,'').slice(-9);
  return nums === '958566636' || nums === '941548791' || s.includes('244958566636');
}

function pegarTexto(m){
  if(!m) return '';
  const base = m.ephemeralMessage?.message || m.viewOnceMessage?.message || m.viewOnceMessageV2?.message || m;
  return base.conversation || base.extendedTextMessage?.text || base.imageMessage?.caption || base.videoMessage?.caption || '';
}

async function start() {
  try {
    const baileys = await import('@whiskeysockets/baileys');
    const makeWASocket = baileys.default || baileys.makeWASocket;
    const { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, Browsers } = baileys;
    const NodeCache = (await import('node-cache')).default;
    const pino = (await import('pino')).default;
    const logger = pino({ level: 'silent' });
    const msgRetryCounterCache = new NodeCache();
    if (!makeWASocket) throw new Error('makeWASocket não encontrado no Baileys.');
    if (!fs.existsSync(qrcode)) fs.mkdirSync(qrcode, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(qrcode);
    const { version } = await fetchLatestBaileysVersion();
    const sock = makeWASocket({
      logger, version, browser: Browsers.ubuntu('Chrome'),
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
      msgRetryCounterCache, markOnlineOnConnect: true, syncFullHistory: false, getMessage: async () => undefined
    });
    const handler = require('./lib/handler.js');
    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      console.log(`[EVENTO] ${type} - ${messages.length} msg`);
      if (type !== 'notify') return;
      for (const msg of messages) {
        if (msg.key.fromMe) continue;
        try {
          console.log(`[RAW] ${msg.key.remoteJid} | participant=${msg.key.participant} | participantAlt=${msg.key.participantAlt}`);

          const textoMsg = pegarTexto(msg.message);
          const sender = msg.key.participant || msg.key.remoteJid;

          // ===== MATAMATA - TEM QUE FICAR ANTES DO ANTI-SPAM E DO HANDLER =====
          // 1. Handler do jogo (ouve "up" + resposta do emoji) - não tem €
          await matamata.handler(sock, msg, textoMsg, sender);

          // 2. Comandos do jogo com €
          const lowMatamata = textoMsg.toLowerCase().trim();
          if (lowMatamata.startsWith('€matamata') || lowMatamata.startsWith('€comecar') || lowMatamata.startsWith('€matar') || lowMatamata.startsWith('€rankingmatamata')) {
            const partes = textoMsg.slice(1).trim().split(/\s+/);
            const comando = partes[0].toLowerCase();
            const args = partes.slice(1);
            await matamata.comando(sock, msg, sender, args, comando);
            continue; // não passa para o handler normal
          }
          // ===== FIM MATAMATA =====

          // ===== ANTI-SPAM DO BOT + IMUNIDADE - CORRIGIDO COM LID =====
          const isComando = textoMsg.startsWith(config.prefixo || '€');

          if (isComando) {
            // CORRIGIDO: testa LID + número + participantAlt
            const isDono = isDonoCheck(sender) || isDonoCheck(msg.key.remoteJid) || isDonoCheck(msg.key.participantAlt);
            console.log(`[DONO?] sender=${sender} | isDono=${isDono} | texto=${textoMsg}`);

            // Dono nunca é bloqueado
            if (!isDono) {
              let check = podeUsarBot(sender, config, isDono);

              if (check === 'SPAM') {
                await sock.sendMessage(msg.key.remoteJid, {
                  text: `🛑 @${sender.split('@')[0]} CALMA LOUCO! 🐺\n\nUsaste comando demais! Ficas de castigo 30 segundos sem bot.\n\nRespira...`,
                  mentions: [sender]
                }, { quoted: msg });
                continue;
              }
              if (check === false) {
                console.log(`[ANTI-SPAM] ${sender} bloqueado 30s`);
                continue;
              }
            }
          }
          // ===== FIM ANTI-SPAM =====

          await handler({ sock, msg, config });
        } catch (error) { console.error('Erro no handler:', error); }
      }
    });

    sock.ev.on('group-participants.update', async (update) => {
      try{
        const bemvindo = require('./comandos/adm/bemvindo');
        if(!bemvindo.isAtivo(update.id)) return;
        if(update.action === 'add'){
          const meta = await sock.groupMetadata(update.id);
          for(let user of update.participants){
            let ppUrl;
            try{ ppUrl = await sock.profilePictureUrl(user, 'image'); }catch{ ppUrl = 'https://i.imgur.com/2wzGhpM.png'; }
            // ===== NOVO ESTILO BEM-VINDO - PACK ALPHA =====
            const texto = `╭══〘  BEM-VINDO 〙══╮
┃╭═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╮
┃𓆩ꨄ𓆪 Novo Lobo: @${user.split('@')[0]}
┃𓆩ꨄ𓆪 Grupo: 『${meta.subject}』
┃𓆩ꨄ𓆪 Você é o nº 『${meta.participants.length}』
┃╰═════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═════╯
┗════════  𓆩ꨄ𓆪  ════════┛

┏════〘 REGRAS 〙════┓
┃𓆩ꨄ𓆪 Sem link
┃𓆩ꨄ𓆪 Sem porn / spam
┃𓆩ꨄ𓆪 Respeita todo mundo
┗═══ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ═══┛

𓆩ꨄ𓆪 Digita 『€regras』 pra ler tudo
𓆩ꨄ𓆪 Digita 『€menu』 pra ver meus comandos

𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪 ════ 𓆩ꨄ𓆪

╰════〘 PACK BOT 〙════╯
╰════ ✧･ﾟ𓆩ꨄ𓆪･ﾟ✧ ════╯
𓆩ꨄ𓆪 ENTRA COM TUDO, LENDÁRIO(A)!`;
            await sock.sendMessage(update.id, { image: { url: ppUrl }, caption: texto, mentions: [user] });
          }
        }
      }catch(e){ console.log('[BEMVINDO ERRO]', e.message) }
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'connecting') console.log('🔄 PACK ALPHA - BOT está a conectar...');
      if (connection === 'open') console.log('🐺 PACK ALPHA - BOT ONLINE COM SUCESSO!');
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        console.log('⚠️ Conexão encerrada:', code);
        if (code !== 401) { console.log('🔄 A tentar reconectar...'); setTimeout(start, 5000); }
        else console.log('Sessão encerrada. É necessário ligar novamente.');
      }
    });

    if (!state.creds.registered) {
      const numero = config.numeroBot;
      console.log('📱 A preparar código de ligação...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        const code = await sock.requestPairingCode(numero);
        console.log('\n==============================');
        console.log('🐺 PACK ALPHA - BOT');
        console.log('CÓDIGO:', code);
        console.log('==============================\n');
      } catch (error) { console.error('Erro ao gerar código:', error.message); }
    }
  } catch (error) { console.error('❌ ERRO AO INICIAR PACK ALPHA - BOT:', error); }
}
start();
