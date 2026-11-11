// ANTI-SPAM COM IMUNIDADE ALPHA
const users = new Map();
const bloqueados = new Map();
const imunes = new Set(); // quem tem imunidade
const gruposAntispam = new Map(); // grupo -> true/false, padrão = true (ligado)

// ===== LIGA / DESLIGA POR GRUPO - ISSO QUE FALTAVA =====
function isAntispamAtivo(grupoId) {
  if (!grupoId) return true;
  if (!gruposAntispam.has(grupoId)) return true;
  return gruposAntispam.get(grupoId);
}

function ativarAntispam(grupoId) {
  if (grupoId) gruposAntispam.set(grupoId, true);
  return true;
}

function desativarAntispam(grupoId) {
  if (grupoId) gruposAntispam.set(grupoId, false);
  return false;
}

function toggleAntispam(grupoId) {
  const atual = isAntispamAtivo(grupoId);
  if (atual) {
    desativarAntispam(grupoId);
    return false;
  } else {
    ativarAntispam(grupoId);
    return true;
  }
}

function podeUsarBot(sender, config, isDono) {
  const agora = Date.now();

  // DONO É SEMPRE IMUNE
  if(isDono) return true;

  // QUEM TU DESTE IMUNIDADE TAMBÉM É IMUNE
  if(imunes.has(sender)) return true;

  if(bloqueados.has(sender)) {
    if(agora - bloqueados.get(sender) < 30000) return false;
    bloqueados.delete(sender);
    users.delete(sender);
  }

  if(!users.has(sender)) users.set(sender, []);
  let lista = users.get(sender).filter(t => agora - t < 10000);
  lista.push(agora);
  users.set(sender, lista);

  if(lista.length > 4) {
    bloqueados.set(sender, agora);
    return 'SPAM';
  }
  return true;
}

function darImunidade(sender) { imunes.add(sender); }
function tirarImunidade(sender) { imunes.delete(sender); }
function temImunidade(sender) { return imunes.has(sender); }
function listarImunes() { return [...imunes]; }

module.exports = { 
  podeUsarBot, 
  darImunidade, 
  tirarImunidade, 
  temImunidade, 
  listarImunes,
  isAntispamAtivo,
  ativarAntispam,
  desativarAntispam,
  toggleAntispam
};
