
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, MapPin, FileText, DollarSign } from "lucide-react";
import { useOrgaoOportunidades, OrgaoPublico } from "@/hooks/useOrgaosPublicos";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrgaoDetailModalProps {
  orgao: OrgaoPublico | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OrgaoDetailModal({
  orgao,
  open,
  onOpenChange,
}: OrgaoDetailModalProps) {
  const { data: oportunidades, isLoading } = useOrgaoOportunidades(orgao?.id || 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (!orgao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={orgao.logo_orgao || ""} />
              <AvatarFallback className="bg-purple-100 text-purple-700">
                {orgao.logo_orgao ? (
                  <Building2 className="w-6 h-6" />
                ) : (
                  getInitials(orgao.nome)
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{orgao.nome}</h2>
              <p className="text-sm text-gray-500">{orgao.sigla}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Órgão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Oportunidades</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{orgao.oportunidades_count}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Projetos</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{orgao.projetos_count}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Valor Total</span>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(orgao.valor_total_oportunidades)}
              </p>
            </div>
          </div>

          {/* Lista de Oportunidades */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Oportunidades</h3>
            
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Processo</TableHead>
                      <TableHead>Objeto</TableHead>
                      <TableHead>Modalidade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Abertura</TableHead>
                      <TableHead>Entrega</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {oportunidades?.map((oportunidade: any) => (
                      <TableRow key={oportunidade.id}>
                        <TableCell className="font-mono text-sm">
                          {oportunidade.numero_processo}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="line-clamp-2 text-sm">
                            {oportunidade.objeto}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {oportunidade.modalidades?.nome || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>
                            {oportunidade.status_oportunidade?.nome || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(oportunidade.data_abertura)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(oportunidade.data_entrega)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(oportunidade.valor_total || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
