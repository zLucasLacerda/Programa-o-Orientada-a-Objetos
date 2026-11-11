class Turma {
    #professor;
    #nomeCurso;
    #alunos = [];

    constructor(professor, nomeCurso) {
        if (!professor || !professor.trim()) throw new Error("Informe o nome do professor.");
        if (!nomeCurso || !nomeCurso.trim()) throw new Error("Informe o nome do curso.");
        this.#professor = professor.trim();
        this.#nomeCurso = nomeCurso.trim();
    }

    get professor() { return this.#professor; }
    get nomeCurso() { return this.#nomeCurso; }
    get alunos() { return this.#alunos; }

    adicionarAluno(aluno) {
        if (!(aluno instanceof Aluno)) throw new Error("Só é possível adicionar objetos do tipo Aluno.");
        this.#alunos.push(aluno);
    }
}
