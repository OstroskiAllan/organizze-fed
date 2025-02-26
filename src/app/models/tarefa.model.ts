export interface Tarefa {
    id?: number;
    nome: string;
    observacoes: string;
    dataCriacao?: any | null;
    dataEntrega?: any| null;
    projetoId?: number;
    statusId: number;
    usuarioId?: number;
    nomeUsuario?: any;
  }
  

