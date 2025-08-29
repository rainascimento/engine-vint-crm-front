
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, User, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SWOTAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

interface Opinion {
  id: string;
  type: 'licitacao' | 'pre-vendas' | 'negocios' | 'diretoria';
  responsible: {
    name: string;
    email: string;
    phone: string;
    position: string;
    avatar?: string;
    organization: string;
    location: string;
    language: string;
    status: 'ativo' | 'inativo';
  };
  decision: 'favoravel' | 'nao-favoravel' | 'pendente';
  reason: string;
  status: 'pendente' | 'pronto' | 'em-analise';
  observations: string;
  swot: SWOTAnalysis;
  createdAt: Date;
  updatedAt: Date;
  history: Array<{
    date: Date;
    responsible: string;
    action: string;
    status: string;
  }>;
}

const opinionTypes = [
  { value: 'licitacao', label: 'Licitação', icon: FileText },
  { value: 'pre-vendas', label: 'Pré-vendas', icon: User },
  { value: 'negocios', label: 'Negócios', icon: User },
  { value: 'diretoria', label: 'Diretoria', icon: User },
];

const reasons = [
  'Viabilidade técnica',
  'Viabilidade comercial',
  'Recursos disponíveis',
  'Estratégia empresarial',
  'Prazo insuficiente',
  'Documentação incompleta',
  'Outros',
];

const mockResponsible = {
  name: 'João Silva',
  email: 'joao.silva@empresa.com',
  phone: '(11) 99999-9999',
  position: 'Gerente de Projetos',
  organization: 'Empresa XYZ',
  location: 'São Paulo, SP',
  language: 'Português',
  status: 'ativo' as const,
};

export default function OpinionManagement() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [activeTab, setActiveTab] = useState('licitacao');
  const [currentOpinion, setCurrentOpinion] = useState<Partial<Opinion>>({
    type: 'licitacao',
    responsible: mockResponsible,
    decision: 'pendente',
    reason: '',
    status: 'pendente',
    observations: '',
    swot: {
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: '',
    },
  });

  const getCurrentOpinion = (type: string) => {
    return opinions.find(opinion => opinion.type === type) || {
      ...currentOpinion,
      type: type as Opinion['type'],
    };
  };

  const saveOpinion = () => {
    const opinionToSave: Opinion = {
      id: Date.now().toString(),
      type: activeTab as Opinion['type'],
      responsible: mockResponsible,
      decision: currentOpinion.decision as Opinion['decision'],
      reason: currentOpinion.reason || '',
      status: currentOpinion.status as Opinion['status'],
      observations: currentOpinion.observations || '',
      swot: currentOpinion.swot || {
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      history: [{
        date: new Date(),
        responsible: mockResponsible.name,
        action: 'Parecer criado',
        status: currentOpinion.status || 'pendente',
      }],
    };

    setOpinions(prev => {
      const existing = prev.findIndex(op => op.type === activeTab);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...opinionToSave, id: prev[existing].id };
        return updated;
      }
      return [...prev, opinionToSave];
    });

    toast.success('Parecer salvo com sucesso!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pronto':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'em-analise':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getOpinionStatus = (type: string) => {
    const opinion = opinions.find(op => op.type === type);
    return opinion?.status || 'pendente';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestão de Pareceres</h3>
          <p className="text-sm text-gray-600">Registre pareceres por área de responsabilidade</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {opinionTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value} className="flex items-center space-x-2">
              {getStatusIcon(getOpinionStatus(type.value))}
              <span>{type.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {opinionTypes.map((type) => {
          const opinion = getCurrentOpinion(type.value);
          
          return (
            <TabsContent key={type.value} value={type.value} className="space-y-6">
              {/* Responsável */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Responsável pelo Parecer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={opinion.responsible?.avatar} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {opinion.responsible?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Nome</Label>
                        <p className="text-sm">{opinion.responsible?.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Cargo</Label>
                        <p className="text-sm">{opinion.responsible?.position}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">E-mail</Label>
                        <p className="text-sm">{opinion.responsible?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Telefone</Label>
                        <p className="text-sm">{opinion.responsible?.phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Organização</Label>
                        <p className="text-sm">{opinion.responsible?.organization}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <Badge variant={opinion.responsible?.status === 'ativo' ? 'default' : 'secondary'}>
                          {opinion.responsible?.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parecer */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Parecer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="decision">Decisão *</Label>
                      <Select 
                        value={opinion.decision} 
                        onValueChange={(value: 'favoravel' | 'nao-favoravel' | 'pendente') => 
                          setCurrentOpinion(prev => ({ ...prev, decision: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a decisão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="favoravel">Favorável</SelectItem>
                          <SelectItem value="nao-favoravel">Não Favorável</SelectItem>
                          <SelectItem value="pendente">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reason">Motivo</Label>
                      <Select 
                        value={opinion.reason} 
                        onValueChange={(value) => 
                          setCurrentOpinion(prev => ({ ...prev, reason: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {reasons.map(reason => (
                            <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status">Status *</Label>
                      <Select 
                        value={opinion.status} 
                        onValueChange={(value: 'pendente' | 'pronto' | 'em-analise') => 
                          setCurrentOpinion(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="em-analise">Em Análise</SelectItem>
                          <SelectItem value="pronto">Pronto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      value={opinion.observations}
                      onChange={(e) => setCurrentOpinion(prev => ({ ...prev, observations: e.target.value }))}
                      placeholder="Observações detalhadas sobre o parecer..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Análise SWOT */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise SWOT (Opcional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="strengths">Forças (Strengths)</Label>
                      <Textarea
                        id="strengths"
                        value={opinion.swot?.strengths}
                        onChange={(e) => setCurrentOpinion(prev => ({
                          ...prev,
                          swot: { ...prev.swot, strengths: e.target.value }
                        }))}
                        placeholder="Pontos fortes identificados..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weaknesses">Fraquezas (Weaknesses)</Label>
                      <Textarea
                        id="weaknesses"
                        value={opinion.swot?.weaknesses}
                        onChange={(e) => setCurrentOpinion(prev => ({
                          ...prev,
                          swot: { ...prev.swot, weaknesses: e.target.value }
                        }))}
                        placeholder="Pontos fracos identificados..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="opportunities">Oportunidades (Opportunities)</Label>
                      <Textarea
                        id="opportunities"
                        value={opinion.swot?.opportunities}
                        onChange={(e) => setCurrentOpinion(prev => ({
                          ...prev,
                          swot: { ...prev.swot, opportunities: e.target.value }
                        }))}
                        placeholder="Oportunidades identificadas..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="threats">Ameaças (Threats)</Label>
                      <Textarea
                        id="threats"
                        value={opinion.swot?.threats}
                        onChange={(e) => setCurrentOpinion(prev => ({
                          ...prev,
                          swot: { ...prev.swot, threats: e.target.value }
                        }))}
                        placeholder="Ameaças identificadas..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico */}
              {opinions.find(op => op.type === type.value)?.history && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Histórico de Alterações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {opinions.find(op => op.type === type.value)?.history.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                          <div>
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-gray-500">Por: {entry.responsible}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{entry.status}</Badge>
                            <p className="text-xs text-gray-500">{entry.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ações */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCurrentOpinion({
                  type: type.value as Opinion['type'],
                  responsible: mockResponsible,
                  decision: 'pendente',
                  reason: '',
                  status: 'pendente',
                  observations: '',
                  swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
                })}>
                  Cancelar
                </Button>
                <Button onClick={saveOpinion} className="bg-purple-600 hover:bg-purple-700">
                  Salvar Parecer
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
