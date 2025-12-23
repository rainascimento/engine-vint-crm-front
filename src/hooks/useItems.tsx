
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export interface Item {
  id: string;
  lot_id: string;
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
    mutationFn: async (newItem: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));

      const mockId = String(Object.values(mockItemsByLot).flat().length + 1);
      const now = new Date().toISOString();
      
      const item: Item = {
        ...newItem,
        id: mockId,
        total_price: (newItem.quantity || 0) * (newItem.unit_price || 0),
        created_at: now,
        updated_at: now,
      };

      // Adicionar à lista mock
      if (!mockItemsByLot[newItem.lot_id]) {
        mockItemsByLot[newItem.lot_id] = [];
      }
      mockItemsByLot[newItem.lot_id].push(item);

      return item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotId] });
      toast.success('Item criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in createItem:', error);
      toast.error('Erro ao criar item');
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Item> & { id: string }) => {

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simular atualização
      for (const items of Object.values(mockItemsByLot)) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = {
            ...items[index],
            ...updates,
            total_price: (updates.quantity ?? items[index].quantity ?? 0) * (updates.unit_price ?? items[index].unit_price ?? 0),
            updated_at: new Date().toISOString(),
          };

          return items[index];
        }
      }

      throw new Error('Item not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotId] });
      toast.success('Item atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error in updateItem:', error);
      toast.error('Erro ao atualizar item');
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {

      await new Promise(resolve => setTimeout(resolve, 300));

      // Simular exclusão
      for (const items of Object.values(mockItemsByLot)) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items.splice(index, 1);

          return;
        }
      }

      throw new Error('Item not found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items', lotId] });
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
    //createItem,
    //updateItem,
   // deleteItem,
  };
};
