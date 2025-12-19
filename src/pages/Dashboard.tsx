
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

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
      return 'bg-blue-500 text-white';
    case 'Análise':
      return 'bg-yellow-500 text-gray-800';
    case 'Finalizado':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

// --- Componente Principal ---
function Dashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = React.useState(mockOpportunities);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (user && user.id) {
          const response = await api.get(`/oportunidades`);
          setOpportunities(response); 
        }
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground text-gray-500">Visão geral das oportunidades de licitação</p>
          </div>
          <Link to="/opportunities/new">
            <Button className="mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </Link>
        </div>

        {/* Métricas */}
        {/* Adicionado 'text-center' em CardContent para centralizar os números e textos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total de Oportunidades</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-0 text-center"> 
              <div className="text-2xl font-bold text-gray-800">{opportunities.length}</div>
              <p className="text-xs text-gray-500 mt-1">+2 desde o mês passado</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <div className="text-2xl font-bold text-gray-800">12</div>
              <p className="text-xs text-gray-500 mt-1">50% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <div className="text-2xl font-bold text-gray-800">8</div>
              <p className="text-xs text-gray-500 mt-1">Taxa de 66% de sucesso</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent className="pt-0 text-center">
              <div className="text-2xl font-bold text-gray-800">R$ 15,2M</div>
              <p className="text-xs text-gray-500 mt-1">+12% desde o mês passado</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          {/* Oportunidades Recentes */}
          <Card className="lg:col-span-4">
            <CardHeader className="border-b">
              <CardTitle>Oportunidades Recentes</CardTitle>
              <CardDescription>Lista das últimas oportunidades cadastradas</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                  <div className="text-center py-10 text-gray-500">
                      <Clock className="h-6 w-6 mx-auto animate-spin" />
                      <p className="mt-2">Carregando oportunidades...</p>
                  </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Oportunidade</TableHead>
                      <TableHead>Órgão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.map((opportunity) => (
                      <TableRow key={opportunity.id}>
                        <TableCell>
                          <Link to={`/opportunities/${opportunity.id}`} className="font-medium text-purple-600 hover:text-purple-800 hover:underline">
                            {opportunity.title}
                          </Link>
                        </TableCell>
                        <TableCell>{opportunity.organ}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(opportunity.status)} text-xs`}>
                            {opportunity.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span>{formatDate(opportunity.deadline)}</span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-gray-700">{opportunity.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pipeline */}
          <Card className="lg:col-span-3">
            <CardHeader className="border-b">
              <CardTitle>Pipeline de Vendas</CardTitle>
              <CardDescription>Progresso das oportunidades por estágio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Identificação</span>
                  <span className="text-gray-500">4 oportunidades</span>
                </div>
                <Progress value={30} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Análise Técnica</span>
                  <span className="text-gray-500">6 oportunidades</span>
                </div>
                <Progress value={45} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Parecer</span>
                  <span className="text-gray-500">3 oportunidades</span>
                </div>
                <Progress value={22} className="mt-2" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">Proposta</span>
                  <span className="text-gray-500">2 oportunidades</span>
                </div>
                <Progress value={15} className="mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card className="mt-6">
          <CardHeader className="border-b">
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                    <Plus className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova oportunidade cadastrada</p>
                  <p className="text-xs text-gray-500">Pregão Eletrônico nº 004/2024 - há 2 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Parecer técnico aprovado</p>
                  <p className="text-xs text-gray-500">Sistema de Gestão - há 4 horas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Questionamento enviado</p>
                  <p className="text-xs text-gray-500">Infraestrutura Cloud - há 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

// Exportação padrão para o React App
export default Dashboard;