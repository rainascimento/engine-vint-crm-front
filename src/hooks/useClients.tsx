
import { useQuery } from "@tanstack/react-query";

export interface Cliente {
  id: number;
  nome: string;
  logo_url: string | null;
  cnpj: string | null;
  email_contato: string | null;
  telefone_contato: string | null;
  endereco: string | null;
  status_cliente: string | null;
  data_criacao: string | null;
  data_ultima_interacao: string | null;
}

const mockClientes: Cliente[] = [
  {
    id: 1,
    nome: "Empresa ABC Ltda",
    logo_url: null,
    cnpj: "12.345.678/0001-90",
    email_contato: "contato@empresaabc.com.br",
    telefone_contato: "(11) 99999-9999",
    endereco: "Rua das Flores, 123, São Paulo - SP",
    status_cliente: "Ativo",
    data_criacao: "2024-01-15",
    data_ultima_interacao: "2024-07-30"
  },
  {
    id: 2,
    nome: "Tech Solutions Ltda",
    logo_url: null,
    cnpj: "98.765.432/0001-10",
    email_contato: "vendas@techsolutions.com.br",
    telefone_contato: "(21) 88888-8888",
    endereco: "Av. Paulista, 1000, São Paulo - SP",
    status_cliente: "Ativo",
    data_criacao: "2024-02-20",
    data_ultima_interacao: "2024-07-28"
  },
  {
    id: 3,
    nome: "Inovação Digital S.A.",
    logo_url: null,
    cnpj: "11.222.333/0001-44",
    email_contato: "comercial@inovacaodigital.com.br",
    telefone_contato: "(11) 77777-7777",
    endereco: "Rua da Inovação, 456, Rio de Janeiro - RJ",
    status_cliente: "Prospecto",
    data_criacao: "2024-03-10",
    data_ultima_interacao: "2024-07-25"
  }
];

export const useClients = () => {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {

      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));


      return mockClientes;
    },
  });
};
