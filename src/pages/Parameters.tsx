import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ParameterCRUD } from '@/components/ParameterCRUD';
import { getEntityDisplayName, type ParameterEntity2 } from '@/hooks/useParameters';

type ParameterEntity = ParameterEntity2; // Ajuste aqui conforme necessário
const parameterGroups = {
  'Geral': [
    'categorias',
    'esferas_administrativas', 
    'modalidades',
    'mercados',
    'setores',
    'regioes'
  ] as ParameterEntity[],
  'Órgãos': [
    'tipos_orgao',
    'status_orgao',
    'portais_compra'
  ] as ParameterEntity[],
  'Oportunidades': [
    'status_oportunidade',
    'fases_pipeline'
  ] as ParameterEntity[],
  'Pareceres': [
    'decisoes_parecer',
    'tipos_parecer',
    'status_parecer',
    'motivos_parecer'
  ] as ParameterEntity[],
  'Usuários e Permissões': [
    'funcoes',
    'perfis_acesso',
    'status_usuario',
    'permissoes'
  ] as ParameterEntity[],
  'Unidades e Medidas': [
    'unidades'
  ] as ParameterEntity[],
  'Comercial': [
    'tipos_regiao_com',
    'tipos_comercial',
    'tipos_contratacao',
    'tipos_temperatura'
  ] as ParameterEntity[]
};

export default function Parameters() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parâmetros do Sistema</h1>
            <p className="text-muted-foreground">
              Gerencie todos os parâmetros e configurações do sistema
            </p>
          </div>
        </div>

        <Tabs defaultValue="Geral" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            {Object.keys(parameterGroups).map((group) => (
              <TabsTrigger key={group} value={group} className="text-xs">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(parameterGroups).map(([groupName, entities]) => (
            <TabsContent key={groupName} value={groupName} className="space-y-6">
              {entities.map((entity) => (
                <ParameterCRUD
                  key={entity}
                  entity={entity}
                  title={getEntityDisplayName(entity)}
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
}