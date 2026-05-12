const apiUrl = '/api/transacoes';
let graficoPizza = null;
let transacoesGlobais = [];
let modalEdicaoInstancia = null;

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#1a1d29',
  color: '#fff',
  iconColor: '#ccff00',
});

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    valor
  );
const formatarData = (dataStr) => {
  const [a, m, d] = dataStr.split('-');
  return `${d}/${m}/${a}`;
};

function mudarAba(abaId, elementoClicado) {
  document.querySelectorAll('.aba-conteudo').forEach((aba) => {
    aba.classList.remove('d-block');
    aba.classList.add('d-none');
  });
  document.getElementById(`aba-${abaId}`).classList.remove('d-none');
  document.getElementById(`aba-${abaId}`).classList.add('d-block');
  document
    .querySelectorAll('.nav-btn')
    .forEach((link) => link.classList.remove('active'));
  elementoClicado.classList.add('active');
}

// Renderizador Mestre: Atualiza a tela baseando-se no Array Global
function renderizarTelaGeral() {
  const container = document.getElementById('listaTransacoes');
  container.innerHTML = '';

  let saldo = 0,
    receitas = 0,
    despesas = 0;
  const categoriasMap = {};

  if (transacoesGlobais.length === 0) {
    container.innerHTML = `<div class="text-center p-5"><i class="fa-solid fa-receipt fs-1 text-light-gray opacity-50 mb-3"></i><h5 class="text-white">Nenhuma transação ainda.</h5></div>`;
  }

  transacoesGlobais.forEach((t) => {
    const val = parseFloat(t.valor);
    const isReceita = t.tipo === 'receita';

    if (isReceita) {
      receitas += val;
      saldo += val;
    } else {
      despesas += val;
      saldo -= val;
      categoriasMap[t.categoria] = (categoriasMap[t.categoria] || 0) + val;
    }

    const icone = isReceita ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
    const corClass = isReceita ? 'text-lime' : 'text-danger';
    const bgClass = isReceita ? 'bg-lime-subtle' : 'bg-danger-subtle';
    const sinal = isReceita ? '+' : '-';

    container.innerHTML += `
            <div class="transaction-card flex-column flex-md-row gap-3">
                <div class="d-flex align-items-center gap-3 w-100">
                    <div class="tx-icon-circle ${bgClass} ${corClass}">
                        <i class="fa-solid ${icone}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="text-white fw-bold mb-1">${t.categoria}</h6>
                        <div class="d-flex gap-2 align-items-center">
                            <span class="badge rounded-pill bg-dark border border-secondary text-light-gray fw-normal" style="font-size: 0.7rem;">${formatarData(
                              t.data_transacao
                            )}</span>
                            <small class="text-light-gray">${
                              t.descricao
                            }</small>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-between w-100 mt-2 mt-md-0" style="max-width: 250px;">
                    <h5 class="m-0 fw-bolder ${corClass}">${sinal} ${formatarMoeda(
      val
    )}</h5>
                    <div class="d-flex gap-2">
                        <button class="btn-action edit" onclick="abrirEdicao(${
                          t.id
                        })"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-action delete" onclick="excluirTransacao(${
                          t.id
                        })"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
  });

  document.getElementById('saldoTotal').textContent = formatarMoeda(saldo);
  document.getElementById('receitasTotal').textContent =
    formatarMoeda(receitas);
  document.getElementById('despesasTotal').textContent =
    formatarMoeda(despesas);

  atualizarGraficos(categoriasMap, receitas, despesas);
}

function atualizarGraficos(categoriasMap, receitas, despesas) {
  const labels = Object.keys(categoriasMap);
  const data = Object.values(categoriasMap);

  const ctx = document.getElementById('graficoGastos').getContext('2d');
  if (graficoPizza) graficoPizza.destroy();

  graficoPizza = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#ccff00',
            '#ff2a5f',
            '#00e5ff',
            '#b5179e',
            '#fca311',
          ],
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#8b95a5',
            font: { family: 'Plus Jakarta Sans', size: 13 },
          },
        },
      },
      cutout: '75%',
    },
  });

  let porcentagem =
    receitas > 0 ? (despesas / receitas) * 100 : despesas > 0 ? 100 : 0;
  porcentagem = Math.min(porcentagem, 100).toFixed(0);

  document.getElementById('ritmoBarra').style.width = `${porcentagem}%`;
  document.getElementById('ritmoTexto').textContent = `${porcentagem}%`;
  const barra = document.getElementById('ritmoBarra');
  if (porcentagem < 50)
    barra.className =
      'progress-bar bg-lime progress-bar-striped progress-bar-animated';
  else if (porcentagem < 80)
    barra.className =
      'progress-bar bg-warning progress-bar-striped progress-bar-animated';
  else
    barra.className =
      'progress-bar bg-danger progress-bar-striped progress-bar-animated';

  const topCatContainer = document.getElementById('topCategoriasLista');
  topCatContainer.innerHTML = '';
  const categoriasOrd = Object.keys(categoriasMap)
    .map((c) => ({ nome: c, valor: categoriasMap[c] }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 3);

  if (categoriasOrd.length === 0) {
    topCatContainer.innerHTML =
      '<div class="text-center text-light-gray py-3"><i class="fa-solid fa-box-open fs-2 mb-2 opacity-50"></i><p class="m-0">Sem gastos registrados.</p></div>';
  } else {
    categoriasOrd.forEach((cat) => {
      topCatContainer.innerHTML += `
                <div class="d-flex justify-content-between align-items-center p-3 rounded-4" style="background: rgba(255,255,255,0.02);">
                    <span class="text-white fw-semibold">${cat.nome}</span>
                    <span class="text-white fw-bolder">${formatarMoeda(
                      cat.valor
                    )}</span>
                </div>
            `;
    });
  }
}

// BUCAR DADOS (SÓ RODA 1 VEZ AO ENTRAR)
async function carregarDadosDoServidor() {
  try {
    const response = await fetch(`${apiUrl}?_t=${Date.now()}`);
    transacoesGlobais = await response.json();
    renderizarTelaGeral();
  } catch (error) {
    console.error(error);
  }
}

// SALVAR NOVO
document
  .getElementById('formTransacao')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
      tipo: document.getElementById('tipo').value,
      categoria: document.getElementById('categoria').value,
      descricao: document.getElementById('descricao').value,
      valor: document.getElementById('valor').value,
      data_transacao: document.getElementById('data_transacao').value,
    };

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
      if (res.ok) {
        const dataServer = await res.json();
        // Atualiza a tela IMEDIATAMENTE (Sem precisar buscar tudo de novo)
        transacoesGlobais.unshift({ id: dataServer.id, ...dados });
        renderizarTelaGeral();

        document.getElementById('formTransacao').reset();
        Toast.fire({ icon: 'success', title: 'Registrado com sucesso!' });
        mudarAba('transacoes', document.querySelectorAll('.nav-btn')[2]);
      }
    } catch (error) {
      console.error(error);
    }
  });

// EXCLUIR (UX Otimista - Exclui da tela no mesmo segundo)
window.excluirTransacao = async function (id) {
  const result = await Swal.fire({
    title: 'Excluir registro?',
    text: 'Essa ação não pode ser desfeita.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff2a5f',
    cancelButtonColor: '#2d3748',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
  });

  if (result.isConfirmed) {
    // Tira o item do Array Global instantaneamente
    transacoesGlobais = transacoesGlobais.filter((t) => t.id !== id);
    renderizarTelaGeral(); // A tela é redesenhada sem o item imediatamente
    Toast.fire({ icon: 'success', title: 'Excluído!' });

    // Avisa o servidor silenciosamente
    try {
      fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(error);
    }
  }
};

// ABRIR EDIÇÃO
window.abrirEdicao = function (id) {
  const t = transacoesGlobais.find((x) => x.id === id);
  if (t) {
    document.getElementById('edit_id').value = t.id;
    document.getElementById('edit_tipo').value = t.tipo;
    document.getElementById('edit_categoria').value = t.categoria;
    document.getElementById('edit_descricao').value = t.descricao;
    document.getElementById('edit_valor').value = parseFloat(t.valor);
    document.getElementById('edit_data_transacao').value = t.data_transacao;
    modalEdicaoInstancia.show();
  }
};

// SALVAR EDIÇÃO (UX Otimista - Edita na tela no mesmo segundo)
window.salvarEdicao = async function () {
  const id = parseInt(document.getElementById('edit_id').value);
  const dados = {
    tipo: document.getElementById('edit_tipo').value,
    categoria: document.getElementById('edit_categoria').value,
    descricao: document.getElementById('edit_descricao').value,
    valor: document.getElementById('edit_valor').value,
    data_transacao: document.getElementById('edit_data_transacao').value,
  };

  // Altera o Array Global instantaneamente
  const index = transacoesGlobais.findIndex((t) => t.id === id);
  if (index !== -1) {
    transacoesGlobais[index] = { id: id, ...dados };
    renderizarTelaGeral(); // A tela reflete a mudança de receita/despesa IMEDIATAMENTE
  }

  modalEdicaoInstancia.hide();
  Toast.fire({ icon: 'success', title: 'Registro atualizado!' });

  // Avisa o servidor silenciosamente
  try {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  modalEdicaoInstancia = new bootstrap.Modal(
    document.getElementById('modalEdicao')
  );
  carregarDadosDoServidor();
});
