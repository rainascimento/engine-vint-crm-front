
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Lot {
  id: string;
  opportunity_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const mockLotsByOpportunity: { [key: string]: Lot[] } = {
  '1': [
    {
      id: '1',
      opportunity_id: '1',
      name: 'Lote 1 - Software Base',
      description: 'Sistema principal de gestão educacional',
      created_at: '2024-07-15T10:00:00Z',
      updated_at: '2024-07-30T14:30:00Z'
    },
    {
      id: '2',
      opportunity_id: '1',
      name: 'Lote 2 - Módulos Adicionais',
      description: 'Módulos complementares e integrações',
      created_at: '2024-07-15T10:00:00Z',
      updated_at: '2024-07-30T14:30:00Z'
    }
  ],
  '2': [
    {
      id: '3',
      opportunity_id: '2',
      name: 'Lote Único - Equipamentos',
      description: 'Conjunto completo de equipamentos médicos',
      created_at: '2024-07-20T09:15:00Z',
      updated_at: '2024-07-28T16:45:00Z'
    }
  ],
  '3': [
    {
      id: '4',
      opportunity_id: '3',
      name: 'Lote 1 - Hardware',
      description: 'Servidores e equipamentos de rede',
      created_at: '2024-07-25T11:20:00Z',
      updated_at: '2024-07-29T13:10:00Z'
    },
    {
      id: '5',
      opportunity_id: '3',
      name: 'Lote 2 - Software',
      description: 'Licenças e sistemas operacionais',
      created_at: '2024-07-25T11:20:00Z',
      updated_at: '2024-07-29T13:10:00Z'
    }
  ]
};

export const useLots = (opportunityId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: lots = [], isLoading, error } = useQuery({
    queryKey: ['lots', opportunityId],
    queryFn: async () => {
      console.log('Fetching lots for opportunity:', opportunityId);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 400));

      const lots = mockLotsByOpportunity[opportunityId] || [];
      console.log('Fetched lots:', lots);
      return lots;
    },
    enabled: !!user && !!opportunityId,
  });

  const createLot = useMutation({
    mutationFn: async (newLot: Omit<Lot, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating lot:', newLot);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockId = String(Object.values(mockLotsByOpportunity).flat().length + 1);
      const now = new Date().toISOString();
      
      const lot: Lot = {
        ...newLot,
        id: mockId,
        created_at: now,
        updated_at: now,
      };

      // Adicionar à lista mock
      if (!mockLotsByOpportunity[newLot.opportunity_id]) {
        mockLotsByOpportunity[newLot.opportunity_id] = [];
      }
      mockLotsByOpportunity[newLot.opportunity_id].push(lot);

      console.log('Created lot:', lot);
      return lot;
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
    mutationFn: async ({ id, ...updates }: Partial<Lot> & { id: string }) => {
      console.log('Updating lot:', id, updates);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));

      // Simular atualização
      for (const lots of Object.values(mockLotsByOpportunity)) {
        const index = lots.findIndex(lot => lot.id === id);
        if (index !== -1) {
          lots[index] = {
            ...lots[index],
            ...updates,
            updated_at: new Date().toISOString(),
          };
          console.log('Updated lot:', lots[index]);
          return lots[index];
        }
      }

      throw new Error('Lot not found');
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
    mutationFn: async (id: string) => {
      console.log('Deleting lot:', id);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 400));

      // Simular exclusão
      for (const lots of Object.values(mockLotsByOpportunity)) {
        const index = lots.findIndex(lot => lot.id === id);
        if (index !== -1) {
          lots.splice(index, 1);
          console.log('Deleted lot:', id);
          return;
        }
      }

      throw new Error('Lot not found');
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
