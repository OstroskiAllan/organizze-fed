export interface UsuarioProjeto{
    usuarioId?: number
    projetoId: number
    cargo: string
    projeto: {
        nome: string;
        descricao: string;
      };
}