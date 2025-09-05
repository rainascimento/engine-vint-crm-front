// src/hooks/useOpportunities.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';


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
      console.log('Raw opportunities response:', res);
      const rows = unwrapData<any>(res);
      console.log('Unwrapped opportunities data:', rows);
      // aceita tanto array direto quanto { data: [...] }
      const list: Opportunity[] = Array.isArray(rows) ? rows : (rows?.data ?? []);
      console.log('Final opportunities list:', list);
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
      await api.delete(`/oportunidades/${id}`);
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

  console.log('useOpportunities - opportunities:', opportunities);

  return {
    opportunities,
    isLoading,
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
  };
};

export const useOpportunity = (id: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['opportunity', id],
    enabled: !!user && !!id,
    queryFn: async () => {
      const res = await api.get(`/oportunidades/${id}`);
      return unwrapData<Opportunity>(res);
    },
  });
};
