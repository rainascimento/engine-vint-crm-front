
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LotsAndItems from '@/components/LotsAndItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useOpportunities } from '@/hooks/useOpportunities';
import { toast } from 'sonner';

const categorias = ['CAS', 'CDS', 'CLOUD', 'INOV', 'BI', 'DevOps', 'Infraestrutura'];
const modalidades = ['pregao_eletronico', 'pregao_presencial', 'concorrencia', 'tomada_precos'];
const portais = ['Comprasnet', 'BEC', 'Licitações-e', 'Portal do Fornecedor'];

export default function NewOpportunity() {
  const navigate = useNavigate();
  const { createOpportunity } = useOpportunities();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dataAbertura, setDataAbertura] = useState<Date>();
  const [dataEntrega, setDataEntrega] = useState<Date>();
  const [activeTab, setActiveTab] = useState('identificacao');
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    organ: '',
    bidding_number: '',
    bidding_type: '',
    estimated_value: '',
    description: '',
    category: '',
    tags: [] as string[],
    notes: '',
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleInputChange = (field: string, value: string) => {
    console.log('Form field change:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting form data:', formData);
      
      if (!formData.title || !formData.organ) {
        toast.error('Título e Órgão são obrigatórios');
        return;
      }

      const opportunityData = {
        title: formData.title,
        organ: formData.organ,
        bidding_number: formData.bidding_number || undefined,
        bidding_type: formData.bidding_type || undefined,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : undefined,
        description: formData.description || undefined,
        opening_date: dataAbertura?.toISOString() || undefined,
        deadline_date: dataEntrega?.toISOString() || undefined,
        category: selectedCategories.join(', ') || undefined,
        tags: selectedCategories,
        notes: formData.notes || undefined,
        status: 'identificacao' as const,
      };

      console.log('Creating opportunity with data:', opportunityData);
      await createOpportunity.mutateAsync(opportunityData);
      navigate('/opportunities');
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error('Erro ao criar oportunidade');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Nova Oportunidade</h1>
          <p className="text-gray-600">Cadastre uma nova oportunidade de licitação</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="identificacao">Identificação</TabsTrigger>
              <TabsTrigger value="lotes-itens">Lotes e Itens</TabsTrigger>
              <TabsTrigger value="categorizacao">Categorização</TabsTrigger>
            </TabsList>

            <TabsContent value="identificacao" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Identificação da Oportunidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título da Oportunidade *</Label>
                      <Input 
                        id="title" 
                        placeholder="Ex: Pregão Eletrônico nº 001/2024"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="bidding_number">Número do Processo</Label>
                      <Input 
                        id="bidding_number" 
                        placeholder="Ex: 001/2024"
                        value={formData.bidding_number}
                        onChange={(e) => handleInputChange('bidding_number', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organ">Órgão *</Label>
                      <Input 
                        id="organ" 
                        placeholder="Ex: Ministério da Educação"
                        value={formData.organ}
                        onChange={(e) => handleInputChange('organ', e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_value">Valor Estimado</Label>
                      <Input 
                        id="estimated_value" 
                        placeholder="Ex: 1000000.00"
                        type="number"
                        step="0.01"
                        value={formData.estimated_value}
                        onChange={(e) => handleInputChange('estimated_value', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bidding_type">Modalidade</Label>
                      <Select value={formData.bidding_type} onValueChange={(value) => handleInputChange('bidding_type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a modalidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {modalidades.map(modalidade => (
                            <SelectItem key={modalidade} value={modalidade}>
                              {modalidade.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="portal">Portal de Compras</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o portal" />
                        </SelectTrigger>
                        <SelectContent>
                          {portais.map(portal => (
                            <SelectItem key={portal} value={portal.toLowerCase()}>
                              {portal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Data de Abertura</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dataAbertura && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataAbertura ? format(dataAbertura, "dd/MM/yyyy") : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataAbertura}
                            onSelect={setDataAbertura}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label>Data de Entrega</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dataEntrega && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataEntrega ? format(dataEntrega, "dd/MM/yyyy") : "Selecione a data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dataEntrega}
                            onSelect={setDataEntrega}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Objeto da Licitação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="description">Descrição do Objeto *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva o objeto da licitação..."
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lotes-itens">
              <LotsAndItems />
            </TabsContent>

            <TabsContent value="categorizacao" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categorização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Categorias</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categorias.map(categoria => (
                        <Badge
                          key={categoria}
                          variant={selectedCategories.includes(categoria) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleCategoryToggle(categoria)}
                        >
                          {categoria}
                          {selectedCategories.includes(categoria) && (
                            <X className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Observações adicionais..."
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <div>
              {activeTab !== 'identificacao' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const tabs = ['identificacao', 'lotes-itens', 'categorizacao'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Anterior
                </Button>
              )}
            </div>
            
            <div className="space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate('/opportunities')}>
                Cancelar
              </Button>
              
              {activeTab !== 'categorizacao' ? (
                <Button 
                  type="button" 
                  onClick={() => {
                    const tabs = ['identificacao', 'lotes-itens', 'categorizacao'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Próximo
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar Oportunidade'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
