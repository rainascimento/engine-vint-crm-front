import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import LotsAndItems from '@/components/LotsAndItems';
import DocumentUpload from '@/components/DocumentUpload';
import OpinionManagement from '@/components/OpinionManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useOpportunity, useOpportunities } from '@/hooks/useOpportunities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: opportunity, isLoading } = useOpportunity(id!);
  const { updateOpportunity } = useOpportunities();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organ: '',
    bidding_number: '',
    bidding_type: '',
    estimated_value: '',
    description: '',
    notes: '',
  });

  // Update form data when opportunity loads
  React.useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || '',
        organ: opportunity.organ || '',
        bidding_number: opportunity.bidding_number || '',
        bidding_type: opportunity.bidding_type || '',
        estimated_value: opportunity.estimated_value?.toString() || '',
        description: opportunity.description || '',
        notes: opportunity.notes || '',
      });
    }
  }, [opportunity]);

  const handleSave = async () => {
    if (!opportunity) return;

    try {
      await updateOpportunity.mutateAsync({
        id: opportunity.id,
        title: formData.title,
        organ: formData.organ,
        bidding_number: formData.bidding_number || undefined,
        bidding_type: formData.bidding_type || undefined,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : undefined,
        description: formData.description || undefined,
        notes: formData.notes || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Erro ao atualizar oportunidade');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!opportunity) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Oportunidade não encontrada</h1>
            <p className="text-gray-600 mt-2">A oportunidade solicitada não existe ou foi removida.</p>
          </div>
        </div>
      </Layout>
    );
  }

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
      'identificacao': 'Identificação',
      'analise_tecnica': 'Análise Técnica',
      'parecer': 'Parecer',
      'proposta': 'Proposta',
      'em_andamento': 'Em Andamento',
      'finalizada': 'Finalizada',
      'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{opportunity.title}</h1>
            <p className="text-muted-foreground">{opportunity.organ}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(opportunity.status)}>
                {getStatusLabel(opportunity.status)}
              </Badge>
              {opportunity.created_at && (
                <span className="text-sm text-gray-500">
                  Criado em {format(new Date(opportunity.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="mr-2 h-4 w-4" />
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} disabled={updateOpportunity.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateOpportunity.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="identification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="identification">Identificação</TabsTrigger>
            <TabsTrigger value="object">Objeto</TabsTrigger>
            <TabsTrigger value="lots">Lotes/Itens</TabsTrigger>
            <TabsTrigger value="categorization">Categorização</TabsTrigger>
            <TabsTrigger value="opinions">Pareceres</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="intelligence">Inteligência</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="identification">
            <Card>
              <CardHeader>
                <CardTitle>Dados Básicos da Oportunidade</CardTitle>
                <CardDescription>Informações gerais do processo licitatório</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="organ">Órgão</Label>
                      <Input
                        id="organ"
                        value={formData.organ}
                        onChange={(e) => setFormData(prev => ({ ...prev, organ: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bidding_number">Número do Processo</Label>
                      <Input
                        id="bidding_number"
                        value={formData.bidding_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, bidding_number: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bidding_type">Modalidade</Label>
                      <Select 
                        value={formData.bidding_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bidding_type: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pregao_eletronico">Pregão Eletrônico</SelectItem>
                          <SelectItem value="pregao_presencial">Pregão Presencial</SelectItem>
                          <SelectItem value="concorrencia">Concorrência</SelectItem>
                          <SelectItem value="tomada_precos">Tomada de Preços</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="estimated_value">Valor Estimado</Label>
                      <Input
                        id="estimated_value"
                        type="number"
                        step="0.01"
                        value={formData.estimated_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimated_value: e.target.value }))}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="opening_date">Data de Abertura</Label>
                      <Input
                        id="opening_date"
                        type="date"
                        value={opportunity.opening_date ? new Date(opportunity.opening_date).toISOString().split('T')[0] : ''}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="deadline_date">Prazo Final</Label>
                      <Input
                        id="deadline_date"
                        type="date"
                        value={opportunity.deadline_date ? new Date(opportunity.deadline_date).toISOString().split('T')[0] : ''}
                        disabled={!isEditing}
                        className={!isEditing ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="object">
            <Card>
              <CardHeader>
                <CardTitle>Objeto da Licitação</CardTitle>
                <CardDescription>Descrição geral do objeto licitado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição do Objeto</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objeto da licitação..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações adicionais..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lots">
            <LotsAndItems />
          </TabsContent>

          <TabsContent value="categorization">
            <Card>
              <CardHeader>
                <CardTitle>Categorização da Oportunidade</CardTitle>
                <CardDescription>Classificação e parâmetros da oportunidade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Categorias Técnicas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {opportunity.tags?.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opinions">
            <OpinionManagement />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="intelligence">
            <Card>
              <CardHeader>
                <CardTitle>Inteligência de Negócios</CardTitle>
                <CardDescription>Dados estratégicos e análise competitiva</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Funcionalidade em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Linha do Tempo</CardTitle>
                <CardDescription>Histórico de atividades e marcos importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Oportunidade cadastrada</h4>
                        <span className="text-xs text-muted-foreground">
                          {opportunity.created_at && format(new Date(opportunity.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">Sistema</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
