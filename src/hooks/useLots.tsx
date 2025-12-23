
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export interface Lot {
  id: string;
  opportunity_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type LotCreate = Omit<
  Lot,
  'id' | 'oportunidade_id' | 'nome' | 'descricao' | 'grupo_id'
>;

function unwrapData<T>(res: any): T {
  return (res?.data ?? res) as T;
}
export type LotUpdate = Partial<LotCreate> & { id: string };

export const useLots = (opportunityId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: lots = [], isLoading, error } = useQuery({
    queryKey: ['lots', opportunityId],
    queryFn: async () => {
      

      const lots = await api.get(`/lotes/by-fk/oportunidade_id/${opportunityId}`);


    
      return lots;
    },
    enabled: !!user && !!opportunityId,
  });

  const createLot = useMutation({
  mutationFn: async (payload: LotCreate) => {
      const res = await api.post('/lotes', payload);
      return unwrapData<Lot>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', opportunityId] });
      toast.success('Lote criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in createLot:', error);
      toast.error('Erro ao criar lote');
    },
  });

  const updateLot = useMutation({
    mutationFn: async (payload: LotUpdate) => {
      console.log('Updating lot with id:', payload.id, 'and updates:', payload);
      const res = await api.put(`/lotes/${payload.id}`, payload);
      return unwrapData<Lot>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', opportunityId] });
      toast.success('Lote atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in updateLot:', error);
      toast.error('Erro ao atualizar lote');
    },
  });

  const deleteLot = useMutation({
    mutationFn: async (id: number) => {
      await api.del(`/lotes/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lots', opportunityId] });
      toast.success('Lote excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error in deleteLot:', error);
      toast.error('Erro ao excluir lote');
    },
  });

  return {
    lots,
    isLoading,
    error,
    createLot,
    updateLot,
    deleteLot,
  };
};
