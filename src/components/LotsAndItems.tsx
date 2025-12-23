import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Package, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useLots } from '@/hooks/useLots';
import { useItems } from '@/hooks/useItems';
import { useParameterByFK, useParameterById, useParametersCrud, useParametersList } from '@/hooks/useParameters';
import { set } from 'date-fns';
import { toast } from 'sonner';


interface Item {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  unidade_id: string | number;
  valor_unitario: number;
  totalValue: number;
  lote_id: string;
}

interface Lot {
  id: string;
  name: string;
  category: string;
  descricao: string; 
  items: Item[];
  totalValue: number;
}
const MOCK_CATEGORIES = [
  { id: '1', descricao: 'EQUIPAMENTOS' },
  { id: '2', descricao: 'SERVIÇOS TÉCNICOS' },
  { id: '3', descricao: 'LICENCIAMENTO' },
  { id: '4', descricao: 'INFRAESTRUTURA' }
];


export default function LotsAndItems() {

  const { createItem,updateItem,deleteItem } = useItems([]);

  const { createLot, updateLot, deleteLot } = useLots('');

  const params = useParams<{ id: string }>();
  const opportunityId = params.id || 'default';




  const { data: categories = [], isLoading: loadingStatus } = useParameterByFK('grupo', 'oportunidade_id', opportunityId)
  const { data: units = [], isLoading: loadingUnits } = useParametersList('unidades')






  // Hooks de carregamento de dados (Simulados)
  const loadLotes = useLots(opportunityId);
  const lotIds = useMemo(() => loadLotes.lots.map(l => l.id), [loadLotes.lots]);

  const lootCarregado = loadLotes.lots
  const loadItems = useItems(lotIds);

  const itemsCarregados = loadItems.items || [];

  const [lots, setLots] = useState<Lot[]>([]);


  const [isLotDialogOpen, setIsLotDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  // Estados de formulário
  const [lotForm, setLotForm] = useState({ name: '', category: '', descricao: '' });
  const [itemForm, setItemForm] = useState({
    nome: '',
    quantidade: 1,
    unidade_id: 'Unidade',
    valor_unitario: 0
  });

  useEffect(() => {

    const timer = setTimeout(() => {

      if (!hasInitialized) {
        if (lootCarregado.length > 0) {
          const itemsByLotId: Record<string, Item[]> = (itemsCarregados || []).reduce((acc, item) => {
            const lid = String(item.lote_id);
            if (!acc[lid]) acc[lid] = [];

            const qty = Number(item.quantidade) || 0;
            const val = parseFloat(item.valor_unitario) || 0;

            acc[lid].push({
              ...item,
              quantidade: qty,
              valor_unitario: val,
              totalValue: qty * val
            });
            return acc;
          }, {} as Record<string, Item[]>);



          const aggregated = lootCarregado.map(lot => {
            const lotItems = itemsByLotId[String(lot.id)] || [];
            return {
              id: String(lot.id),
              name: lot.name || lot.nome || 'Lote sem nome',
              category: lot.descricao.toUpperCase() || 'Geral',
              items: lotItems,
              totalValue: lotItems.reduce((sum, i) => sum + i.totalValue, 0)
            };
          });

          console.log('Lotes agregados:', aggregated);
          setLots(aggregated);
          setHasInitialized(true);

        }
      }


    }, 200);

    return () => clearTimeout(timer);
  }, [loadLotes.isLoading, loadItems.isLoading]);



  const totalGlobalValue = useMemo(() => lots.reduce((acc, l) => acc + l.totalValue, 0), [lots]);
  const monthlyValue = useMemo(() => totalGlobalValue / 12, [totalGlobalValue]);

  const handleSaveLot = async () => {


     if (editingLot) {
      
      try {

        const lotData = {
          id: editingLot.id,
          nome: lotForm.name,
          descricao: lotForm.descricao,
          oportunidade_id: opportunityId,
          grupo_id: lotForm.category
        }
        console.log(editingLot)
        console.log(lotData)
        await updateLot.mutateAsync(lotData as any);

      } catch (error) {
        console.error('Error ao atualizar lote:', error);
        toast.error('Erro ao atualizar item');
      }

    } else {
              
      

      try {

        const lotData = {
         
          nome: lotForm.name,
          descricao: lotForm.descricao,
          oportunidade_id: opportunityId,
          grupo_id: lotForm.category
        }
        console.log(editingLot)
        console.log(lotData)

        await createLot.mutateAsync(lotData as any);

      } catch (error) {
        console.error('Error creating lot:', error);
        toast.error('Erro ao criar oportunidade');
      }
    }
      if (editingLot) {
      setLots(lots.map(l => l.id === editingLot.id ? { ...l, ...lotForm } : l));
    } else {
      const newLot = {
        id: `lot-${Date.now()}`,
        ...lotForm,
        totalValue: 0,
        items: []
      };
      setLots([...lots, newLot]);
    }
    
    setIsLotDialogOpen(false);
  };

  const handleDeleteLot = async(lotId: string) => {
    try {
      await deleteLot.mutateAsync(lotId as any);

    } catch (error) {
      console.error('Error delete item:', error);
      toast.error('Erro ao criar oportunidade');
    }

    setLots(lots.filter(l => l.id !== lotId));

    
  };

  const handleSaveItem = async () => {
    const totalValue = Number(itemForm.quantidade) * Number(itemForm.valor_unitario);

    if (editingItem) {
      
      try {

        if (!itemForm.nome || !itemForm.quantidade) {
          toast.error('nome e quantidade são obrigatórios');
          return;
        }

      

        const itemData = {
          ...itemForm,
          lote_id: selectedLotId,
          id: editingItem.id
        }
        console.log(editingItem)
        console.log(itemData)

        await updateItem.mutateAsync(itemData as any);

      } catch (error) {
        console.error('Error creating item:', error);
        toast.error('Erro ao atualizar item');
      }

    } else {
      try {

        if (!itemForm.nome || !itemForm.quantidade) {
          toast.error('nome e quantidade são obrigatórios');
          return;
        }

        const itemData = {
          ...itemForm,
          lote_id: selectedLotId
        }

        await createItem.mutateAsync(itemData as any);

      } catch (error) {
        console.error('Error creating item:', error);
        toast.error('Erro ao criar oportunidade');
      }
    }



    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === selectedLotId) {
        let updatedItems;
        if (editingItem) {
          updatedItems = lot.items.map(i => i.id === editingItem.id ? { ...i, ...itemForm, totalValue } : i);
        } else {
          const newItem: Item = {
            id: `item-${Date.now()}`,
            ...itemForm,
            totalValue,
            lote_id: lot.id
          };
          updatedItems = [...lot.items, newItem];
        }
        return {
          ...lot,
          items: updatedItems,
          totalValue: updatedItems.reduce((sum, i) => sum + i.totalValue, 0)
        };
      }
      return lot;
    }));
    setIsItemDialogOpen(false);
  };

  const handleDeleteItem = async (lotId: string, itemId: string) => {

    try {
      await deleteItem.mutateAsync(itemId as any);

    } catch (error) {
      console.error('Error delete item:', error);
      toast.error('Erro ao criar oportunidade');
    }
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id === lotId) {
        const filtered = lot.items.filter(i => i.id !== itemId);
        return { ...lot, items: filtered, totalValue: filtered.reduce((s, i) => s + i.totalValue, 0) };
      }
      return lot;
    }));
  };

  if (loadLotes.isLoading && !hasInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm text-slate-500 font-medium">A carregar estrutura de lotes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto animate-in fade-in duration-500">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-blue-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-700">
              {totalGlobalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Valor Global Estimado</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-700">
              {monthlyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Média Mensal (12 Meses)</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-slate-500 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{lots.length}</div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Total de Lotes Ativos</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800">Composição da Proposta</h3>
          <p className="text-sm text-slate-500">Gestão detalhada de itens por categoria de serviço</p>
        </div>
        <Button onClick={() => { setEditingLot(null); setLotForm({ name: '', category: '', descricao: '' }); setIsLotDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lote
        </Button>
      </div>


      <div className="space-y-6">
        {lots.map((lot) => (
          <Card key={lot.id} className="shadow-sm overflow-hidden border-slate-200">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 py-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm border">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">{lot.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 font-medium">{lot.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Total do Lote</p>
                    <p className="text-lg font-black text-blue-700">
                      {lot.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingLot(lot); setLotForm({ name: lot.name, category: lot.category, descricao: lot.descricao }); setIsLotDialogOpen(true); }}>
                      <Edit className="w-4 h-4 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteLot(lot.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Itens e Insumos</h4>
                <Button size="sm" variant="outline" className="h-8 text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => { setSelectedLotId(lot.id); setEditingItem(null); setItemForm({ nome: '', quantidade: 1, unidade_id: 'Unidade', valor_unitario: 0 }); setIsItemDialogOpen(true); }}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Adicionar Item
                </Button>
              </div>

              {lot.items.length > 0 ? (
                <div className="border rounded-lg overflow-hidden border-slate-100">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="text-xs font-bold uppercase">Nome</TableHead>
                        <TableHead className="text-center w-20 text-xs font-bold uppercase">Qtd</TableHead>

                        <TableHead className="text-xs font-bold uppercase">Unitário</TableHead>
                        <TableHead className="text-right text-xs font-bold uppercase">Total</TableHead>
                        <TableHead className="text-right w-24 text-xs font-bold uppercase">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lot.items.map((item) => (
                        <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-medium text-slate-700">{item.nome}</TableCell>
                            <TableCell className="text-center text-slate-600 font-mono">{item.quantidade}</TableCell>
                          <TableCell className="text-slate-600">{item.valor_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell className="text-right font-bold text-slate-800">
                            {item.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
                                setSelectedLotId(lot.id);
                                setEditingItem(item);
                                setItemForm({ nome: item.nome, quantidade: item.quantidade, unidade_id: String(item.unidade_id), valor_unitario: item.valor_unitario });
                                setIsItemDialogOpen(true);
                              }}>
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400" onClick={() => handleDeleteItem(lot.id, item.id)}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/30 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm italic">
                  Este lote ainda não possui itens. Clique em "Adicionar Item" para iniciar a composição.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>




      <Dialog open={isLotDialogOpen} onOpenChange={setIsLotDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-xl font-bold">{editingLot ? 'Atualizar Lote' : 'Criar Novo Lote'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Identificação do Lote</Label>
              <Input placeholder="Ex: Lote 3" value={lotForm.name} onChange={e => setLotForm({ ...lotForm, name: e.target.value })} />
            </div>
               <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Descrição do Lote</Label>
              <Input placeholder="Ex: Equipamentos de Rede" value={lotForm.descricao} onChange={e => setLotForm({ ...lotForm, descricao: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Segmento / Categoria</Label>
              <Select value={lotForm.category} onValueChange={v => setLotForm({ ...lotForm, category: v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecione o grupo" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setIsLotDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveLot} disabled={!lotForm.name} className="bg-blue-600 hover:bg-blue-700">
                {editingLot ? 'Guardar Alterações' : 'Confirmar Criação'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-xl font-bold">{editingItem ? 'Editar Detalhes do Item' : 'Novo Item para o Lote'}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Nome ou Descrição Curta</Label>
              <Input placeholder="Ex: Licença Microsoft 365" value={itemForm.nome} onChange={e => setItemForm({ ...itemForm, nome: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Quantidade</Label>
                <Input type="number" min="1" value={itemForm.quantidade} onChange={e => setItemForm({ ...itemForm, quantidade: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">Unidade de Medida</Label>
                <Select value={itemForm.unidade_id} onValueChange={v => setItemForm({ ...itemForm, unidade_id: v })}>
                  <SelectTrigger className='w-full'><SelectValue placeholder="Selecione a unidade" /></SelectTrigger>
                  <SelectContent>{units.map(u => <SelectItem key={u.id} value={u.id}>{u.descricao}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Valor Unitário Bruto (R$)</Label>
              <Input type="number" step="0.01" value={itemForm.valor_unitario} onChange={e => setItemForm({ ...itemForm, valor_unitario: Number(e.target.value) })} />
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center shadow-inner">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Subtotal do Item</span>
                <span className="text-xs text-slate-500 italic">Qtd × Unitário</span>
              </div>
              <span className="text-xl font-black text-slate-800">
                {(itemForm.quantidade * itemForm.valor_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setIsItemDialogOpen(false)}>Descartar</Button>
              <Button onClick={handleSaveItem} disabled={!itemForm.nome} className="bg-emerald-600 hover:bg-emerald-700">
                {editingItem ? 'Atualizar Item' : 'Adicionar ao Lote'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}