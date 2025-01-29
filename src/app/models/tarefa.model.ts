export interface Tarefa {
    id?: number;
    nome: string;
    observacoes: string;
    dataCriacao?: Date;
    dataEntrega?: Date| null;
    projetoId?: number;
    statusId: number;
    usuarioId?: number;
    nomeUsuario?: any;
  }
  

