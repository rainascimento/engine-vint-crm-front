import { useState, useCallback } from 'react';

// Mock data for all parameter entities
const mockParametersData = {

  esferas_administrativas: [
    { id: 1, nome: 'Federal' },
    { id: 2, nome: 'Estadual' },
    { id: 3, nome: 'Municipal' }
  ],
  tipos_orgao: [
    { id: 1, nome: 'Ministério' },
    { id: 2, nome: 'Autarquia' },
    { id: 3, nome: 'Empresa Pública' },
    { id: 4, nome: 'Prefeitura' }
  ],
  status_orgao: [
    { id: 1, nome: 'Ativo' },
    { id: 2, nome: 'Inativo' },
    { id: 3, nome: 'Suspenso' }
  ],
  modalidades: [
    { id: 1, nome: 'Pregão Eletrônico' },
    { id: 2, nome: 'Pregão Presencial' },
    { id: 3, nome: 'Concorrência' },
    { id: 4, nome: 'Tomada de Preços' }
  ],

  mercados: [
    { id: 1, nome: 'Governo Federal' },
    { id: 2, nome: 'Governo Estadual' },
    { id: 3, nome: 'Governo Municipal' }
  ],
  setores: [
    { id: 1, nome: 'Saúde' },
    { id: 2, nome: 'Educação' },
    { id: 3, nome: 'Segurança' },
    { id: 4, nome: 'Infraestrutura' }
  ]
  
  
 

};

export type ParameterEntity = keyof typeof mockParametersData;

export interface Parameter {
  id: number;
  nome?: string;
  url?: string;
  sigla?: string;
  descricao?: string;
}

export const useParameters = () => {
  const [data, setData] = useState(mockParametersData);
  const [isLoading, setIsLoading] = useState(false);

  const getParameters = useCallback((entity: ParameterEntity) => {
    return data[entity] || [];
  }, [data]);

  const createParameter = useCallback(async (entity: ParameterEntity, parameter: Omit<Parameter, 'id'>) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(...data[entity].map(p => p.id), 0) + 1;
    const newParameter = { id: newId, ...parameter };
    
    setData(prev => ({
      ...prev,
      [entity]: [...prev[entity], newParameter]
    }));
    
    setIsLoading(false);
    return newParameter;
  }, [data]);

  const updateParameter = useCallback(async (entity: ParameterEntity, id: number, updates: Partial<Parameter>) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setData(prev => ({
      ...prev,
      [entity]: prev[entity].map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
    
    setIsLoading(false);
  }, []);

  const deleteParameter = useCallback(async (entity: ParameterEntity, id: number) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setData(prev => ({
      ...prev,
      [entity]: prev[entity].filter(p => p.id !== id)
    }));
    
    setIsLoading(false);
  }, []);

  return {
    getParameters,
    createParameter,
    updateParameter,
    deleteParameter,
    isLoading
  };
};

export const getEntityDisplayName = (entity: ParameterEntity): string => {
  const displayNames: Record<ParameterEntity, string> = {
    esferas_administrativas: 'Esferas Administrativas',
    tipos_orgao: 'Tipos de Órgão',
    status_orgao: 'Status de Órgão',
    modalidades: 'Modalidades',
    mercados: 'Mercados',
    setores: 'Setores'
  };
  
  return displayNames[entity] || entity;
};

