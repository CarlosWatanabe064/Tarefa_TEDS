class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = parseFloat(notaFinal);
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        return `Nome: ${this.nome}, Idade: ${this.idade}, Curso: ${this.curso}, Nota: ${this.notaFinal}, Status: ${this.isAprovado() ? 'Aprovado' : 'Reprovado'}`;
    }
}

// Array para armazenar os alunos
let alunos = [];
let editandoIndex = null;

// Elementos do DOM
const form = document.getElementById('alunoForm');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const cadastrarBtn = document.getElementById('cadastrarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');
const resultadoRelatorios = document.getElementById('resultadoRelatorios');

// Event Listeners
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const curso = document.getElementById('curso').value;
    const notaFinal = document.getElementById('notaFinal').value;
    
    if (editandoIndex !== null) {
        // Editar aluno existente
        alunos[editandoIndex] = new Aluno(nome, idade, curso, notaFinal);
        alert('Aluno editado com sucesso!');
        editandoIndex = null;
        cadastrarBtn.textContent = 'Cadastrar';
        cancelarBtn.style.display = 'none';
    } else {
        // Adicionar novo aluno
        const aluno = new Aluno(nome, idade, curso, notaFinal);
        alunos.push(aluno);
        alert('Aluno cadastrado com sucesso!');
    }
    
    form.reset();
    atualizarTabela();
});

cancelarBtn.addEventListener('click', () => {
    form.reset();
    editandoIndex = null;
    cadastrarBtn.textContent = 'Cadastrar';
    cancelarBtn.style.display = 'none';
});

// Botões de relatórios
document.getElementById('aprovadosBtn').addEventListener('click', mostrarAprovados);
document.getElementById('mediaNotasBtn').addEventListener('click', mostrarMediaNotas);
document.getElementById('mediaIdadesBtn').addEventListener('click', mostrarMediaIdades);
document.getElementById('ordemAlfabeticaBtn').addEventListener('click', mostrarOrdemAlfabetica);
document.getElementById('alunosPorCursoBtn').addEventListener('click', mostrarAlunosPorCurso);

// Função para atualizar a tabela
function atualizarTabela() {
    tabelaCorpo.innerHTML = '';
    
    alunos.forEach((aluno, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal.toFixed(1)}</td>
            <td class="${aluno.isAprovado() ? 'aprovado' : 'reprovado'}">
                ${aluno.isAprovado() ? 'Aprovado' : 'Reprovado'}
            </td>
            <td>
                <button class="acao-btn editar-btn" data-index="${index}">Editar</button>
                <button class="acao-btn excluir-btn" data-index="${index}">Excluir</button>
            </td>
        `;
        
        tabelaCorpo.appendChild(row);
    });
    
    // Adicionar eventos aos botões de editar e excluir
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editarAluno(index);
        });
    });
    
    document.querySelectorAll('.excluir-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (confirm('Tem certeza que deseja excluir este aluno?')) {
                excluirAluno(index);
            }
        });
    });
}

// Função para editar aluno
function editarAluno(index) {
    const aluno = alunos[index];
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade;
    document.getElementById('curso').value = aluno.curso;
    document.getElementById('notaFinal').value = aluno.notaFinal;
    
    editandoIndex = index;
    cadastrarBtn.textContent = 'Salvar Edição';
    cancelarBtn.style.display = 'inline-block';
}

// Função para excluir aluno
function excluirAluno(index) {
    alunos.splice(index, 1);
    atualizarTabela();
    alert('Aluno excluído com sucesso!');
}

// Funções de relatórios
function mostrarAprovados() {
    const aprovados = alunos.filter(aluno => aluno.isAprovado());
    
    if (aprovados.length === 0) {
        resultadoRelatorios.innerHTML = '<p>Nenhum aluno aprovado encontrado.</p>';
        return;
    }
    
    let html = '<h3>Alunos Aprovados</h3><ul>';
    aprovados.forEach(aluno => {
        html += `<li>${aluno.nome} - ${aluno.curso} (Nota: ${aluno.notaFinal.toFixed(1)})</li>`;
    });
    html += '</ul>';
    
    resultadoRelatorios.innerHTML = html;
}

function mostrarMediaNotas() {
    if (alunos.length === 0) {
        resultadoRelatorios.innerHTML = '<p>Nenhum aluno cadastrado para calcular a média.</p>';
        return;
    }
    
    const total = alunos.reduce((sum, aluno) => sum + aluno.notaFinal, 0);
    const media = total / alunos.length;
    
    resultadoRelatorios.innerHTML = `<p>A média das notas finais é: <strong>${media.toFixed(2)}</strong></p>`;
}

function mostrarMediaIdades() {
    if (alunos.length === 0) {
        resultadoRelatorios.innerHTML = '<p>Nenhum aluno cadastrado para calcular a média.</p>';
        return;
    }
    
    const total = alunos.reduce((sum, aluno) => sum + parseInt(aluno.idade), 0);
    const media = total / alunos.length;
    
    resultadoRelatorios.innerHTML = `<p>A média das idades é: <strong>${media.toFixed(1)} anos</strong></p>`;
}

function mostrarOrdemAlfabetica() {
    if (alunos.length === 0) {
        resultadoRelatorios.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
        return;
    }
    
    const ordenados = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome));
    
    let html = '<h3>Alunos em Ordem Alfabética</h3><ul>';
    ordenados.forEach(aluno => {
        html += `<li>${aluno.nome} - ${aluno.curso}</li>`;
    });
    html += '</ul>';
    
    resultadoRelatorios.innerHTML = html;
}

function mostrarAlunosPorCurso() {
    if (alunos.length === 0) {
        resultadoRelatorios.innerHTML = '<p>Nenhum aluno cadastrado.</p>';
        return;
    }
    
    const porCurso = alunos.reduce((acc, aluno) => {
        if (!acc[aluno.curso]) {
            acc[aluno.curso] = 0;
        }
        acc[aluno.curso]++;
        return acc;
    }, {});
    
    let html = '<h3>Quantidade de Alunos por Curso</h3><ul>';
    for (const curso in porCurso) {
        html += `<li>${curso}: ${porCurso[curso]} aluno(s)</li>`;
    }
    html += '</ul>';
    
    resultadoRelatorios.innerHTML = html;
}

// Inicializar tabela
atualizarTabela();