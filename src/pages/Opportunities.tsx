
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Eye, Mail, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useOpportunities } from '@/hooks/useOpportunities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const pipelineStages = [
  { id: 'identificacao', name: 'IDENTIFICAÇÃO', count: 0, subtitle: 'Prospecções', color: 'bg-gray-100' },
  { id: 'analise_tecnica', name: 'ANÁLISE TÉCNICA', count: 0, subtitle: 'Prospectados', color: 'bg-blue-100' },
  { id: 'parecer', name: 'PARECER', count: 0, subtitle: 'Preparados', color: 'bg-yellow-100' },
  { id: 'proposta', name: 'PROPOSTA', count: 0, subtitle: 'Disputados', color: 'bg-orange-100' },
  { id: 'em_andamento', name: 'EM ANDAMENTO', count: 0, subtitle: 'Vencedores', color: 'bg-green-100' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'em_andamento':
      return 'bg-green-500 text-white';
    case 'cancelada':
      return 'bg-red-500 text-white';
    case 'parecer':
      return 'bg-yellow-500 text-white';
    case 'finalizada':
      return 'bg-blue-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getStatusLabel = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'identificacao': 'IDENTIFICAÇÃO',
    'analise_tecnica': 'ANÁLISE TÉCNICA',
    'parecer': 'PARECER',
    'proposta': 'PROPOSTA',
    'em_andamento': 'EM ANDAMENTO',
    'finalizada': 'FINALIZADA',
    'cancelada': 'CANCELADA'
  };
  return statusMap[status] || status.toUpperCase();
};

export default function Opportunities() {
  const { opportunities, isLoading } = useOpportunities();

  // Calculate pipeline counts
  const pipelineCounts = pipelineStages.map(stage => ({
    ...stage,
    count: opportunities.filter(opp => opp.status === stage.id).length
  }));

  if (isLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
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

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {pipelineCounts.map((stage, index) => (
            <div key={stage.id} className="relative">
              <Card className={cn("text-center", stage.color)}>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
                  <div className="font-semibold text-gray-900">{stage.name}</div>
                  <div className="text-sm text-gray-600">{stage.subtitle}</div>
                </CardContent>
              </Card>
              {index < pipelineCounts.length - 1 && (
                <ChevronRight className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Select defaultValue="10">
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

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar"
                className="pl-10 w-64"
              />
            </div>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do Certame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="identificacao">Identificação</SelectItem>
                <SelectItem value="analise_tecnica">Análise Técnica</SelectItem>
                <SelectItem value="parecer">Parecer</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oportunidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Órgão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Estimado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Abertura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {opportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/opportunities/${opportunity.id}`}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          {opportunity.title}
                        </Link>
                        <div className="text-sm text-gray-500">{opportunity.bidding_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarFallback>{opportunity.organ.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{opportunity.organ}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {opportunity.estimated_value 
                          ? new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(opportunity.estimated_value)
                          : 'Não informado'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {opportunity.opening_date 
                          ? format(new Date(opportunity.opening_date), 'dd/MM/yyyy', { locale: ptBR })
                          : 'Não informado'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={cn("text-xs font-medium px-2 py-1", getStatusColor(opportunity.status))}>
                          {getStatusLabel(opportunity.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Link to={`/opportunities/${opportunity.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

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

        {/* Pagination */}
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
