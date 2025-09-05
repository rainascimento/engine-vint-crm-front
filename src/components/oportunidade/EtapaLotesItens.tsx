import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useParametersList } from '@/hooks/useParameters';

type ItemForm = {
  id?: string;
  nome: string;
  unidadeId?: string;
  valorUnitario: number;
  quantidade?: number; // só front/cálculo
};

type LoteForm = {
  id?: string;
  nome: string;
  descricao?: string;
  itens: ItemForm[];
};

type GrupoForm = {
  id?: string;
  nome: string;
  descricao?: string;
  lotes: LoteForm[];
};

interface Props {
  grupos: GrupoForm[];
  onGruposChange: (grupos: GrupoForm[]) => void;
}

const EtapaGruposLotesItens: React.FC<Props> = ({ grupos, onGruposChange }) => {
  const [dialogAberto, setDialogAberto] = useState(false);
  const [grupoEditando, setGrupoEditando] = useState<GrupoForm | null>(null);

  const [novoGrupo, setNovoGrupo] = useState<GrupoForm>({
    nome: '',
    descricao: '',
    lotes: []
  });

  const [novoLote, setNovoLote] = useState<LoteForm>({
    nome: '',
    descricao: '',
    itens: []
  });

  const [novoItem, setNovoItem] = useState<ItemForm>({
    nome: '',
    unidadeId: '',
    valorUnitario: 0,
    quantidade: 1
  });

  // Unidades (API)
  const { data: unidades = [], isLoading: loadingUnidades, error: unidadesError } = useParametersList('unidades');
  const unidadesMap = useMemo(() => {
    const m = new Map<string, any>();
    unidades.forEach((u: any) => m.set(String(u.id), u));
    return m;
  }, [unidades]);

  // Cálculos
  const valorItem = (it: ItemForm) => (it.valorUnitario || 0) * (it.quantidade || 1);
  const valorLote = (l: LoteForm) => l.itens.reduce((acc, it) => acc + valorItem(it), 0);
  const valorGrupo = (g: GrupoForm) => g.lotes.reduce((acc, l) => acc + valorLote(l), 0);
  const valorTotal = () => grupos.reduce((acc, g) => acc + valorGrupo(g), 0);
  const formatBRL = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // CRUD grupo
  const abrirNovoGrupo = () => {
    setGrupoEditando(null);
    setNovoGrupo({ nome: '', descricao: '', lotes: [] });
    setNovoLote({ nome: '', descricao: '', itens: [] });
    setNovoItem({ nome: '', unidadeId: '', valorUnitario: 0, quantidade: 1 });
    setDialogAberto(true);
  };

  const editarGrupo = (g: GrupoForm) => {
    setGrupoEditando(g);
    setNovoGrupo(JSON.parse(JSON.stringify(g)));
    setNovoLote({ nome: '', descricao: '', itens: [] });
    setNovoItem({ nome: '', unidadeId: '', valorUnitario: 0, quantidade: 1 });
    setDialogAberto(true);
  };

  const salvarGrupo = () => {
    if (!novoGrupo.nome.trim()) return;
    if (grupoEditando) {
      onGruposChange(grupos.map(g => (g === grupoEditando ? novoGrupo : g)));
    } else {
      onGruposChange([...grupos, novoGrupo]);
    }
    fecharDialog();
  };

  const removerGrupo = (idx: number) => {
    if (confirm('Remover este grupo?')) {
      const arr = [...grupos];
      arr.splice(idx, 1);
      onGruposChange(arr);
    }
  };

  // CRUD lote (dentro do Grupo em edição)
  const adicionarLoteAoGrupo = () => {
    if (!novoLote.nome.trim()) return;
    setNovoGrupo(prev => ({ ...prev, lotes: [...prev.lotes, { ...novoLote }] }));
    setNovoLote({ nome: '', descricao: '', itens: [] });
  };

  const removerLoteDoGrupo = (loteIdx: number) => {
    setNovoGrupo(prev => {
      const arr = [...prev.lotes];
      arr.splice(loteIdx, 1);
      return { ...prev, lotes: arr };
    });
  };

  // CRUD item (dentro do lote em edição)
  const adicionarItemAoLote = () => {
    if (!novoItem.nome.trim() || !novoItem.unidadeId || (novoItem.valorUnitario || 0) <= 0) return;
    setNovoLote(prev => ({ ...prev, itens: [...prev.itens, { ...novoItem }] }));
    setNovoItem({ nome: '', unidadeId: '', valorUnitario: 0, quantidade: 1 });
  };

  const removerItemDoLote = (itemIdx: number) => {
    setNovoLote(prev => {
      const arr = [...prev.itens];
      arr.splice(itemIdx, 1);
      return { ...prev, itens: arr };
    });
  };

  const unidadeLabel = (id?: string) => {
    if (!id) return '';
    const u = unidadesMap.get(String(id));
    if (!u) return '';
    return u.sigla ? `${u.sigla} - ${u.descricao}` : u.descricao || u.sigla || '';
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setGrupoEditando(null);
    setNovoGrupo({ nome: '', descricao: '', lotes: [] });
    setNovoLote({ nome: '', descricao: '', itens: [] });
    setNovoItem({ nome: '', unidadeId: '', valorUnitario: 0, quantidade: 1 });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium">Valor Total</p>
              <p className="text-2xl font-bold text-green-800">{formatBRL(valorTotal())}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 font-medium">Grupos</p>
              <p className="text-2xl font-bold text-blue-800">{grupos.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-sm text-purple-600 font-medium">Lotes (total)</p>
              <p className="text-2xl font-bold text-purple-800">
                {grupos.reduce((acc, g) => acc + g.lotes.length, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card único com CRUD de GRUPOS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grupos, Lotes e Itens</CardTitle>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={abrirNovoGrupo}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Grupo
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{grupoEditando ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
              </DialogHeader>

              {/* Grupo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Grupo *</Label>
                  <Input
                    value={novoGrupo.nome}
                    onChange={(e) => setNovoGrupo(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Ex: Grupo 1 - Solução de TI"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição do Grupo</Label>
                  <Textarea
                    value={novoGrupo.descricao || ''}
                    onChange={(e) => setNovoGrupo(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição opcional do grupo"
                    rows={3}
                  />
                </div>
              </div>

              {/* Lote (editor) */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Adicionar Lote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome do Lote *</Label>
                    <Input
                      value={novoLote.nome}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Lote 1 - Equipamentos"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição do Lote</Label>
                    <Textarea
                      value={novoLote.descricao || ''}
                      onChange={(e) => setNovoLote(prev => ({ ...prev, descricao: e.target.value }))}
                      placeholder="Descrição opcional deste lote"
                      rows={2}
                    />
                  </div>

                  {/* Item (editor dentro do Lote) */}
                  <Card className="mt-2">
                    <CardHeader>
                      <CardTitle className="text-sm">Adicionar Item ao Lote</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Nome do Item *</Label>
                          <Input
                            value={novoItem.nome}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, nome: e.target.value }))}
                            placeholder="Ex: Notebook Dell i7"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unidade *</Label>
                          <Select
                            value={novoItem.unidadeId || ''}
                            onValueChange={(v) => setNovoItem(prev => ({ ...prev, unidadeId: v }))}
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
                          {unidadesError && <p className="text-xs text-red-500">Erro ao carregar unidades</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
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
                        <div className="space-y-2">
                          <Label>Quantidade (somente cálculo local)</Label>
                          <Input
                            type="number"
                            value={novoItem.quantidade || 1}
                            onChange={(e) => setNovoItem(prev => ({ ...prev, quantidade: parseInt(e.target.value) || 1 }))}
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <Button onClick={adicionarItemAoLote} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>

                      {/* Itens do lote em edição */}
                      {novoLote.itens.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {novoLote.itens.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="text-sm">
                                <div className="font-medium">{it.nome}</div>
                                <div className="text-muted-foreground">
                                  Unidade: {unidadeLabel(it.unidadeId)} • Quant.: {it.quantidade || 1} • Vlr Unit.: {formatBRL(it.valorUnitario)} • Total:{' '}
                                  {formatBRL(valorItem(it))}
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => removerItemDoLote(idx)} className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="mt-2 p-2 rounded bg-green-50">
                            <span className="text-sm font-semibold text-green-800">Subtotal do Lote: {formatBRL(valorLote(novoLote))}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button onClick={adicionarLoteAoGrupo} className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Lote ao Grupo
                  </Button>

                  {/* Lotes já adicionados ao grupo */}
                  {novoGrupo.lotes.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {novoGrupo.lotes.map((l, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div className="text-sm">
                            <div className="font-medium">{l.nome}</div>
                            <div className="text-muted-foreground">
                              Itens: {l.itens.length} • Subtotal: {formatBRL(valorLote(l))}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => removerLoteDoGrupo(idx)} className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="mt-2 p-2 rounded bg-blue-50">
                        <span className="text-sm font-semibold text-blue-800">Subtotal do Grupo: {formatBRL(valorGrupo(novoGrupo))}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={salvarGrupo} className="flex-1">
                      {grupoEditando ? 'Atualizar Grupo' : 'Salvar Grupo'}
                    </Button>
                    <Button variant="outline" onClick={fecharDialog}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </DialogContent>

          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4">
          {grupos.length > 0 ? (
            grupos.map((g, idx) => (
              <Card key={idx} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{g.nome}</CardTitle>
                      {g.descricao && <p className="text-sm text-muted-foreground">{g.descricao}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        Lotes: {g.lotes.length} • Total: {formatBRL(valorGrupo(g))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editarGrupo(g)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => removerGrupo(idx)} className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {g.lotes.length ? (
                    <div className="space-y-2">
                      {g.lotes.map((l, li) => (
                        <div key={li} className="p-3 rounded bg-muted">
                          <div className="flex justify-between">
                            <div className="font-medium">{l.nome}</div>
                            <div className="text-sm">Subtotal: {formatBRL(valorLote(l))}</div>
                          </div>
                          {l.descricao && <div className="text-xs text-muted-foreground mb-2">{l.descricao}</div>}
                          <div className="space-y-1 mt-1">
                            {l.itens.map((it, ii) => (
                              <div key={ii} className="flex justify-between text-sm">
                                <span>
                                  {it.nome}{' '}
                                  <span className="text-muted-foreground">• {unidadeLabel(it.unidadeId)}</span>
                                </span>
                                <span>
                                  {(it.quantidade || 1)}x {formatBRL(it.valorUnitario)} = {formatBRL(valorItem(it))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Nenhum lote neste grupo.</div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum grupo cadastrado</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Adicione o primeiro grupo desta oportunidade. Cada grupo pode conter vários lotes e itens.
                </p>
                <Button size="lg" onClick={abrirNovoGrupo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Grupo
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div >
  );
};

export default EtapaGruposLotesItens;
