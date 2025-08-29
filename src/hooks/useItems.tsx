
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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

const mockItemsByLot: { [key: string]: Item[] } = {
  '1': [
    {
      id: '1',
      lot_id: '1',
      item_number: 1,
      description: 'Licença de software de gestão escolar',
      unit: 'UN',
      quantity: 500,
      unit_price: 120.00,
      total_price: 60000.00,
      specifications: 'Software completo para gestão acadêmica',
      created_at: '2024-07-15T10:00:00Z',
      updated_at: '2024-07-30T14:30:00Z'
    },
    {
      id: '2',
      lot_id: '1',
      item_number: 2,
      description: 'Suporte técnico anual',
      unit: 'SV',
      quantity: 1,
      unit_price: 15000.00,
      total_price: 15000.00,
      specifications: 'Suporte 24x7 durante 12 meses',
      created_at: '2024-07-15T10:00:00Z',
      updated_at: '2024-07-30T14:30:00Z'
    }
  ],
  '2': [
    {
      id: '3',
      lot_id: '2',
      item_number: 1,
      description: 'Módulo de biblioteca digital',
      unit: 'UN',
      quantity: 100,
      unit_price: 80.00,
      total_price: 8000.00,
      specifications: 'Sistema de gerenciamento de biblioteca',
      created_at: '2024-07-15T10:00:00Z',
      updated_at: '2024-07-30T14:30:00Z'
    }
  ]
};

export const useItems = (lotId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['items', lotId],
    queryFn: async () => {
      console.log('Fetching items for lot:', lotId);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 300));

      const items = mockItemsByLot[lotId] || [];
      console.log('Fetched items:', items);
      return items;
    },
    enabled: !!user && !!lotId,
  });

  const createItem = useMutation({
    mutationFn: async (newItem: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating item:', newItem);
      
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

      console.log('Created item:', item);
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
      console.log('Updating item:', id, updates);
      
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
          console.log('Updated item:', items[index]);
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
      console.log('Deleting item:', id);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 300));

      // Simular exclusão
      for (const items of Object.values(mockItemsByLot)) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items.splice(index, 1);
          console.log('Deleted item:', id);
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
    createItem,
    updateItem,
    deleteItem,
  };
};
