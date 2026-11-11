class Interface {
    static #turmas = [];

    //Navegação entre abas
    static mostrarAba(nome) {
        for (const aba of ["turmas", "alunos", "lista"]) {
            document.getElementById(`painel-${aba}`).classList.toggle("ativo", aba === nome);
            document.getElementById(`aba-${aba}`).classList.toggle("ativo", aba === nome);
        }
        if (nome === "lista") Interface.listarAlunos();
    }

    //Turmas
    static cadastrarTurma() {
        try {
            const professor = document.getElementById("turma-professor").value;
            const curso = document.getElementById("turma-curso").value;
            Interface.#turmas.push(new Turma(professor, curso));

            document.getElementById("turma-professor").value = "";
            document.getElementById("turma-curso").value = "";
            Interface.#atualizarTurmas();
        } catch (e) {
            alert(e.message);
        }
    }

    static #atualizarTurmas() {
        //Lista de turmas cadastradas
        const ul = document.getElementById("lista-turmas");
        ul.innerHTML = "";
        Interface.#turmas.forEach((t) => {
            const li = document.createElement("li");
            li.textContent = `${t.nomeCurso} — Prof. ${t.professor} (${t.alunos.length} aluno(s))`;
            ul.appendChild(li);
        });

        // Selects de turma (aba Alunos e aba Lista)
        for (const id of ["aluno-turma", "lista-turma"]) {
            const select = document.getElementById(id);
            const anterior = select.value;
            select.innerHTML = "";
            Interface.#turmas.forEach((t, i) => {
                const op = document.createElement("option");
                op.value = i;
                op.textContent = `${t.nomeCurso} (${t.professor})`;
                select.appendChild(op);
            });
            if (anterior !== "" && Number(anterior) < Interface.#turmas.length) select.value = anterior;
        }

        const semTurma = Interface.#turmas.length === 0;
        document.getElementById("aviso-sem-turma").hidden = !semTurma;
        document.getElementById("btn-salvar-aluno").disabled = semTurma;
    }

    //Alunos
    static cadastrarAluno() {
        try {
            if (Interface.#turmas.length === 0) {
                throw new Error("Cadastre uma turma antes de cadastrar alunos.");
            }
            const turma = Interface.#turmas[Number(document.getElementById("aluno-turma").value)];
            const nome = document.getElementById("nome").value.trim();
            if (!nome) throw new Error("Informe o nome do aluno.");

            const n1 = document.getElementById("nota1").valueAsNumber;
            const n2 = document.getElementById("nota2").valueAsNumber;
            const n3 = document.getElementById("nota3").valueAsNumber;

            turma.adicionarAluno(new Aluno(nome, n1, n2, n3));

            for (const id of ["nome", "nota1", "nota2", "nota3"]) document.getElementById(id).value = "";
            Interface.#atualizarTurmas();
            alert(`${nome} cadastrado em ${turma.nomeCurso}.`);
        } catch (e) {
            alert(e.message);
        }
    }

    // Exibição e edição
    static listarAlunos() {
        const area = document.getElementById("lista-alunos");
        area.innerHTML = "";

        const indice = document.getElementById("lista-turma").value;
        if (indice === "" || !Interface.#turmas[Number(indice)]) {
            area.textContent = "Cadastre uma turma para ver os alunos.";
            return;
        }
        const turma = Interface.#turmas[Number(indice)];

        if (turma.alunos.length === 0) {
            area.textContent = "Nenhum aluno nesta turma ainda.";
            return;
        }

        const tabela = document.createElement("table");
        const cab = tabela.insertRow();
        for (const titulo of ["Nome", "Nota 1", "Nota 2", "Nota 3", "Média", "Situação", ""]) {
            const th = document.createElement("th");
            th.textContent = titulo;
            cab.appendChild(th);
        }

        turma.alunos.forEach((aluno, i) => {
            const linha = tabela.insertRow();
            linha.insertCell().textContent = aluno.nome;

            const inputs = [];
            for (const campo of ["nota1", "nota2", "nota3"]) {
                const input = document.createElement("input");
                input.type = "number";
                input.min = 0;
                input.max = 10;
                input.step = 0.1;
                input.value = aluno[campo];
                inputs.push(input);
                linha.insertCell().appendChild(input);
            }

            linha.insertCell().textContent = aluno.media.toFixed(2);
            const celulaEstado = linha.insertCell();
            celulaEstado.textContent = aluno.estado;
            celulaEstado.className = "estado-" + aluno.estado
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            const btn = document.createElement("button");
            btn.textContent = "Salvar notas";
            btn.onclick = () => Interface.editarNotas(turma, i, inputs);
            linha.insertCell().appendChild(btn);
        });

        area.appendChild(tabela);
    }

    static editarNotas(turma, indiceAluno, inputs) {
        const aluno = turma.alunos[indiceAluno];
        //Guarda os valores antigos para desfazer se alguma nota for inválida
        const antigas = [aluno.nota1, aluno.nota2, aluno.nota3];
        try {
            aluno.nota1 = inputs[0].valueAsNumber;
            aluno.nota2 = inputs[1].valueAsNumber;
            aluno.nota3 = inputs[2].valueAsNumber;
        } catch (e) {
            [aluno.nota1, aluno.nota2, aluno.nota3] = antigas;
            alert(e.message);
        }
        Interface.listarAlunos();
    }
}
