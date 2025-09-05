import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getAll, getById, getByName, getCount, entityToPath, type ParameterEntity } from '@/lib/api'

export type ParameterEntity2 = ParameterEntity 

export interface Parameter {
  id: number
  nome?: string
  url?: string
  sigla?: string
  descricao?: string
}


// -----------------------------
// LISTAGEM (GET ALL)
// -----------------------------
export function useParametersList(entity: ParameterEntity) {
  return useQuery({
    queryKey: ['parameters', entity],
    queryFn: async () => {
      return await getAll<Parameter>(entity)
    },
  })
}


// -----------------------------
// GET BY ID
// -----------------------------
export function useParameterById(entity: ParameterEntity, id?: number | string) {
  return useQuery({
    queryKey: ['parameters', entity, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error('id obrigatório')
      return await getById<Parameter>(entity, id)
    },
  })
}

// -----------------------------
// GET BY NAME
// -----------------------------
export function useParametersByName(entity: ParameterEntity, name: string) {
  return useQuery({
    queryKey: ['parameters', entity, 'search', name],
    enabled: name.trim().length > 0,
    queryFn: async () => {
      return await getByName<Parameter>(entity, name)
    },
  })
}

// -----------------------------
// GET COUNT
// -----------------------------
export function useParametersCount(entity: ParameterEntity) {
  return useQuery({
    queryKey: ['parameters', entity, 'count'],
    queryFn: async () => {
      return await getCount(entity)
    },
  })
}

// -----------------------------
// CRUD (CREATE / UPDATE / DELETE)
// -----------------------------
export function useParametersCrud(entity: ParameterEntity) {
  const qc = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: Omit<Parameter, 'id'>) => {
      return await api.post<Parameter>(`/${entityToPath[entity]}`, data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parameters', entity] })
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Parameter> }) => {
      return await api.put<Parameter>(`/${entityToPath[entity]}/${id}`, data)
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ['parameters', entity] })
      qc.invalidateQueries({ queryKey: ['parameters', entity, vars.id] })
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => {
      return await api.del<void>(`/${entityToPath[entity]}/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parameters', entity] })
    },
  })

  return {
    createParameter: create.mutateAsync,
    updateParameter: update.mutateAsync,
    deleteParameter: remove.mutateAsync,
    isLoading: create.isPending || update.isPending || remove.isPending,
  }
}

// -----------------------------
// Helpers para labels e campos (mantive do seu código)
// -----------------------------
export const getEntityDisplayName = (entity: ParameterEntity): string => {
  const displayNames: Record<ParameterEntity, string> = {
    categorias: 'Categorias',
    decisoes_parecer: 'Decisões de Parecer',
    esferas_administrativas: 'Esferas Administrativas',
    tipos_orgao: 'Tipos de Órgão',
    status_orgao: 'Status de Órgão',
    modalidades: 'Modalidades',
    portais_compra: 'Portais de Compra',
    mercados: 'Mercados',
    setores: 'Setores',
    status_oportunidade: 'Status de Oportunidade',
    fases_pipeline: 'Fases do Pipeline',
    funcoes: 'Funções',
    perfis_acesso: 'Perfis de Acesso',
    status_usuario: 'Status de Usuário',
    unidades: 'Unidades de Medida',
    motivos_parecer: 'Motivos de Parecer',
    tipos_parecer: 'Tipos de Parecer',
    status_parecer: 'Status de Parecer',
    permissoes: 'Permissões',
    regioes: 'Regiões',
    tipos_regiao_com: 'Tipos de Região Comercial',
    tipos_comercial: 'Tipos Comerciais',
    tipos_contratacao: 'Tipos de Contratação',
    tipos_temperatura: 'Tipos de Temperatura',
    oportunidades: 'Oportunidades',
  }
  return displayNames[entity] || entity
}

export const getEntityFields = (entity: ParameterEntity): string[] => {
  const specialFields: Partial<Record<ParameterEntity, string[]>> = {
    portais_compra: ['nome', 'url'],
    unidades: ['sigla', 'descricao'],
    motivos_parecer: ['descricao'],
  }
  return specialFields[entity] || ['nome']
}

//import type { ParameterEntity } from '@/lib/api'

export type ParameterInput = {
  id?: number
  nome?: string
  url?: string
  sigla?: string
  descricao?: string
  sequencia?: number
}

/** Garante que só mandamos colunas válidas para cada entidade */
export function buildParameterPayload(entity: ParameterEntity, input: ParameterInput) {
  switch (entity) {
    case 'portais_compra':
      return pick(input, ['nome', 'url'])

    case 'unidades':
      return pick(input, ['sigla', 'descricao'])

    case 'motivos_parecer':
      return pick(input, ['descricao'])

    case 'fases_pipeline':
      return pick(input, ['nome', 'sequencia'])

    case 'funcoes':
    case 'perfis_acesso':
    case 'permissoes':
      return pick(input, ['nome', 'descricao'])

    // demais entidades só têm 'nome'
    default:
      return pick(input, ['nome'])
  }
}

/** Util: pega apenas as chaves permitidas e remove undefined */
function pick<T extends object>(obj: T, keys: (keyof T)[]) {
  const out: any = {}
  for (const k of keys) {
    const v = (obj as any)[k]
    if (v !== undefined) out[k] = v
  }
  return out
}
