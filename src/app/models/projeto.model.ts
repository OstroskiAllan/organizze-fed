export interface Projeto {
    id?: number;
    nome: string;
    descricao: string;
    dataCriacao?: Date;
    dataInicio: Date;
    dataFim: Date | null;
  }
  