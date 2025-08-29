import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Update the import path to the correct location of useParameters



//import { useParameters, type ParameterEntity, type Parameter, getEntityFields } from '@/hooks/useParameters';

//import * as React from 'react'
import { useParametersList, useParametersCrud, getEntityFields, type ParameterEntity2 } from '@/hooks/useParameters'
import { buildParameterPayload } from '@/hooks/useParameters' // arquivo do builder


type ParameterEntity = ParameterEntity2;

type Props = {
  entity: ParameterEntity
  title?: string
}

export function ParameterCRUD({ entity, title }: Props) {
  const { data, isLoading, error } = useParametersList(entity)
  const { createParameter, updateParameter, deleteParameter, isLoading: isMutating } = useParametersCrud(entity)
  const fields = getEntityFields(entity)

  const [form, setForm] = React.useState<Record<string, any>>({})
  const [editingId, setEditingId] = React.useState<number | null>(null)

  function resetForm() {
    setForm({})
    setEditingId(null)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const payload = buildParameterPayload(entity, form)
    await createParameter(payload as any)
    resetForm()
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    const payload = buildParameterPayload(entity, form)
    await updateParameter({ id: editingId, data: payload as any })
    resetForm()
  }

  if (isLoading) return <Section title={title ?? entity}><p>Carregando...</p></Section>
  if (error) return <Section title={title ?? entity}><p className="text-red-500">Erro ao carregar.</p></Section>

  return (
    <Section title={title ?? entity}>
      {/* LISTA */}
      <div className="overflow-x-auto rounded-lg border mb-4">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              {fields.map(f => (
                <th key={f} className="px-3 py-2 text-left capitalize">{f}</th>
              ))}
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row: any) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2">{row.id}</td>
                {fields.map(f => (
                  <td key={f} className="px-3 py-2">{row[f]}</td>
                ))}
                <td className="px-3 py-2 text-right space-x-2">
                  <button
                    className="px-2 py-1 rounded bg-amber-500 text-white hover:opacity-90"
                    onClick={() => {
                      setEditingId(row.id)
                      // preenche o form só com os campos relevantes desta entidade
                      const initial: Record<string, any> = {}
                      fields.forEach(f => { initial[f] = row[f] })
                      setForm(initial)
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 rounded bg-red-600 text-white hover:opacity-90"
                    disabled={isMutating}
                    onClick={() => deleteParameter(row.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={fields.length + 2}>
                  Nenhum registro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      <form onSubmit={editingId ? handleUpdate : handleCreate} className="grid gap-3 md:grid-cols-3">
        {fields.map(f => (
          <div key={f} className="flex flex-col">
            <label className="text-xs text-muted-foreground mb-1">{f.toUpperCase()}</label>
            <input
              className="rounded border px-3 py-2"
              value={form[f] ?? ''}
              onChange={(e) => setForm(prev => ({ ...prev, [f]: e.target.value }))}
              placeholder={f}
              type={f === 'sequencia' ? 'number' : 'text'}
            />
          </div>
        ))}
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90"
            disabled={isMutating}
          >
            {editingId ? 'Salvar' : 'Criar'}
          </button>
          {editingId && (
            <button
              type="button"
              className="px-3 py-2 rounded border hover:bg-muted"
              onClick={resetForm}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </Section>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}


interface ParameterCRUDProps {
  entity: ParameterEntity;
  title: string;
}
/*
export const ParameterCRUD: React.FC<ParameterCRUDProps> = ({ entity, title }) => {
  const { getParameters, createParameter, updateParameter, deleteParameter, isLoading } = useParameters();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const parameters = getParameters(entity);
  const fields = getEntityFields(entity);

  const handleCreate = async () => {
    try {
      await createParameter(entity, formData);
      toast({
        title: "Sucesso",
        description: "Parâmetro criado com sucesso!",
      });
      setIsCreateDialogOpen(false);
      setFormData({});
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar parâmetro",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingParameter) return;
    
    try {
      await updateParameter(entity, editingParameter.id, formData);
      toast({
        title: "Sucesso",
        description: "Parâmetro atualizado com sucesso!",
      });
      setIsEditDialogOpen(false);
      setEditingParameter(null);
      setFormData({});
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar parâmetro",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este parâmetro?')) return;
    
    try {
      await deleteParameter(entity, id);
      toast({
        title: "Sucesso",
        description: "Parâmetro excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir parâmetro",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (parameter: Parameter) => {
    setEditingParameter(parameter);
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field] = (parameter as any)[field] || '';
    });
    setFormData(initialData);
    setIsEditDialogOpen(true);
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      nome: 'Nome',
      url: 'URL',
      sigla: 'Sigla',
      descricao: 'Descrição'
    };
    return labels[field] || field;
  };

  const renderTableHeaders = () => {
    return (
      <TableRow>
        {fields.map(field => (
          <TableHead key={field}>{getFieldLabel(field)}</TableHead>
        ))}
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    );
  };

  const renderTableRow = (parameter: Parameter) => {
    return (
      <TableRow key={parameter.id}>
        {fields.map(field => (
          <TableCell key={field} className="font-medium">
            {(parameter as any)[field]}
          </TableCell>
        ))}
        <TableCell>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => openEditDialog(parameter)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(parameter.id)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderFormFields = () => {
    return fields.map(field => (
      <div key={field} className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={field} className="text-right">
          {getFieldLabel(field)}
        </Label>
        <Input
          id={field}
          value={formData[field] || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
          className="col-span-3"
          type={field === 'url' ? 'url' : 'text'}
          placeholder={field === 'url' ? 'https://exemplo.com' : `Digite o ${getFieldLabel(field).toLowerCase()}`}
        />
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar {title}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para criar um novo item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {renderFormFields()}
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {renderTableHeaders()}
          </TableHeader>
          <TableBody>
            {parameters.map(parameter => renderTableRow(parameter))}
          </TableBody>
        </Table>
      </CardContent>

    
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar {title}</DialogTitle>
            <DialogDescription>
              Altere os campos que deseja atualizar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {renderFormFields()}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};*/