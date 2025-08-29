
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockOpportunities = [
  {
    id: 1,
    title: "Pregão Eletrônico nº 001/2024 - Sistema de Gestão",
    organ: "Ministério da Educação",
    status: "Em Andamento",
    value: "R$ 2.500.000,00",
    deadline: "2024-01-15",
    stage: "Parecer Técnico"
  },
  {
    id: 2,
    title: "Pregão Eletrônico nº 002/2024 - Infraestrutura Cloud",
    organ: "Tribunal de Justiça",
    status: "Análise",
    value: "R$ 1.800.000,00",
    deadline: "2024-01-20",
    stage: "Questionamentos"
  },
  {
    id: 3,
    title: "Pregão Eletrônico nº 003/2024 - Licenças de Software",
    organ: "Prefeitura Municipal",
    status: "Finalizado",
    value: "R$ 850.000,00",
    deadline: "2024-01-10",
    stage: "Homologado"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Em Andamento':
      return 'bg-blue-500';
    case 'Análise':
      return 'bg-yellow-500';
    case 'Finalizado':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Visão geral das oportunidades de licitação</p>
          </div>
          <Link to="/opportunities/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </Link>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Oportunidades</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">50% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Taxa de 66% de sucesso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 15,2M</div>
              <p className="text-xs text-muted-foreground">+12% desde o mês passado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Oportunidades Recentes */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Oportunidades Recentes</CardTitle>
              <CardDescription>Lista das últimas oportunidades cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oportunidade</TableHead>
                    <TableHead>Órgão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOpportunities.map((opportunity) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>
                        <Link to={`/opportunities/${opportunity.id}`} className="font-medium hover:underline">
                          {opportunity.title}
                        </Link>
                      </TableCell>
                      <TableCell>{opportunity.organ}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(opportunity.status)}>
                          {opportunity.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(opportunity.deadline).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{opportunity.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pipeline */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Pipeline de Vendas</CardTitle>
              <CardDescription>Progresso das oportunidades por estágio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Identificação</span>
                  <span>4 oportunidades</span>
                </div>
                <Progress value={30} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Análise Técnica</span>
                  <span>6 oportunidades</span>
                </div>
                <Progress value={45} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Parecer</span>
                  <span>3 oportunidades</span>
                </div>
                <Progress value={22} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span>Proposta</span>
                  <span>2 oportunidades</span>
                </div>
                <Progress value={15} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova oportunidade cadastrada</p>
                  <p className="text-xs text-muted-foreground">Pregão Eletrônico nº 004/2024 - há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Parecer técnico aprovado</p>
                  <p className="text-xs text-muted-foreground">Sistema de Gestão - há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Questionamento enviado</p>
                  <p className="text-xs text-muted-foreground">Infraestrutura Cloud - há 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
