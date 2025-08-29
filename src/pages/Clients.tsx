
import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClients } from "@/hooks/useClients";
import { useOrgaosPublicos, OrgaoPublico } from "@/hooks/useOrgaosPublicos";
import ClientsDataTable from "@/components/ClientsDataTable";
import OrgaosProspectadosDataTable from "@/components/OrgaosProspectadosDataTable";
import ClientDetailModal from "@/components/ClientDetailModal";
import OrgaoDetailModal from "@/components/OrgaoDetailModal";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedOrgao, setSelectedOrgao] = useState<OrgaoPublico | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isOrgaoModalOpen, setIsOrgaoModalOpen] = useState(false);

  const { data: clients, isLoading: isLoadingClients } = useClients();
  const { data: orgaos, isLoading: isLoadingOrgaos } = useOrgaosPublicos();

  const filteredClients = clients?.filter((client) =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrgaos = orgaos?.filter((orgao) =>
    orgao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orgao.sigla.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClientRowClick = (client: any) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleOrgaoRowClick = (orgao: OrgaoPublico) => {
    setSelectedOrgao(orgao);
    setIsOrgaoModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600">
              Gerencie seus clientes e órgãos prospectados
            </p>
          </div>

          <Link to="/clients/register">
            <Button >
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </Link>

        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Pesquisar clientes ou órgãos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clientes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="orgaos">Órgãos Prospectados</TabsTrigger>
          </TabsList>

          <TabsContent value="clientes" className="space-y-4">
            {isLoadingClients ? (
              <div className="text-center py-8">
                <p>Carregando clientes...</p>
              </div>
            ) : (
              <ClientsDataTable
                clients={filteredClients || []}
                onRowClick={handleClientRowClick}
              />
            )}
          </TabsContent>

          <TabsContent value="orgaos" className="space-y-4">
            {isLoadingOrgaos ? (
              <div className="text-center py-8">
                <p>Carregando órgãos...</p>
              </div>
            ) : (
              <OrgaosProspectadosDataTable
                orgaos={filteredOrgaos || []}
                onRowClick={handleOrgaoRowClick}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ClientDetailModal
          client={selectedClient}
          open={isClientModalOpen}
          onOpenChange={setIsClientModalOpen}
        />

        <OrgaoDetailModal
          orgao={selectedOrgao}
          open={isOrgaoModalOpen}
          onOpenChange={setIsOrgaoModalOpen}
        />
      </div>
    </Layout>
  );
}
