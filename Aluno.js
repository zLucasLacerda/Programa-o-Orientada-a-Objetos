class Aluno {
    nome;
    #nota1;
    #nota2;
    #nota3;

    constructor(nome, nota1, nota2, nota3) {
        this.nome = nome;
        this.nota1 = nota1;
        this.nota2 = nota2;
        this.nota3 = nota3;
    }

    static #validar(valor, rotulo) {
        // valueAsNumber devolve NaN quando o campo está vazio
        if (typeof valor !== "number" || Number.isNaN(valor) || valor < 0 || valor > 10) {
            throw new Error(`Valor de ${rotulo} inválido! Use um número entre 0 e 10.`);
        }
        return valor;
    }

    get nota1() { return this.#nota1; }
    set nota1(value) { this.#nota1 = Aluno.#validar(value, "nota1"); }

    get nota2() { return this.#nota2; }
    set nota2(value) { this.#nota2 = Aluno.#validar(value, "nota2"); }

    get nota3() { return this.#nota3; }
    set nota3(value) { this.#nota3 = Aluno.#validar(value, "nota3"); }

    get media() {
        return (this.#nota1 + this.#nota2 + this.#nota3) / 3;
    }

    get estado() {
        const m = this.media;
        if (m >= 6) return "Aprovado";
        if (m >= 4) return "Recuperação";
        return "Reprovado";
    }
}
