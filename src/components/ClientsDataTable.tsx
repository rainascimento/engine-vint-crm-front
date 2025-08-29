
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";
import { Cliente } from "@/hooks/useClients";

interface ClientsDataTableProps {
  clients: Cliente[];
  onRowClick: (client: Cliente) => void;
}

export default function ClientsDataTable({ 
  clients, 
  onRowClick 
}: ClientsDataTableProps) {
  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Interação</TableHead>
            <TableHead>Contato</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(client)}
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={client.logo_url || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {client.logo_url ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        getInitials(client.nome)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {client.nome}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {client.email_contato}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm">
                  {client.cnpj || "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {client.status_cliente || "N/A"}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(client.data_ultima_interacao)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{client.telefone_contato || "N/A"}</div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
