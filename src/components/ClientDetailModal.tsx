
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Cliente } from "@/hooks/useClients";

interface ClientDetailModalProps {
  client: Cliente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetailModal({
  client,
  open,
  onOpenChange,
}: ClientDetailModalProps) {
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

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={client.logo_url || ""} />
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {client.logo_url ? (
                  <Building2 className="w-6 h-6" />
                ) : (
                  getInitials(client.nome)
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{client.nome}</h2>
              <Badge variant="outline">{client.status_cliente || "N/A"}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-sm text-gray-600">{client.email_contato || "N/A"}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Telefone</span>
              </div>
              <p className="text-sm text-gray-600">{client.telefone_contato || "N/A"}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Endereço</span>
            </div>
            <p className="text-sm text-gray-600">{client.endereco || "N/A"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Data de Criação</span>
              </div>
              <p className="text-sm text-gray-600">{formatDate(client.data_criacao)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Última Interação</span>
              </div>
              <p className="text-sm text-gray-600">{formatDate(client.data_ultima_interacao)}</p>
            </div>
          </div>

          {client.cnpj && (
            <div className="space-y-2">
              <span className="text-sm font-medium">CNPJ</span>
              <p className="text-sm text-gray-600 font-mono">{client.cnpj}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
