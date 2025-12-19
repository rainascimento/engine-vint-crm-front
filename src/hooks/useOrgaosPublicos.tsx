/*
import { useQuery } from "@tanstack/react-query";

export interface OrgaoPublico {
  id: number;
  nome: string;
  sigla: string;
  logo_orgao: string | null;
  cnpj: string;
  email_institucional: string;
  site_oficial: string | null;
  esfera_adm_id: number;
  status_orgao_id: number;
  tipo_orgao_id: number;
  oportunidades_count: number;
  projetos_count: number;
  valor_total_oportunidades: number;
}

const mockOrgaosPublicos: OrgaoPublico[] = [
  {
    id: 1,
    nome: "Ministério da Educação",
    sigla: "MEC",
    logo_orgao: null,
    cnpj: "00.394.445/0001-07",
    email_institucional: "contato@mec.gov.br",
    site_oficial: "https://www.gov.br/mec/pt-br",
    esfera_adm_id: 1,
    status_orgao_id: 1,
    tipo_orgao_id: 1,
    oportunidades_count: 15,
    projetos_count: 8,
    valor_total_oportunidades: 2500000
  },
  {
    id: 2,
    nome: "Ministério da Saúde",
    sigla: "MS",
    logo_orgao: null,
    cnpj: "25.351.920/0001-58",
    email_institucional: "contato@saude.gov.br",
    site_oficial: "https://www.gov.br/saude/pt-br",
    esfera_adm_id: 1,
    status_orgao_id: 1,
    tipo_orgao_id: 1,
    oportunidades_count: 22,
    projetos_count: 12,
    valor_total_oportunidades: 5800000
  },
  {
    id: 3,
    nome: "Prefeitura de São Paulo",
    sigla: "PMSP",
    logo_orgao: null,
    cnpj: "46.395.000/0001-39",
    email_institucional: "contato@prefeitura.sp.gov.br",
    site_oficial: "https://www.capital.sp.gov.br/",
    esfera_adm_id: 3,
    status_orgao_id: 1,
    tipo_orgao_id: 2,
    oportunidades_count: 18,
    projetos_count: 9,
    valor_total_oportunidades: 3200000
  }
];

export const useOrgaosPublicos = () => {
  return useQuery({
    queryKey: ["orgaos-publicos"],
    queryFn: async () => {

      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));

  
      return mockOrgaosPublicos;
    },
  });
};

const mockOportunidadesPorOrgao: { [key: number]: any[] } = {
  1: [
    {
      id: 1,
      numero_processo: "23000.000001/2024-11",
      objeto: "Contratação de sistema de gestão educacional",
      data_abertura: "2024-08-15",
      data_entrega: "2024-09-30",
      uf: "DF",
      uasg: "154080",
      modalidades: { nome: "Pregão Eletrônico" },
      status_oportunidade: { nome: "Publicado" },
      fases_pipeline: { nome: "Análise Técnica" },
      valor_total: 850000
    }
  ],
  2: [
    {
      id: 2,
      numero_processo: "25000.000002/2024-22",
      objeto: "Aquisição de equipamentos médicos",
      data_abertura: "2024-08-20",
      data_entrega: "2024-10-15",
      uf: "DF",
      uasg: "251003",
      modalidades: { nome: "Concorrência" },
      status_oportunidade: { nome: "Publicado" },
      fases_pipeline: { nome: "Parecer" },
      valor_total: 1200000
    }
  ],
  3: [
    {
      id: 3,
      numero_processo: "31000.000003/2024-33",
      objeto: "Modernização da infraestrutura tecnológica",
      data_abertura: "2024-08-25",
      data_entrega: "2024-11-10",
      uf: "SP",
      uasg: "925503",
      modalidades: { nome: "Pregão Eletrônico" },
      status_oportunidade: { nome: "Publicado" },
      fases_pipeline: { nome: "Identificação" },
      valor_total: 950000
    }
  ]
};*/

export const useOrgaoOportunidades = (orgaoId: number) => {
  return useQuery({
    queryKey: ["orgao-oportunidades", orgaoId],
    queryFn: async () => {
 
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));

      const oportunidades = mockOportunidadesPorOrgao[orgaoId] || [];
  
      return oportunidades;
    },
    enabled: !!orgaoId,
  });
};


import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface OrgaoPublico {
  id: number;
  nome: string;
  sigla: string;
  cnpj: string;
  esfera_adm_id: number;
  tipo_orgao_id: number;
  email_institucional: string;
  telefone_geral?: string | null;
  site_oficial?: string | null;
  status_orgao_id: number;
  // junte aqui mais campos se seu back retornar
}

export function useOrgaosPublicos() {
  return useQuery({
    queryKey: ["orgaos_publicos"],
    queryFn: async () => api.get<OrgaoPublico[]>("/orgaos_publicos"),
    staleTime: 30_000,
  });
}