// src/hooks/useOpportunities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { id } from 'date-fns/locale';


export interface Opportunity {
  id: number;
  numero_processo: string;
  objeto: string;
  orgao_id: number;
  modalidade_id: number;
  portal_id?: number | null;
  valor_estimado?: number | null;
  data_abertura: string;             // ISO date string
  data_entrega: string;              // ISO date string
  uasg?: string | null;
  esfera_id?: number | null;
  status_id?: number | null;
  fase_pipeline_id?: number | null;
  created_at?: string;
  updated_at?: string;

  // Se o seu back retornar *joins* opcionais, você pode manter esses campos opcionais:
  orgao?: { id: number; nome: string };
  modalidade?: { id: number; nome: string };
  status_oportunidade?: { id: number; nome: string };
  fase_pipeline?: { id: number; nome: string; sequencia?: number };
}


export type OpportunityCreate = Omit<
  Opportunity,
  'id' | 'created_at' | 'updated_at' | 'orgao' | 'modalidade' | 'status_oportunidade' | 'fase_pipeline'
>;
export type OpportunityUpdate = Partial<OpportunityCreate> & { id: number };


function unwrapData<T>(res: any): T {
  return (res?.data ?? res) as T;
}

export const useOpportunities = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: opportunities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['opportunities'],
    enabled: !!user,
    queryFn: async () => {
      const res = await api.get('/oportunidades');
  
      const rows = unwrapData<any>(res);

      // aceita tanto array direto quanto { data: [...] }
      const list: Opportunity[] = Array.isArray(rows) ? rows : (rows?.data ?? []);
   
      return list;
    },
  });
 
  const createOpportunity = useMutation({
    mutationFn: async (payload: OpportunityCreate) => {
      const res = await api.post('/oportunidades', payload);
      return unwrapData<Opportunity>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade criada com sucesso!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Erro ao criar oportunidade');
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({ id, ...updates }: OpportunityUpdate) => {
      const res = await api.put(`/oportunidades/${id}`, updates);
      return unwrapData<Opportunity>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade atualizada com sucesso!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Erro ao atualizar oportunidade');
    },
  });

  const deleteOpportunity = useMutation({
    mutationFn: async (id: number) => {
      await api.del(`/oportunidades/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade excluída com sucesso!');
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Erro ao excluir oportunidade');
    },
  });



  return {
    opportunities,
    isLoading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  };
};


export const useOportunidade = (id: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['opportunity', id],
    enabled: !!user && !!id,
    queryFn: async () => {

      const res = await api.get(`/oportunidades/${id}`);
      const rawData = unwrapData<any>(res); 

      const entitiesToFetch = [
        api.get(`/orgaos_publicos/${rawData.orgao_id}`),
        api.get(`/modalidades/${rawData.modalidade_id}`),
        api.get(`/esferas_administrativas/${rawData.esfera_id}`),
        api.get(`/status_oportunidade/${rawData.status_id}`),
        api.get(`/fases_pipeline/${rawData.fase_pipeline_id}`),
        api.get(`/setores/${rawData.setor_id}`),
        api.get(`/portais_compra/${rawData.portal_id}`),
        api.get(`/mercados/${rawData.mercado_id}`),
      ];

      const [
        orgaoRes, modalidadeRes, esferaRes, statusRes, 
        faseRes, setorRes, portalRes, mercadoRes
      ] = await Promise.all(entitiesToFetch);

      const completBuild = {
        orgao_nome: unwrapData<any>(orgaoRes).nome,
        modalidade_nome: unwrapData<any>(modalidadeRes).nome,
        esfera_nome: unwrapData<any>(esferaRes).nome,
        status_nome: unwrapData<any>(statusRes).nome,
        fase_pipeline_nome: unwrapData<any>(faseRes).nome,
        setor_nome: unwrapData<any>(setorRes).nome,
        portal_nome: unwrapData<any>(portalRes).nome,
        mercado_nome: unwrapData<any>(mercadoRes).nome,
 
        ...rawData, 
      };

   
      return {
        oportunidade: completBuild, 
        opportunityRaw: rawData,    
      };
    },
  
    select: (data) => data,
  });
};