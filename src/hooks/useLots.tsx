
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
    mutationFn: async (newLot: Omit<Lot, 'id' | 'created_at' | 'updated_at'>) => {



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

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 400));

      // Simular exclusão
      for (const lots of Object.values(mockLotsByOpportunity)) {
        const index = lots.findIndex(lot => lot.id === id);
        if (index !== -1) {
          lots.splice(index, 1);
  
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
