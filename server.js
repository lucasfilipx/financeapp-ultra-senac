const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let transacoes = [];
let proximoId = 1;

app.get('/api/transacoes', (req, res) => {
    // Retorna a lista sempre ordenada do mais novo pro mais antigo
    res.json(transacoes);
});

app.post('/api/transacoes', (req, res) => {
    const { tipo, categoria, valor, descricao, data_transacao } = req.body;
    
    const novaTransacao = {
        id: proximoId++,
        tipo,
        categoria,
        valor: parseFloat(valor),
        descricao,
        data_transacao
    };
    
    transacoes.unshift(novaTransacao);
    res.status(201).json({ mensagem: 'Sucesso!', id: novaTransacao.id });
});

app.put('/api/transacoes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = transacoes.findIndex(t => t.id === id);
    
    if (index !== -1) {
        transacoes[index] = {
            id: id,
            tipo: req.body.tipo,
            categoria: req.body.categoria,
            valor: parseFloat(req.body.valor),
            descricao: req.body.descricao,
            data_transacao: req.body.data_transacao
        };
        res.json({ mensagem: 'Atualizado com sucesso!' });
    } else {
        res.status(404).json({ erro: 'Transação não encontrada' });
    }
});

app.delete('/api/transacoes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    transacoes = transacoes.filter(t => t.id !== id);
    res.json({ mensagem: 'Excluído com sucesso!' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});