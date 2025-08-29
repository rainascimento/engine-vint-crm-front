
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, UserPlus, Building, Target, FileText, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CRM Licitações</span>
          </div>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="outline">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Gerencie suas <span className="text-purple-600">Licitações</span> com Eficiência
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Sistema completo para gestão de oportunidades de licitação, desde a identificação até a execução dos contratos.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <LogIn className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Principais Funcionalidades
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Building className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Gestão de Oportunidades</CardTitle>
              <CardDescription>
                Controle completo de todas as oportunidades de licitação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cadastro detalhado de editais</li>
                <li>• Controle de prazos e datas</li>
                <li>• Status e acompanhamento</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Lotes e Itens</CardTitle>
              <CardDescription>
                Organização estruturada de lotes e seus itens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Divisão por lotes</li>
                <li>• Especificações técnicas</li>
                <li>• Controle de quantidades</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Pareceres Técnicos</CardTitle>
              <CardDescription>
                Sistema de aprovações e pareceres especializados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pareceres técnicos e jurídicos</li>
                <li>• Fluxo de aprovação</li>
                <li>• Histórico de decisões</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Gestão de Documentos</CardTitle>
              <CardDescription>
                Armazenamento seguro de toda documentação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Upload de documentos</li>
                <li>• Categorização automática</li>
                <li>• Controle de versões</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Colaboração</CardTitle>
              <CardDescription>
                Trabalho em equipe e controle de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Atribuição de responsáveis</li>
                <li>• Controle de permissões</li>
                <li>• Histórico de atividades</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Target className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Análise completa de performance e resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Dashboard executivo</li>
                <li>• Relatórios customizados</li>
                <li>• Métricas de sucesso</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8">
            Acesse o sistema e transforme sua gestão de licitações
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary">
              <LogIn className="w-5 h-5 mr-2" />
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-lg font-semibold">CRM Licitações</span>
          </div>
          <p className="text-gray-400">
            Sistema completo para gestão de licitações e oportunidades.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
