
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export interface Item {
  id: string;
  lote_id: string;
  item_number: number;
  description: string;
  unit?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  specifications?: string;
  created_at?: string;
  updated_at?: string;
}

export type ItemsCreate = Omit<
  Item,
  'id' | 'lote_id' | 'nome' | 'quantidade' | 'unidade_id' | 'valor_unitario'
>;
export type ItemsUpdate = Partial<ItemsCreate> & { id: number };

function unwrapData<T>(res: any): T {
  return (res?.data ?? res) as T;
}
 
export const useItems = (lotIds: []) => {
  const queryClient = useQueryClient();

  // 1. Configuração das múltiplas queries
  const results = useQueries({
    queries: lotIds.map((lotId : any) => ({
      queryKey: ['items', lotId],
      queryFn: async () => {

        const response = await api.get(`/itens/by-fk/lote_id/${lotId}`);
        
        const data = response?.data ?? response;
        return Array.isArray(data) ? data : [];
      },
      
    })),
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const error = results.find((result) => result.error)?.error;

  const items = results
    .filter((result) => result.data)
    .map((result) => result.data)
    .flat();

  const createItem = useMutation({
  mutationFn: async (payload: ItemsCreate) => {
      const res = await api.post('/itens', payload);
      return unwrapData<Item>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotIds] });
      toast.success('Item criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in createItem:', error);
      toast.error('Erro ao criar item');
    },
  });

  const updateItem = useMutation({
    mutationFn: async (payload: ItemsUpdate) => {
      console.log('Updating item with id:', payload.id, 'and updates:', payload);
      const res = await api.put(`/itens/${payload.id}`, payload);
      return unwrapData<Item>(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotIds] });
      toast.success('Item atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in updateItem:', error);
      toast.error('Erro ao atualizar item');
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: number) => {
      await api.del(`/itens/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotIds] });
      toast.success('Item excluído com sucesso!');
    },
    onError: (error) => {
      console.error('Error in deleteItem:', error);
      toast.error('Erro ao excluir item');
    },
  });

  return {
    items,
    isLoading,
    error,
    results,
    createItem,
    updateItem,
   deleteItem,
  };
};
