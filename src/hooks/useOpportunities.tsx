
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  organ: string;
  bidding_number?: string;
  bidding_type?: string;
  execution_mode?: string;
  estimated_value?: number;
  publication_date?: string;
  deadline_date?: string;
  opening_date?: string;
  status: string;
  created_by?: string;
  assigned_to?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Sistema de Gestão Educacional',
    description: 'Contratação de sistema integrado para gestão educacional',
    organ: 'Ministério da Educação',
    bidding_number: '23000.000001/2024-11',
    bidding_type: 'pregao_eletronico',
    execution_mode: 'menor_preco',
    estimated_value: 850000,
    publication_date: '2024-08-01',
    deadline_date: '2024-09-30',
    opening_date: '2024-08-15',
    status: 'analise_tecnica',
    created_by: 'mock-user-id',
    assigned_to: 'mock-user-id',
    category: 'tecnologia',
    tags: ['TI', 'Educação'],
    notes: 'Oportunidade estratégica para o setor educacional',
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-30T14:30:00Z'
  },
  {
    id: '2',
    title: 'Equipamentos Médicos Hospitalares',
    description: 'Aquisição de equipamentos médicos para hospitais públicos',
    organ: 'Ministério da Saúde',
    bidding_number: '25000.000002/2024-22',
    bidding_type: 'concorrencia',
    execution_mode: 'melhor_tecnica',
    estimated_value: 1200000,
    publication_date: '2024-08-05',
    deadline_date: '2024-10-15',
    opening_date: '2024-08-20',
    status: 'parecer',
    created_by: 'mock-user-id',
    assigned_to: 'mock-user-id',
    category: 'saude',
    tags: ['Saúde', 'Equipamentos'],
    notes: 'Alto valor estratégico para portfólio de saúde',
    created_at: '2024-07-20T09:15:00Z',
    updated_at: '2024-07-28T16:45:00Z'
  },
  {
    id: '3',
    title: 'Infraestrutura Tecnológica Municipal',
    description: 'Modernização da infraestrutura de TI da prefeitura',
    organ: 'Prefeitura de São Paulo',
    bidding_number: '31000.000003/2024-33',
    bidding_type: 'pregao_eletronico',
    execution_mode: 'menor_preco',
    estimated_value: 950000,
    publication_date: '2024-08-10',
    deadline_date: '2024-11-10',
    opening_date: '2024-08-25',
    status: 'identificacao',
    created_by: 'mock-user-id',
    assigned_to: 'mock-user-id',
    category: 'tecnologia',
    tags: ['TI', 'Municipal'],
    notes: 'Oportunidade de expansão no mercado municipal',
    created_at: '2024-07-25T11:20:00Z',
    updated_at: '2024-07-29T13:10:00Z'
  }
];

export const useOpportunities = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      console.log('Fetching opportunities...');
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 600));

      console.log('Fetched opportunities:', mockOpportunities);
      return mockOpportunities;
    },
    enabled: !!user,
  });

  const createOpportunity = useMutation({
    mutationFn: async (newOpportunity: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating opportunity:', newOpportunity);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockId = String(mockOpportunities.length + 1);
      const now = new Date().toISOString();
      
      const opportunity: Opportunity = {
        ...newOpportunity,
        id: mockId,
        created_at: now,
        updated_at: now,
      };

      // Adicionar à lista mock (simulação)
      mockOpportunities.push(opportunity);

      console.log('Created opportunity:', opportunity);
      return opportunity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error in createOpportunity:', error);
      toast.error('Erro ao criar oportunidade');
    },
  });

  const updateOpportunity = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Opportunity> & { id: string }) => {
      console.log('Updating opportunity:', id, updates);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simular atualização
      const index = mockOpportunities.findIndex(opp => opp.id === id);
      if (index !== -1) {
        mockOpportunities[index] = {
          ...mockOpportunities[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
      }

      console.log('Updated opportunity:', mockOpportunities[index]);
      return mockOpportunities[index];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error in updateOpportunity:', error);
      toast.error('Erro ao atualizar oportunidade');
    },
  });

  const deleteOpportunity = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting opportunity:', id);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simular exclusão
      const index = mockOpportunities.findIndex(opp => opp.id === id);
      if (index !== -1) {
        mockOpportunities.splice(index, 1);
      }

      console.log('Deleted opportunity:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Oportunidade excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Error in deleteOpportunity:', error);
      toast.error('Erro ao excluir oportunidade');
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

// Função auxiliar para mapear fase do pipeline para status
function getStatusFromPipeline(faseId: number): string {
  const statusMap: { [key: number]: string } = {
    1: 'identificacao',
    2: 'analise_tecnica',
    3: 'parecer',
    4: 'proposta',
    5: 'em_andamento',
  };
  return statusMap[faseId] || 'identificacao';
}

export const useOpportunity = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['opportunity', id],
    queryFn: async () => {
      console.log('Fetching opportunity:', id);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 400));

      const opportunity = mockOpportunities.find(opp => opp.id === id);
      
      if (!opportunity) {
        throw new Error('Opportunity not found');
      }

      console.log('Fetched opportunity:', opportunity);
      return opportunity;
    },
    enabled: !!user && !!id,
  });
};
