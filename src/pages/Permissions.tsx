
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Shield, Users, User, Settings } from 'lucide-react';

const mockUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@empresa.com",
    role: "Analista",
    department: "Pré-vendas",
    status: "Ativo",
    lastAccess: "2024-01-10"
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@empresa.com",
    role: "Gestor",
    department: "Jurídico",
    status: "Ativo",
    lastAccess: "2024-01-09"
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos.oliveira@empresa.com",
    role: "Diretor",
    department: "Comercial",
    status: "Ativo",
    lastAccess: "2024-01-10"
  }
];

const mockRoles = [
  {
    id: 1,
    name: "Administrador",
    description: "Acesso total ao sistema",
    usersCount: 2,
    permissions: ["create", "read", "update", "delete", "admin"]
  },
  {
    id: 2,
    name: "Gestor",
    description: "Acesso de gestão às oportunidades",
    usersCount: 5,
    permissions: ["create", "read", "update", "manage_team"]
  },
  {
    id: 3,
    name: "Analista",
    description: "Acesso básico de análise",
    usersCount: 15,
    permissions: ["read", "update"]
  },
  {
    id: 4,
    name: "Consulta",
    description: "Apenas visualização",
    usersCount: 8,
    permissions: ["read"]
  }
];

const modules = [
  { id: "opportunities", name: "Oportunidades", permissions: ["create", "read", "update", "delete"] },
  { id: "opinions", name: "Pareceres", permissions: ["create", "read", "update", "delete"] },
  { id: "documents", name: "Documentos", permissions: ["create", "read", "update", "delete"] },
  { id: "intelligence", name: "Inteligência", permissions: ["create", "read", "update", "delete"] },
  { id: "reports", name: "Relatórios", permissions: ["read", "export"] },
  { id: "admin", name: "Administração", permissions: ["read", "update", "manage_users"] }
];

export default function Permissions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Permissões</h1>
            <p className="text-muted-foreground">Configure permissões de acesso e perfis de usuário</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="roles">Perfis</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
          </TabsList>

          {/* Aba Usuários */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>Gerencie usuários e suas permissões individuais</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do novo usuário
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nome
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          E-mail
                        </Label>
                        <Input id="email" type="email" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                          Perfil
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="manager">Gestor</SelectItem>
                            <SelectItem value="analyst">Analista</SelectItem>
                            <SelectItem value="viewer">Consulta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                          Departamento
                        </Label>
                        <Input id="department" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsDialogOpen(false)}>Adicionar Usuário</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-500">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.lastAccess).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Perfis */}
          <TabsContent value="roles">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Perfis de Acesso</CardTitle>
                    <CardDescription>Configure perfis e suas permissões</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Perfil
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {mockRoles.map((role) => (
                      <Card key={role.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold">{role.name}</h3>
                              <p className="text-sm text-muted-foreground">{role.description}</p>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="text-sm">{role.usersCount} usuários</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label className="text-sm font-medium">Permissões:</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {role.permissions.map((permission) => (
                                <Badge key={permission} variant="outline">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Módulos */}
          <TabsContent value="modules">
            <Card>
              <CardHeader>
                <CardTitle>Permissões por Módulo</CardTitle>
                <CardDescription>Configure permissões específicas para cada módulo do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {modules.map((module) => (
                    <Card key={module.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">{module.name}</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mockRoles.map((role) => (
                              <div key={role.id} className="space-y-2">
                                <Label className="font-medium">{role.name}</Label>
                                <div className="space-y-2">
                                  {module.permissions.map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`${module.id}-${role.id}-${permission}`}
                                        defaultChecked={role.permissions.includes(permission)}
                                      />
                                      <Label 
                                        htmlFor={`${module.id}-${role.id}-${permission}`}
                                        className="text-sm"
                                      >
                                        {permission}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
