// src/hooks/useOportunidadesPorOrgao.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface Oportunidade {
  id: number
  numero_processo: string
  objeto: string
  data_abertura: string
  data_entrega: string
  uf: string
  uasg: string
  valor_total: number
  modalidades?: { nome: string }
  status_oportunidade?: { nome: string }
  fases_pipeline?: { nome: string }
}

export function useOportunidadesPorOrgao(orgaoId: number | null) {
  return useQuery({
    queryKey: ["oportunidades", orgaoId],
    queryFn: async () => {
      if (!orgaoId) return []
      return api.get<Oportunidade[]>(`/oportunidades/orgao/${orgaoId}`)
    },
    enabled: !!orgaoId, // só busca se tiver id
  })
}
