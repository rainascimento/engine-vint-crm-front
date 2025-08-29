
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

interface Item {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitValue: number;
  totalValue: number;
}

interface Lot {
  id: string;
  name: string;
  category: string;
  items: Item[];
  totalValue: number;
}

const categories = ['JAVA', '.NET', 'CLOUD', 'MOBILE', 'BI', 'DevOps', 'Infraestrutura'];
const units = ['Unidade', 'Hora', 'Mês', 'Pessoa/Mês', 'Licença'];

export default function LotsAndItems() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLotDialogOpen, setIsLotDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [selectedLotId, setSelectedLotId] = useState<string>('');
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newLot, setNewLot] = useState({ name: '', category: '' });
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unit: 'Unidade',
    unitValue: 0
  });

  const calculateTotalValue = () => {
    return lots.reduce((total, lot) => total + lot.totalValue, 0);
  };

  const calculateMonthlyValue = (months = 12) => {
    return calculateTotalValue() / months;
  };

  const addLot = () => {
    const lot: Lot = {
      id: Date.now().toString(),
      name: newLot.name,
      category: newLot.category,
      items: [],
      totalValue: 0
    };
    setLots([...lots, lot]);
    setNewLot({ name: '', category: '' });
    setIsLotDialogOpen(false);
  };

  const updateLot = () => {
    if (!editingLot) return;
    setLots(lots.map(lot => 
      lot.id === editingLot.id 
        ? { ...editingLot, name: newLot.name, category: newLot.category }
        : lot
    ));
    setEditingLot(null);
    setNewLot({ name: '', category: '' });
    setIsLotDialogOpen(false);
  };

  const deleteLot = (lotId: string) => {
    setLots(lots.filter(lot => lot.id !== lotId));
  };

  const addItem = () => {
    const totalValue = newItem.quantity * newItem.unitValue;
    const item: Item = {
      id: Date.now().toString(),
      description: newItem.description,
      quantity: newItem.quantity,
      unit: newItem.unit,
      unitValue: newItem.unitValue,
      totalValue
    };

    setLots(lots.map(lot => {
      if (lot.id === selectedLotId) {
        const updatedItems = [...lot.items, item];
        const lotTotal = updatedItems.reduce((sum, item) => sum + item.totalValue, 0);
        return { ...lot, items: updatedItems, totalValue: lotTotal };
      }
      return lot;
    }));

    setNewItem({ description: '', quantity: 1, unit: 'Unidade', unitValue: 0 });
    setIsItemDialogOpen(false);
  };

  const updateItem = () => {
    if (!editingItem) return;
    const totalValue = newItem.quantity * newItem.unitValue;
    const updatedItem = {
      ...editingItem,
      description: newItem.description,
      quantity: newItem.quantity,
      unit: newItem.unit,
      unitValue: newItem.unitValue,
      totalValue
    };

    setLots(lots.map(lot => {
      if (lot.id === selectedLotId) {
        const updatedItems = lot.items.map(item => 
          item.id === editingItem.id ? updatedItem : item
        );
        const lotTotal = updatedItems.reduce((sum, item) => sum + item.totalValue, 0);
        return { ...lot, items: updatedItems, totalValue: lotTotal };
      }
      return lot;
    }));

    setEditingItem(null);
    setNewItem({ description: '', quantity: 1, unit: 'Unidade', unitValue: 0 });
    setIsItemDialogOpen(false);
  };

  const deleteItem = (lotId: string, itemId: string) => {
    setLots(lots.map(lot => {
      if (lot.id === lotId) {
        const updatedItems = lot.items.filter(item => item.id !== itemId);
        const lotTotal = updatedItems.reduce((sum, item) => sum + item.totalValue, 0);
        return { ...lot, items: updatedItems, totalValue: lotTotal };
      }
      return lot;
    }));
  };

  const openEditLot = (lot: Lot) => {
    setEditingLot(lot);
    setNewLot({ name: lot.name, category: lot.category });
    setIsLotDialogOpen(true);
  };

  const openEditItem = (lotId: string, item: Item) => {
    setSelectedLotId(lotId);
    setEditingItem(item);
    setNewItem({
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitValue: item.unitValue
    });
    setIsItemDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">R$ {calculateTotalValue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Valor Global</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">R$ {calculateMonthlyValue().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Valor Mensal (12 meses)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{lots.length}</div>
            <p className="text-xs text-muted-foreground">Total de Lotes</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Lot Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lotes e Itens</h3>
        <Dialog open={isLotDialogOpen} onOpenChange={setIsLotDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {setEditingLot(null); setNewLot({ name: '', category: '' });}}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Lote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLot ? 'Editar Lote' : 'Novo Lote'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lotName">Nome do Lote</Label>
                <Input
                  id="lotName"
                  value={newLot.name}
                  onChange={(e) => setNewLot({ ...newLot, name: e.target.value })}
                  placeholder="Ex: Lote 01 - Desenvolvimento"
                />
              </div>
              <div>
                <Label htmlFor="lotCategory">Categoria</Label>
                <Select value={newLot.category} onValueChange={(value) => setNewLot({ ...newLot, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLotDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={editingLot ? updateLot : addLot}>
                  {editingLot ? 'Atualizar' : 'Criar Lote'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lots */}
      <div className="space-y-4">
        {lots.map((lot) => (
          <Card key={lot.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <CardTitle className="text-lg">{lot.name}</CardTitle>
                  <Badge variant="secondary">{lot.category}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">
                    R$ {lot.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => openEditLot(lot)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Lote</AlertDialogTitle>
                        <AlertDialogDescription>
                          {lot.items.length > 0 
                            ? `Este lote possui ${lot.items.length} item(ns). Todos os itens também serão excluídos. Deseja continuar?`
                            : 'Tem certeza que deseja excluir este lote?'
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteLot(lot.id)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Itens do Lote</h4>
                <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedLotId(lot.id);
                        setEditingItem(null);
                        setNewItem({ description: '', quantity: 1, unit: 'Unidade', unitValue: 0 });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="itemDescription">Descrição</Label>
                        <Input
                          id="itemDescription"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          placeholder="Descrição do item"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="itemQuantity">Quantidade</Label>
                          <Input
                            id="itemQuantity"
                            type="number"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemUnit">Unidade</Label>
                          <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="itemUnitValue">Valor Unitário</Label>
                        <Input
                          id="itemUnitValue"
                          type="number"
                          step="0.01"
                          value={newItem.unitValue}
                          onChange={(e) => setNewItem({ ...newItem, unitValue: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Valor Total</Label>
                        <div className="text-lg font-bold">
                          R$ {(newItem.quantity * newItem.unitValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsItemDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={editingItem ? updateItem : addItem}>
                          {editingItem ? 'Atualizar' : 'Adicionar'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {lot.items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Valor Unit.</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lot.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>R$ {item.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditItem(lot.id, item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteItem(lot.id, item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhum item cadastrado neste lote
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {lots.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum lote cadastrado</p>
              <p className="text-sm text-gray-400">Clique em "Adicionar Lote" para começar</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
