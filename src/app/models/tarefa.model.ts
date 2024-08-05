export interface Tarefa {
    id?: number;
    nome: string;
    observacoes: string;
    dataCriacao?: Date;
    dataEntrega?: Date;
    projetoId?: number;
    statusId: number;
    usuarioId?: number;
  }
  

