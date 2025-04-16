class Funcionario {
    constructor(id, nome, idade, cargo, salario) {
        this._id = id;
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
    }

    // Getters
    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    get idade() {
        return this._idade;
    }

    get cargo() {
        return this._cargo;
    }

    get salario() {
        return this._salario;
    }

    // Setters
    set nome(novoNome) {
        this._nome = novoNome;
    }

    set idade(novaIdade) {
        this._idade = novaIdade;
    }

    set cargo(novoCargo) {
        this._cargo = novoCargo;
    }

    set salario(novoSalario) {
        this._salario = novoSalario;
    }

    toString() {
        return `ID: ${this._id}, Nome: ${this._nome}, Idade: ${this._idade}, Cargo: ${this._cargo}, Salário: R$ ${this._salario.toFixed(2)}`;
    }
}

// Variáveis globais
let funcionarios = [];
let proximoId = 1;
let editando = false;

// Elementos do DOM
const form = document.getElementById('funcionarioForm');
const tabela = document.getElementById('tabelaFuncionarios').getElementsByTagName('tbody')[0];
const btnCadastrar = document.getElementById('btnCadastrar');
const btnCancelar = document.getElementById('btnCancelar');
const relatorioResultado = document.getElementById('relatorioResultado');

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('idFuncionario').value;
    const nome = document.getElementById('nome').value;
    const idade = parseInt(document.getElementById('idade').value);
    const cargo = document.getElementById('cargo').value;
    const salario = parseFloat(document.getElementById('salario').value);

    if (editando) {
        // Atualizar funcionário existente
        const funcionario = funcionarios.find(f => f.id == id);
        if (funcionario) {
            funcionario.nome = nome;
            funcionario.idade = idade;
            funcionario.cargo = cargo;
            funcionario.salario = salario;
        }
    } else {
        // Adicionar novo funcionário
        const novoFuncionario = new Funcionario(proximoId++, nome, idade, cargo, salario);
        funcionarios.push(novoFuncionario);
    }

    atualizarTabela();
    form.reset();
    editando = false;
    btnCadastrar.textContent = 'Cadastrar';
    btnCancelar.style.display = 'none';
    document.getElementById('idFuncionario').value = '';
});

btnCancelar.addEventListener('click', () => {
    form.reset();
    editando = false;
    btnCadastrar.textContent = 'Cadastrar';
    btnCancelar.style.display = 'none';
    document.getElementById('idFuncionario').value = '';
});

// Botões de relatório
document.getElementById('btnSalarioMaior5k').addEventListener('click', () => {
    const funcionariosFiltrados = funcionarios.filter(f => f.salario > 5000);
    exibirRelatorio('Funcionários com salário maior que R$5.000:', funcionariosFiltrados);
});

document.getElementById('btnMediaSalarial').addEventListener('click', () => {
    if (funcionarios.length === 0) {
        relatorioResultado.innerHTML = 'Nenhum funcionário cadastrado para calcular a média salarial.';
        return;
    }
    
    const totalSalarios = funcionarios.reduce((acc, f) => acc + f.salario, 0);
    const media = totalSalarios / funcionarios.length;
    relatorioResultado.innerHTML = `Média salarial: R$ ${media.toFixed(2)}`;
});

document.getElementById('btnCargosUnicos').addEventListener('click', () => {
    const cargosUnicos = [...new Set(funcionarios.map(f => f.cargo))];
    exibirRelatorio('Cargos únicos:', cargosUnicos);
});

document.getElementById('btnNomesMaiusculo').addEventListener('click', () => {
    const nomesMaiusculos = funcionarios.map(f => f.nome.toUpperCase());
    exibirRelatorio('Nomes em maiúsculo:', nomesMaiusculos);
});

// Funções auxiliares
function atualizarTabela() {
    tabela.innerHTML = '';
    
    funcionarios.forEach(funcionario => {
        const row = tabela.insertRow();
        
        row.insertCell(0).textContent = funcionario.id;
        row.insertCell(1).textContent = funcionario.nome;
        row.insertCell(2).textContent = funcionario.idade;
        row.insertCell(3).textContent = funcionario.cargo;
        row.insertCell(4).textContent = `R$ ${funcionario.salario.toFixed(2)}`;
        
        const acoesCell = row.insertCell(5);
        acoesCell.className = 'acoes';
        
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-editar';
        btnEditar.onclick = () => editarFuncionario(funcionario.id);
        
        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.className = 'btn-excluir';
        btnExcluir.onclick = () => excluirFuncionario(funcionario.id);
        
        acoesCell.appendChild(btnEditar);
        acoesCell.appendChild(btnExcluir);
    });
}

function editarFuncionario(id) {
    const funcionario = funcionarios.find(f => f.id == id);
    if (funcionario) {
        document.getElementById('idFuncionario').value = funcionario.id;
        document.getElementById('nome').value = funcionario.nome;
        document.getElementById('idade').value = funcionario.idade;
        document.getElementById('cargo').value = funcionario.cargo;
        document.getElementById('salario').value = funcionario.salario;
        
        editando = true;
        btnCadastrar.textContent = 'Atualizar';
        btnCancelar.style.display = 'inline-block';
    }
}

function excluirFuncionario(id) {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
        funcionarios = funcionarios.filter(f => f.id != id);
        atualizarTabela();
    }
}

function exibirRelatorio(titulo, dados) {
    if (Array.isArray(dados)) {
        if (dados.length === 0) {
            relatorioResultado.innerHTML = `${titulo}<br>Nenhum dado encontrado.`;
            return;
        }
        
        let html = `<strong>${titulo}</strong><ul>`;
        dados.forEach(item => {
            if (typeof item === 'object') {
                html += `<li>${item.toString()}</li>`;
            } else {
                html += `<li>${item}</li>`;
            }
        });
        html += '</ul>';
        relatorioResultado.innerHTML = html;
    } else {
        relatorioResultado.innerHTML = dados;
    }
}