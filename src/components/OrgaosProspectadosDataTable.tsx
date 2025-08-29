
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { OrgaoPublico } from "@/hooks/useOrgaosPublicos";

interface OrgaosProspectadosDataTableProps {
  orgaos: OrgaoPublico[];
  onRowClick: (orgao: OrgaoPublico) => void;
}

export default function OrgaosProspectadosDataTable({ 
  orgaos, 
  onRowClick 
}: OrgaosProspectadosDataTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getInitials = (nome: string) => {
    return nome
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Órgão</TableHead>
            <TableHead>Sigla</TableHead>
            <TableHead className="text-center">Oportunidades</TableHead>
            <TableHead className="text-center">Projetos</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orgaos.map((orgao) => (
            <TableRow 
              key={orgao.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(orgao)}
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={orgao.logo_orgao || ""} />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {orgao.logo_orgao ? (
                        <Building2 className="w-5 h-5" />
                      ) : (
                        getInitials(orgao.nome)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {orgao.nome}
                    </div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {orgao.email_institucional}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono">
                  {orgao.sigla}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  {orgao.oportunidades_count}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  {orgao.projetos_count}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatCurrency(orgao.valor_total_oportunidades)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
