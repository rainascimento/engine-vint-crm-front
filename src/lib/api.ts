// src/lib/api.ts
// Helper HTTP com GET: COUNT, ALL, BY NAME, BY ID + utilitários.

type Json = Record<string, any> | any[] | null

// Use .env (VITE_API_BASE) ou cai para '/api' (proxy do Vite -> Node 3000)
export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

/** Se usar autenticação, injete o token aqui (ex.: localStorage) */
function getAuthToken(): string | null {
  // return localStorage.getItem('token') // exemplo
  return null
}

export class ApiError extends Error {
  status: number
  body?: string
  constructor(message: string, status: number, body?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface HttpOptions extends RequestInit {
  timeoutMs?: number
  query?: Record<string, string | number | boolean | undefined | null>
}

function buildQuery(params?: HttpOptions['query']): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.append(k, String(v))
  })
  const s = usp.toString()
  return s ? `?${s}` : ''
}

async function http<T = any>(path: string, opts: HttpOptions = {}): Promise<T> {
  const { timeoutMs = 15000, query, headers, ...init } = opts
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  const token = getAuthToken()

  try {

    console.log(`${API_BASE}${path}${buildQuery(query)}`)
    const res = await fetch(`${API_BASE}${path}${buildQuery(query)}`, {
      
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
    })

    const text = await res.text().catch(() => '')
    const tryJson = () => (text ? JSON.parse(text) : undefined)

    if (!res.ok) {
      let body: string | undefined = text
      try {
        const parsed = tryJson()
        body = parsed ? JSON.stringify(parsed) : text
      } catch {}
      throw new ApiError(`${init.method ?? 'GET'} ${path} -> ${res.status}`, res.status, body)
    }

    if (!text) return undefined as T
    try {
      return JSON.parse(text) as T
    } catch {
      // caso o back retorne texto puro
      // @ts-expect-error – pode não ser T, mas evita quebrar
      return text
    }
  } finally {
    clearTimeout(timer)
  }
}

// -------------------------------
// Mapa de entidades → paths da API
// (ajuste nomes conforme seu back)
// -------------------------------
export const entityToPath = {
  categorias: 'categorias',
  decisoes_parecer: 'decisoes_parecer',
  esferas_administrativas: 'esferas_administrativas',
  tipos_orgao: 'tipos_orgao',
  status_orgao: 'status_orgao',
  modalidades: 'modalidades',
  portais_compra: 'portais_compra',
  mercados: 'mercados',
  setores: 'setores',
  status_oportunidade: 'status_oportunidade',
  fases_pipeline: 'fases_pipeline',
  funcoes: 'funcoes',
  usuarios: 'usuarios',
  perfis_acesso: 'perfis_acesso',
  status_usuario: 'status_usuario',
  unidades: 'unidades',
  motivos_parecer: 'motivos_parecer',
  tipos_parecer: 'tipos_parecer',
  status_parecer: 'status_parecer',
  permissoes: 'permissoes',
  regioes: 'regioes',
  tipos_regiao_com: 'tipos_regiao_com',
  tipos_comercial: 'tipos_comercial',
  tipos_contratacao: 'tipos_contratacao',
  tipos_temperatura: 'tipos_temperatura',
  oportunidades: 'oportunidades', // incluído pois é comum precisar
} as const

export type ParameterEntity = keyof typeof entityToPath

const pathOf = (entity: ParameterEntity) => `/${entityToPath[entity]}`

// -------------------------------
// GETs genéricos
// -------------------------------

/** GET ALL: /api/<entidade> */
export async function getAll<T = any>(entity: ParameterEntity, query?: HttpOptions['query']): Promise<T[]> {
  return http<T[]>(pathOf(entity), { query })
}

/** GET BY ID: /api/<entidade>/:id */
export async function getById<T = any>(entity: ParameterEntity, id: number | string): Promise<T> {
  return http<T>(`${pathOf(entity)}/${id}`)
}

/** GET BY NAME (search): /api/<entidade>/search?q=<name> */
export async function getByName<T = any>(entity: ParameterEntity, name: string): Promise<T[]> {
  return http<T[]>(`${pathOf(entity)}/search`, { query: { q: name } })
}

/** GET COUNT: /api/<entidade>/count  → normaliza para número */
export async function getCount(entity: ParameterEntity): Promise<number> {
  const res = await http<number | { count: number }>(`${pathOf(entity)}/count`)
  if (typeof res === 'number') return res
  if (res && typeof (res as any).count === 'number') return (res as any).count
  // fallback: se a API retornar algo diferente, tenta ALL e contar (não ideal, mas evita quebra)
  const all = await getAll(entity)
  return Array.isArray(all) ? all.length : 0
}

// -------------------------------
/** Exponho também um objeto api básico (GET/POST/PUT/DELETE) caso precise em outros lugares */
export const api = {
  get:  <T=any>(path: string, opts?: HttpOptions) => http<T>(path, { method: 'GET', ...(opts || {}) }),
  post: <T=any>(path: string, body?: Json, opts?: HttpOptions) =>
    http<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, ...(opts || {}) }),
  put:  <T=any>(path: string, body?: Json, opts?: HttpOptions) =>
    http<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...(opts || {}) }),
  del:  <T=any>(path: string, opts?: HttpOptions) =>
    http<T>(path, { method: 'DELETE', ...(opts || {}) }),
}