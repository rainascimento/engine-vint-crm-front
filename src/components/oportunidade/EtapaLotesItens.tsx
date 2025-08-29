/*
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Item {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

interface Lote {
  id: string;
  nome: string;
  itens: Item[];
}

interface EtapaLotesItensProps {
  lotes: Lote[];
  onLotesChange: (lotes: Lote[]) => void;
}

const EtapaLotesItens: React.FC<EtapaLotesItensProps> = ({ lotes, onLotesChange }) => {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [loteEditando, setLoteEditando] = useState<Lote | null>(null);
  const [novoLote, setNovoLote] = useState<Lote>({
    id: '',
    nome: '',
    itens: []
  });
  const [novoItem, setNovoItem] = useState<Item>({
    id: '',
    descricao: '',
    quantidade: 0,
    valorUnitario: 0
  });

  const calcularValorLote = (lote: Lote) => {
    return lote.itens.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0);
  };

  const calcularValorGlobal = () => {
    return lotes.reduce((total, lote) => total + calcularValorLote(lote), 0);
  };

  const calcularValorMensal = () => {
    // Assumindo contratos de 12 meses para o cálculo mensal
    return calcularValorGlobal() / 12;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const adicionarItem = () => {
    if (novoItem.descricao && novoItem.quantidade > 0 && novoItem.valorUnitario > 0) {
      const item = { ...novoItem, id: Date.now().toString() };
      setNovoLote(prev => ({
        ...prev,
        itens: [...prev.itens, item]
      }));
      setNovoItem({ id: '', descricao: '', quantidade: 0, valorUnitario: 0 });
    }
  };

  const removerItem = (itemId: string) => {
    setNovoLote(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== itemId)
    }));
  };

  const salvarLote = () => {
    if (novoLote.nome && novoLote.itens.length > 0) {
      const lote = { ...novoLote, id: loteEditando?.id || Date.now().toString() };
      
      if (loteEditando) {
        const lotesAtualizados = lotes.map(l => l.id === loteEditando.id ? lote : l);
        onLotesChange(lotesAtualizados);
      } else {
        onLotesChange([...lotes, lote]);
      }
      
      fecharDialog();
    }
  };

  const editarLote = (lote: Lote) => {
    setLoteEditando(lote);
    setNovoLote({ ...lote });
    setDialogAberto(true);
  };

  const removerLote = (loteId: string) => {
    if (confirm('Tem certeza que deseja remover este lote?')) {
      onLotesChange(lotes.filter(l => l.id !== loteId));
    }
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setLoteEditando(null);
    setNovoLote({ id: '', nome: '', itens: [] });
    setNovoItem({ id: '', descricao: '', quantidade: 0, valorUnitario: 0 });
  };

  return (
    <div className="space-y-6">
     // KPIs 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Valor Global</p>
              <p className="text-2xl font-bold text-green-800">
                {formatarMoeda(calcularValorGlobal())}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Valor Mensal</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatarMoeda(calcularValorMensal())}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-purple-600 font-medium">Total de Lotes</p>
              <p className="text-2xl font-bold text-purple-800">
                {lotes.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

    // Lista de Lotes 
      {lotes.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lotes Cadastrados</h3>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button onClick={() => setDialogAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {loteEditando ? 'Editar Lote' : 'Novo Lote'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeLote">Nome do Lote *</Label>
                    <Input
                      id="nomeLote"
                      value={novoLote.nome}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Lote 1 - Equipamentos de Informática"
                    />
                  </div>

                 //Formulário de Novo Item 
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Item</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descrição do Item *</Label>
                          <Input
                            value={novoItem.descricao}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Ex: Notebook Dell Inspiron 15"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Quantidade *</Label>
                            <Input
                              type="number"
                              value={novoItem.quantidade}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Unitário *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={novoItem.valorUnitario}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: parseFloat(e.target.value) || 0 }))}
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      </div>
                      <Button onClick={adicionarItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </CardContent>
                  </Card>

               //Lista de Itens do Lote 
                  {novoLote.itens.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Itens do Lote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {novoLote.itens.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{item.descricao}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qtd: {item.quantidade} | Valor Unit.: {formatarMoeda(item.valorUnitario)} | 
                                  Total: {formatarMoeda(item.quantidade * item.valorUnitario)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removerItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="font-semibold text-green-800">
                            Valor Total do Lote: {formatarMoeda(calcularValorLote(novoLote))}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={salvarLote} className="flex-1">
                      {loteEditando ? 'Atualizar Lote' : 'Salvar Lote'}
                    </Button>
                    <Button variant="outline" onClick={fecharDialog}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {lotes.map((lote) => (
              <Card key={lote.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lote.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {lote.itens.length} {lote.itens.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editarLote(lote)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removerLote(lote.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lote.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">{item.descricao}</span>
                        <span className="text-sm font-medium">
                          {item.quantidade}x {formatarMoeda(item.valorUnitario)} = {formatarMoeda(item.quantidade * item.valorUnitario)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded">
                    <p className="font-semibold text-primary">
                      Valor Total: {formatarMoeda(calcularValorLote(lote))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum lote cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece adicionando o primeiro lote desta oportunidade. 
              Você pode adicionar quantos lotes e itens forem necessários.
            </p>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button size="lg" onClick={() => setDialogAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Lote</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeLote">Nome do Lote *</Label>
                    <Input
                      id="nomeLote"
                      value={novoLote.nome}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Lote 1 - Equipamentos de Informática"
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Item</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descrição do Item *</Label>
                          <Input
                            value={novoItem.descricao}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Ex: Notebook Dell Inspiron 15"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Quantidade *</Label>
                            <Input
                              type="number"
                              value={novoItem.quantidade}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Unitário *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={novoItem.valorUnitario}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: parseFloat(e.target.value) || 0 }))}
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      </div>
                      <Button onClick={adicionarItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </CardContent>
                  </Card>

                  {novoLote.itens.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Itens do Lote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {novoLote.itens.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{item.descricao}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qtd: {item.quantidade} | Valor Unit.: {formatarMoeda(item.valorUnitario)} | 
                                  Total: {formatarMoeda(item.quantidade * item.valorUnitario)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removerItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="font-semibold text-green-800">
                            Valor Total do Lote: {formatarMoeda(calcularValorLote(novoLote))}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={salvarLote} className="flex-1">
                      Salvar Lote
                    </Button>
                    <Button variant="outline" onClick={fecharDialog}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {lotes.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Importante:</span> Certifique-se de que todos os lotes e itens 
              estão corretos antes de prosseguir para a categorização. Você pode editar ou adicionar 
              novos lotes a qualquer momento durante esta etapa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EtapaLotesItens;
*/

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParametersList } from '@/hooks/useParameters'; // <- usa sua API para listar unidades

interface Item {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  unidadeId: string;          // novo campo (id da unidade)
}

interface Lote {
  id: string;
  nome: string;
  itens: Item[];
}

interface EtapaLotesItensProps {
  lotes: Lote[];
  onLotesChange: (lotes: Lote[]) => void;
}

const EtapaLotesItens: React.FC<EtapaLotesItensProps> = ({ lotes, onLotesChange }) => {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [loteEditando, setLoteEditando] = useState<Lote | null>(null);
  const [novoLote, setNovoLote] = useState<Lote>({
    id: '',
    nome: '',
    itens: []
  });
  const [novoItem, setNovoItem] = useState<Item>({
    id: '',
    descricao: '',
    quantidade: 0,
    valorUnitario: 0,
    unidadeId: ''        // inicia vazio
  });

  // ---- Carrega UNIDADES da API ----
  const { data: unidades = [], isLoading: loadingUnidades, error: unidadesError } = useParametersList('unidades');
  const unidadesMap = useMemo(() => {
    const map = new Map<string, any>();
    unidades.forEach((u: any) => map.set(String(u.id), u));
    return map;
  }, [unidades]);

  const calcularValorLote = (lote: Lote) => {
    return lote.itens.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0);
  };

  const calcularValorGlobal = () => {
    return lotes.reduce((total, lote) => total + calcularValorLote(lote), 0);
  };

  const calcularValorMensal = () => {
    // Assumindo contratos de 12 meses para o cálculo mensal
    return calcularValorGlobal() / 12;
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const adicionarItem = () => {
    if (
      novoItem.descricao &&
      novoItem.quantidade > 0 &&
      novoItem.valorUnitario > 0 &&
      novoItem.unidadeId      // agora exige unidade
    ) {
      const item = { ...novoItem, id: Date.now().toString() };
      setNovoLote(prev => ({
        ...prev,
        itens: [...prev.itens, item]
      }));
      setNovoItem({ id: '', descricao: '', quantidade: 0, valorUnitario: 0, unidadeId: '' });
    }
  };

  const removerItem = (itemId: string) => {
    setNovoLote(prev => ({
      ...prev,
      itens: prev.itens.filter(item => item.id !== itemId)
    }));
  };

  const salvarLote = () => {
    if (novoLote.nome && novoLote.itens.length > 0) {
      const lote = { ...novoLote, id: loteEditando?.id || Date.now().toString() };
      
      if (loteEditando) {
        const lotesAtualizados = lotes.map(l => l.id === loteEditando.id ? lote : l);
        onLotesChange(lotesAtualizados);
      } else {
        onLotesChange([...lotes, lote]);
      }
      
      fecharDialog();
    }
  };

  const editarLote = (lote: Lote) => {
    setLoteEditando(lote);
    setNovoLote({ ...lote });
    setDialogAberto(true);
  };

  const removerLote = (loteId: string) => {
    if (confirm('Tem certeza que deseja remover este lote?')) {
      onLotesChange(lotes.filter(l => l.id !== loteId));
    }
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setLoteEditando(null);
    setNovoLote({ id: '', nome: '', itens: [] });
    setNovoItem({ id: '', descricao: '', quantidade: 0, valorUnitario: 0, unidadeId: '' });
  };

  const unidadeLabel = (unidadeId: string) => {
    const u = unidadesMap.get(String(unidadeId));
    if (!u) return '';
    // tabela unidades tem: id, sigla, descricao
    return u.sigla ? `${u.sigla} - ${u.descricao}` : u.descricao || u.sigla || '';
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Valor Global</p>
              <p className="text-2xl font-bold text-green-800">
                {formatarMoeda(calcularValorGlobal())}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Valor Mensal</p>
              <p className="text-2xl font-bold text-blue-800">
                {formatarMoeda(calcularValorMensal())}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-purple-600 font-medium">Total de Lotes</p>
              <p className="text-2xl font-bold text-purple-800">
                {lotes.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Lotes */}
      {lotes.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lotes Cadastrados</h3>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button onClick={() => setDialogAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {loteEditando ? 'Editar Lote' : 'Novo Lote'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeLote">Nome do Lote *</Label>
                    <Input
                      id="nomeLote"
                      value={novoLote.nome}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Lote 1 - Equipamentos de Informática"
                    />
                  </div>

                  {/* Formulário de Novo Item */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Item</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descrição do Item *</Label>
                          <Input
                            value={novoItem.descricao}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Ex: Notebook Dell Inspiron 15"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Quantidade *</Label>
                            <Input
                              type="number"
                              value={novoItem.quantidade}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Unitário *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={novoItem.valorUnitario}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: parseFloat(e.target.value) || 0 }))}
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* NOVO CAMPO: UNIDADE */}
                      <div className="space-y-2">
                        <Label>Unidade *</Label>
                        <Select
                          value={novoItem.unidadeId}
                          onValueChange={(value) => setNovoItem(prev => ({ ...prev, unidadeId: value }))}
                          disabled={loadingUnidades}
                        >
                          <SelectTrigger className={!novoItem.unidadeId ? 'border-red-300 focus:border-red-500' : ''}>
                            <SelectValue placeholder={loadingUnidades ? 'Carregando...' : 'Selecione a unidade'} />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.map((u: any) => (
                              <SelectItem key={u.id} value={String(u.id)}>
                                {u.sigla ? `${u.sigla} - ${u.descricao}` : u.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!novoItem.unidadeId && (
                          <p className="text-xs text-red-500">Este campo é obrigatório</p>
                        )}
                        {unidadesError && (
                          <p className="text-xs text-red-500">Erro ao carregar unidades</p>
                        )}
                      </div>

                      <Button onClick={adicionarItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Lista de Itens do Lote */}
                  {novoLote.itens.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Itens do Lote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {novoLote.itens.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{item.descricao}</p>
                                <p className="text-sm text-muted-foreground">
                                  Unidade: {unidadeLabel(item.unidadeId)} | Qtd: {item.quantidade} | Valor Unit.: {formatarMoeda(item.valorUnitario)} | 
                                  Total: {formatarMoeda(item.quantidade * item.valorUnitario)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removerItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="font-semibold text-green-800">
                            Valor Total do Lote: {formatarMoeda(calcularValorLote(novoLote))}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={salvarLote} className="flex-1">
                      {loteEditando ? 'Atualizar Lote' : 'Salvar Lote'}
                    </Button>
                    <Button variant="outline" onClick={fecharDialog}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {lotes.map((lote) => (
              <Card key={lote.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lote.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {lote.itens.length} {lote.itens.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editarLote(lote)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removerLote(lote.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lote.itens.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm">
                          {item.descricao}
                          <span className="text-muted-foreground"> — {unidadeLabel(item.unidadeId)}</span>
                        </span>
                        <span className="text-sm font-medium">
                          {item.quantidade}x {formatarMoeda(item.valorUnitario)} = {formatarMoeda(item.quantidade * item.valorUnitario)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-primary/10 rounded">
                    <p className="font-semibold text-primary">
                      Valor Total: {formatarMoeda(calcularValorLote(lote))}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum lote cadastrado</h3>
            <p className="text-muted-foreground text-center mb-6">
              Comece adicionando o primeiro lote desta oportunidade. 
              Você pode adicionar quantos lotes e itens forem necessários.
            </p>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button size="lg" onClick={() => setDialogAberto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Lote
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Lote</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomeLote">Nome do Lote *</Label>
                    <Input
                      id="nomeLote"
                      value={novoLote.nome}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Lote 1 - Equipamentos de Informática"
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Item</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descrição do Item *</Label>
                          <Input
                            value={novoItem.descricao}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, descricao: e.target.value }))}
                            placeholder="Ex: Notebook Dell Inspiron 15"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>Quantidade *</Label>
                            <Input
                              type="number"
                              value={novoItem.quantidade}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor Unitário *</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={novoItem.valorUnitario}
                              onChange={(e) => setNovoItem(prev => ({ ...prev, valorUnitario: parseFloat(e.target.value) || 0 }))}
                              placeholder="0,00"
                            />
                          </div>
                        </div>
                      </div>

                      {/* NOVO CAMPO: UNIDADE */}
                      <div className="space-y-2">
                        <Label>Unidade *</Label>
                        <Select
                          value={novoItem.unidadeId}
                          onValueChange={(value) => setNovoItem(prev => ({ ...prev, unidadeId: value }))}
                          disabled={loadingUnidades}
                        >
                          <SelectTrigger className={!novoItem.unidadeId ? 'border-red-300 focus:border-red-500' : ''}>
                            <SelectValue placeholder={loadingUnidades ? 'Carregando...' : 'Selecione a unidade'} />
                          </SelectTrigger>
                          <SelectContent>
                            {unidades.map((u: any) => (
                              <SelectItem key={u.id} value={String(u.id)}>
                                {u.sigla ? `${u.sigla} - ${u.descricao}` : u.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!novoItem.unidadeId && (
                          <p className="text-xs text-red-500">Este campo é obrigatório</p>
                        )}
                        {unidadesError && (
                          <p className="text-xs text-red-500">Erro ao carregar unidades</p>
                        )}
                      </div>

                      <Button onClick={adicionarItem} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </CardContent>
                  </Card>

                  {novoLote.itens.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Itens do Lote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {novoLote.itens.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{item.descricao}</p>
                                <p className="text-sm text-muted-foreground">
                                  Unidade: {unidadeLabel(item.unidadeId)} | Qtd: {item.quantidade} | Valor Unit.: {formatarMoeda(item.valorUnitario)} | 
                                  Total: {formatarMoeda(item.quantidade * item.valorUnitario)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removerItem(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="font-semibold text-green-800">
                            Valor Total do Lote: {formatarMoeda(calcularValorLote(novoLote))}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={salvarLote} className="flex-1">
                      Salvar Lote
                    </Button>
                    <Button variant="outline" onClick={fecharDialog}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {lotes.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Importante:</span> Certifique-se de que todos os lotes e itens 
              estão corretos antes de prosseguir para a categorização. Você pode editar ou adicionar 
              novos lotes a qualquer momento durante esta etapa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EtapaLotesItens;
