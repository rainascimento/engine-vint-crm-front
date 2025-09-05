import * as React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Plus, Search, Eye, Mail, MoreHorizontal, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useOpportunities, Opportunity, OpportunityFilters } from '@/hooks/useOpportunities';
import { useParametersList } from '@/hooks/useParameters';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type FasePipeline = { id: number; nome: string; sequencia?: number | null };
type StatusOportunidade = { id: number; nome: string };
type OrgaoPub = { id: number; nome: string; sigla?: string | null };

const cardBgByIndex = ['bg-gray-100','bg-blue-100','bg-yellow-100','bg-orange-100','bg-green-100','bg-purple-100','bg-pink-100'];

const normalize = (s?: string | null) =>
  s ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim() : '';

const safeDate = (d?: string | null) => {
  if (!d) return 'Não informado';
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return 'Não informado';
  return format(dt, 'dd/MM/yyyy', { locale: ptBR });
};

const getStatusColor = (name: string) => {
  const s = normalize(name);
  if (s.includes('andamento')) return 'bg-green-500 text-white';
  if (s.includes('analise')) return 'bg-amber-500 text-white';
  if (s.includes('parecer')) return 'bg-yellow-500 text-white';
  if (s.includes('proposta')) return 'bg-purple-500 text-white';
  if (s.includes('final')) return 'bg-blue-500 text-white';
  if (s.includes('cancel')) return 'bg-red-500 text-white';
  return 'bg-gray-500 text-white';
};

export default function Opportunities() {
  // parâmetros (fases e status)
  const { data: fases = [] } = useParametersList('fases_pipeline');
  const { data: statusList = [] } = useParametersList('status_oportunidade');

  // órgãos públicos
  const [orgaos, setOrgaos] = React.useState<OrgaoPub[]>([]);
  const orgaosById = React.useMemo(() => {
    const m = new Map<number, OrgaoPub>();
    orgaos.forEach(o => m.set(o.id, o));
    return m;
  }, [orgaos]);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/orgaos_publicos');
        const rows: any = res?.data ?? res;
        const list: OrgaoPub[] = Array.isArray(rows) ? rows : rows?.data ?? [];
        setOrgaos(list);
      } catch (e) {
        // silencioso; a tabela ainda renderiza sem órgão
      }
    })();
  }, []);

  // sort fases / status
  const fasesSorted = React.useMemo<FasePipeline[]>(
    () =>
      [...(fases || [])]
        .map(f => ({ ...f, nome: f?.nome ?? '' }))
        .sort((a, b) => {
          const sa = a.sequencia ?? 9999;
          const sb = b.sequencia ?? 9999;
          if (sa !== sb) return sa - sb;
          return a.nome.localeCompare(b.nome, 'pt-BR');
        }),
    [fases]
  );

  const statusSorted = React.useMemo<StatusOportunidade[]>(
    () =>
      [...(statusList || [])]
        .map(s => ({ ...s, nome: s?.nome ?? '' }))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')),
    [statusList]
  );

  const faseById = React.useMemo(() => {
    const m = new Map<number, FasePipeline>();
    fasesSorted.forEach(f => m.set(f.id, f));
    return m;
  }, [fasesSorted]);

  const statusById = React.useMemo(() => {
    const m = new Map<number, StatusOportunidade>();
    statusSorted.forEach(s => m.set(s.id, s));
    return m;
  }, [statusSorted]);

  // === Filtros ===
  const [simpleSearch, setSimpleSearch] = React.useState('');
  const [faseId, setFaseId] = React.useState<string>('all');
  const [statusId, setStatusId] = React.useState<string>('all');

  // avançados
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [orgaoId, setOrgaoId] = React.useState<string>('all');
  const [modalidadeId, setModalidadeId] = React.useState<string>('all');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');
  const [minValue, setMinValue] = React.useState<string>('');
  const [maxValue, setMaxValue] = React.useState<string>('');
  const [perPage, setPerPage] = React.useState<string>('25');

  // objeto de filtros passado ao hook
  const filters: OpportunityFilters = React.useMemo(() => ({
    q: simpleSearch || undefined,
    fase_id: faseId !== 'all' ? Number(faseId) : undefined,
    status_id: statusId !== 'all' ? Number(statusId) : undefined,
    orgao_id: orgaoId !== 'all' ? Number(orgaoId) : undefined,
    modalidade_id: modalidadeId !== 'all' ? Number(modalidadeId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    min_value: minValue ? Number(minValue) : undefined,
    max_value: maxValue ? Number(maxValue) : undefined,
    per_page: Number(perPage),
  }), [simpleSearch, faseId, statusId, orgaoId, modalidadeId, dateFrom, dateTo, minValue, maxValue, perPage]);

  const { opportunities = [], isLoading: loadingOpp, error: errorOpp } = useOpportunities(filters, orgaosById);

  // contagem por fase (cards)
  const counts = React.useMemo(() => {
    const map = new Map<number, number>();
    fasesSorted.forEach(f => map.set(f.id, 0));
    opportunities.forEach((op: Opportunity) => {
      const id = op.fase_pipeline_id;
      if (id && map.has(id)) map.set(id, (map.get(id) || 0) + 1);
      else {
        const sname = op.status_oportunidade?.nome;
        if (sname) {
          const n = normalize(sname);
          const f = fasesSorted.find(x => normalize(x.nome) === n);
          if (f) map.set(f.id, (map.get(f.id) || 0) + 1);
        }
      }
    });
    return map;
  }, [fasesSorted, opportunities]);

  if (loadingOpp) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        </div>
      </Layout>
    );
  }

  if (errorOpp) {
    return (
      <Layout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-red-600 font-medium">Erro ao carregar oportunidades.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Verifique a rota <code>/api/oportunidades</code>.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Pipeline</h1>
        </div>

        {/* Cards dinâmicos (Fase) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {fasesSorted.map((fase, idx) => (
            <div key={fase.id} className="relative">
              <Card className={cn('text-center', cardBgByIndex[idx % cardBgByIndex.length])}>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">{counts.get(fase.id) ?? 0}</div>
                  <div className="font-semibold text-gray-900">{fase.nome}</div>
                  <div className="text-sm text-gray-600">Fase: {fase.sequencia ?? '-'}</div>
                </CardContent>
              </Card>
              {idx < fasesSorted.length - 1 && (
                <ChevronRight className="absolute top-1/2 -right-2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Controls + Filtros */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <Link to="/opportunities/new">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Oportunidade
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar nº, objeto ou órgão"
                className="pl-10 w-72"
                value={simpleSearch}
                onChange={(e) => setSimpleSearch(e.target.value)}
              />
            </div>

            {/* Filtro por Fase */}
            <Select value={faseId} onValueChange={setFaseId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filtrar por fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fases</SelectItem>
                {fasesSorted.map(f => (
                  <SelectItem key={f.id} value={String(f.id)}>{f.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Status */}
            <Select value={statusId} onValueChange={setStatusId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {statusSorted.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Abrir/fechar avançados */}
            <Button variant="outline" onClick={() => setShowAdvanced(v => !v)}>
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Ocultar filtros' : 'Consulta avançada'}
            </Button>
          </div>
        </div>

        {/* Consulta avançada */}
        {showAdvanced && (
          <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Órgão */}
              <div>
                <label className="text-xs text-muted-foreground">Órgão</label>
                <Select value={orgaoId} onValueChange={setOrgaoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {orgaos.map(o => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {o.sigla ? `${o.sigla} — ${o.nome}` : o.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Modalidade */}
              <div>
                <label className="text-xs text-muted-foreground">Modalidade</label>
                <Select value={modalidadeId} onValueChange={setModalidadeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {/* Se quiser, carregue modalidades de /api/modalidades e mapeie aqui */}
                    <SelectItem value="1">Pregão Eletrônico</SelectItem>
                    <SelectItem value="2">Concorrência</SelectItem>
                    {/* ... */}
                  </SelectContent>
                </Select>
              </div>

              {/* Intervalo de datas (usa data_abertura) */}
              <div>
                <label className="text-xs text-muted-foreground">Data de Abertura (de)</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Data de Abertura (até)</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>

              {/* Intervalo de valores */}
              <div>
                <label className="text-xs text-muted-foreground">Valor mín. (R$)</label>
                <Input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Valor máx. (R$)</label>
                <Input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oportunidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Órgão</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objeto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Estimado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Captação</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Abertura</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fase</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunities.map((op: Opportunity) => {
                    const faseNome = (op.fase_pipeline_id && fasesSorted.length)
                      ? (faseById.get(op.fase_pipeline_id)?.nome ?? '—')
                      : (op.fase_pipeline?.nome ?? '—');

                    const statusNome = (op.status_id && statusSorted.length)
                      ? (statusById.get(op.status_id)?.nome ?? op.status_oportunidade?.nome ?? '—')
                      : (op.status_oportunidade?.nome ?? '—');

                    const org = orgaosById.get(op.orgao_id);
                    const organName = org?.nome ?? op.orgao?.nome ?? '—';
                    const organSigla = (org?.sigla ?? op.orgao?.sigla ?? '—').toUpperCase();

                    return (
                      <tr key={op.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/opportunities/${op.id}`} className="text-purple-600 hover:text-purple-800 font-medium">
                            {op.numero_processo || 'Sem título'}
                          </Link>
                          <div className="text-sm text-gray-500">{op.uasg || '—'}</div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-8 h-8 mr-3">
                              <AvatarFallback>{organSigla.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{organName}</div>
                              <div className="text-sm text-gray-500">{/* UF se tiver em outra coluna */}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700 truncate max-w-[360px]">
                            {op.objeto || '—'}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {op.valor_estimado != null
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(op.valor_estimado))
                            : 'Não informado'}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {safeDate(op.data_entrega)}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {safeDate(op.data_abertura)}
                        </td>

                        {/* Badge de Fase */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={cn('text-xs font-medium px-2 py-1', getStatusColor(faseNome))}>
                            {faseNome}
                          </Badge>
                        </td>

                        {/* Novo badge de Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                            {statusNome}
                          </Badge>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" title="Enviar por e-mail">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Link to={`/opportunities/${op.id}`}>
                              <Button variant="ghost" size="sm" title="Visualizar">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" title="Mais ações">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Vazio */}
        {opportunities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma oportunidade cadastrada ainda.</p>
            <Link to="/opportunities/new">
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira oportunidade
              </Button>
            </Link>
          </div>
        )}

        {/* Paginação placeholder (se precisar paginação real, use page/per_page no filtro e UI aqui) */}
        {opportunities.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Mostrando {opportunities.length} oportunidade{opportunities.length !== 1 ? 's' : ''}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </Layout>
  );
}
