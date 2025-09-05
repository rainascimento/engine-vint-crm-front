import { useEffect, useState } from 'react';
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
import { api } from '@/lib/api';
import { toast } from 'sonner'

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

const mockDepartments = [
  { id: 1, name: "Diretor de Negocios" },
  { id: 2, name: "Gerente de Negocios" },
  { id: 3, name: "Coordenadora de Licitações" },
  { id: 4, name: "Analista de Licitações" },
  { id: 5, name: "Arquiteto de soluções" },
  { id: 6, name: "Gerente de Delivery" },
  { id: 7, name: "Analista de pré vendas" },
  { id: 8, name: "Recursos Humanos" },
  { id: 9, name: "Aprendiz" },
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
  const [isDialogOpenEdit, setIsDialogOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Estados para os dados do novo usuário
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/usuarios');

        // Mapeia os IDs para os nomes correspondentes para exibição na tabela
        const usersWithNames = response.map(user => {
          const perfil = mockRoles.find(r => r.id === user.perfil_id);
          const departamento = mockDepartments.find(d => d.id === user.funcao_id);
          return {
            ...user,
            perfil_id: perfil ? perfil.name : 'Desconhecido',
            funcao_id: departamento ? departamento.name : 'Desconhecido'
          };
        });
        setUsers(usersWithNames);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };
    loadData();
  }, []);

  async function addUser() {
    if (!newUserName || !newUserEmail || !newUserPassword || !newUserRole || !newUserDepartment) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const userData = {
      nome_usuario: newUserName,
      email: newUserEmail,
      senha_acesso: newUserPassword,
      perfil_id: parseInt(newUserRole),
      funcao_id: parseInt(newUserDepartment),
      status_id: 1,
      ultimo_acesso: null,
      foto_avatar: null
    };

    try {
      const response = await api.post('/usuarios', userData);
      toast.message('Usuário adicionado com sucesso!');

      const newLocalUser = {
        ...response,
        perfil_id: mockRoles.find(r => r.id === parseInt(newUserRole))?.name || 'Desconhecido',
        funcao_id: mockDepartments.find(d => d.id === parseInt(newUserDepartment))?.name || 'Desconhecido'
      };

      setUsers(currentUsers => [...currentUsers, newLocalUser]);
      
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('');
      setNewUserDepartment('');
      setIsDialogOpen(false);

    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
      toast.error("Erro ao adicionar usuário. Tente novamente.");
    }
  }

  async function deleteUser(userId) {
    try {
      await api.del(`/usuarios/${userId}`);
      toast.message('Usuário deletado com sucesso');
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      toast.error("Erro ao deletar usuário. Tente novamente.");
    }
  }

  const handleEditClick = (user) => {
    // Mapeia os nomes do usuário para os IDs correspondentes antes de popular o formulário
    const userWithIds = {
      ...user,
      perfil_id: mockRoles.find(r => r.name === user.perfil_id)?.id.toString() || '',
      funcao_id: mockDepartments.find(d => d.name === user.funcao_id)?.id.toString() || '',
    };
    setEditingUser(userWithIds);
    setIsDialogOpenEdit(true);
  };

  async function editUser() {
    if (!editingUser) return;

    try {
      const { id, nome_usuario, email, perfil_id, funcao_id } = editingUser;
      
      await api.put(`/usuarios/${id}`, {
        nome_usuario,
        email,
        perfil_id: parseInt(perfil_id, 10),
        funcao_id: parseInt(funcao_id, 10),
      });

      toast.message('Usuário editado com sucesso!');

      setIsDialogOpenEdit(false);
      setEditingUser(null);
      
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      toast.error("Erro ao editar usuário. Tente novamente.");
    }
  }

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
                        <Label htmlFor="name" className="text-right">Nome</Label>
                        <Input id="name" className="col-span-3" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">E-mail</Label>
                        <Input id="email" type="email" className="col-span-3" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">Perfil</Label>
                        <Select onValueChange={setNewUserRole}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">Departamento</Label>
                        <Select onValueChange={setNewUserDepartment}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione o Departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="senha" className="text-right">Senha</Label>
                        <Input id="senha" type="password" className="col-span-3" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addUser}>Adicionar Usuário</Button>
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
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nome_usuario}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><Badge variant="outline">{user.perfil_id}</Badge></TableCell>
                        <TableCell>{user.funcao_id}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-500">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.ultimo_acesso).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => deleteUser(user.id)} variant="ghost" size="sm">
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

          {/* Dialog de edição, agora fora do map de usuários */}
          <Dialog open={isDialogOpenEdit} onOpenChange={setIsDialogOpenEdit}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
                <DialogDescription>
                  Preencha as informações do usuário
                </DialogDescription>
              </DialogHeader>
              {editingUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Nome</Label>
                    <Input 
                      id="edit-name" 
                      className="col-span-3"
                      value={editingUser.nome_usuario || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, nome_usuario: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">E-mail</Label>
                    <Input 
                      id="edit-email" 
                      type="email" 
                      className="col-span-3"
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-role" className="text-right">Perfil</Label>
                    <Select
                      value={editingUser.perfil_id || ''}
                      onValueChange={(value) => setEditingUser({ ...editingUser, perfil_id: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-department" className="text-right">Departamento</Label>
                    <Select
                      value={editingUser.funcao_id || ''}
                      onValueChange={(value) => setEditingUser({ ...editingUser, funcao_id: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione o Departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDepartments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={editUser}>Salvar Alterações</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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