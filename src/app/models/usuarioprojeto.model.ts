export interface UsuarioProjeto{
    usuarioId: number
    projetoId: number
    cargo: string
    nome?: string;  // Adiciona a propriedade nome

    projeto: {
        nome: string;
        descricao: string;
      };
    usuario: {
      nome: string;
      email: string;
    };
}