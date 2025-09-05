import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useParametersList } from '@/hooks/useParameters'
import { useOrgaosPublicos } from '@/hooks/useOrgaosPublicos'

interface IdentificacaoData {
  //titulo: string
  numeroProcesso: string
  orgao: string             // agora guarda o ID do órgão (string)
  estado: string            // UF (mantido estático)
  setor: string             // ID de setores (string)
  mercado: string           // ID de mercados (string)
  valorEstimado: string
  modalidade: string        // ID de modalidades (string)
  portalCompras: string     // ID de portais_compra (string)
  dataAbertura: string
  dataEntrega: string
  objeto: string
  uasg: string
  esfera: string            // ID de esferas_administrativas (string)
  status: string            // ID de status_oportunidade (string)
  pipeline: string          // ID de fases_pipeline (string)
}

interface EtapaIdentificacaoProps {
  dados: IdentificacaoData
  onDadosChange: (dados: IdentificacaoData) => void
}

const EtapaIdentificacao: React.FC<EtapaIdentificacaoProps> = ({ dados, onDadosChange }) => {
  const handleChange = (campo: keyof IdentificacaoData, valor: string) => {
    onDadosChange({ ...dados, [campo]: valor })
  }

  // ---------- Carrega opções do backend ----------
  const { data: esferas = [], isLoading: loadingEsferas } = useParametersList('esferas_administrativas')
  const { data: modalidades = [], isLoading: loadingModalidades } = useParametersList('modalidades')
  const { data: mercados = [], isLoading: loadingMercados } = useParametersList('mercados')
  const { data: setores = [], isLoading: loadingSetores } = useParametersList('setores')
  const { data: portais = [], isLoading: loadingPortais } = useParametersList('portais_compra')
  const { data: statusOps = [], isLoading: loadingStatus } = useParametersList('status_oportunidade')
  const { data: fases = [], isLoading: loadingFases } = useParametersList('fases_pipeline')
  const { data: orgaos = [], isLoading: loadingOrgaos } = useOrgaosPublicos()

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Dica:</span> Campos marcados com * são obrigatórios.
          </p>
        </CardContent>
      </Card>

      {/* Objeto */}
      <div className="space-y-2">
        <Label htmlFor="objeto" className="text-sm font-medium">Descrição do Objeto</Label>
        <Textarea
          id="objeto"
          value={dados.objeto}
          onChange={(e) => handleChange('objeto', e.target.value)}
          placeholder="Descreva detalhadamente o objeto da licitação..."
          rows={4}
        />
      </div>

      {/* Processo + UASG */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numeroProcesso" className="text-sm font-medium">Número do Processo *</Label>
          <Input
            id="numeroProcesso"
            value={dados.numeroProcesso}
            onChange={(e) => handleChange('numeroProcesso', e.target.value)}
            placeholder="Ex: 123456/2024"
            className={!dados.numeroProcesso ? 'border-red-300 focus:border-red-500' : ''}
          />
          {!dados.numeroProcesso && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="uasg" className="text-sm font-medium">UASG *</Label>
          <Input
            id="uasg"
            value={dados.uasg}
            onChange={(e) => handleChange('uasg', e.target.value)}
            placeholder="Digite a UASG"
            className={!dados.uasg ? 'border-red-300 focus:border-red-500' : ''}
          />
          {!dados.uasg && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>

      {/* Órgão + Estado */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Órgão Responsável *</Label>
          <Select
            value={dados.orgao}
            onValueChange={(value) => handleChange('orgao', value)}
            disabled={loadingOrgaos}
          >
            <SelectTrigger className={!dados.orgao ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingOrgaos ? 'Carregando...' : 'Selecione o órgão'} />
            </SelectTrigger>
            <SelectContent>
              {orgaos.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">Sem órgãos</div>}
              {orgaos.map((o: any) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.sigla ? `${o.nome} (${o.sigla})` : o.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.orgao && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Estado *</Label>
          <Select value={dados.estado} onValueChange={(value) => handleChange('estado', value)}>
            <SelectTrigger className={!dados.estado ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {[
                ['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],['BA','Bahia'],
                ['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],['GO','Goiás'],
                ['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],['MG','Minas Gerais'],
                ['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],['PE','Pernambuco'],['PI','Piauí'],
                ['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],['RS','Rio Grande do Sul'],
                ['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],['SP','São Paulo'],
                ['SE','Sergipe'],['TO','Tocantins'],
              ].map(([uf, nome]) => (
                <SelectItem key={uf} value={uf}>{nome} ({uf})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.estado && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>

      {/* Valor + Esfera */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Valor Estimado (R$) *</Label>
          <Input
            type="text"
            value={dados.valorEstimado}
            onChange={(e) => handleChange('valorEstimado', e.target.value)}
            placeholder="0,00"
            className={!dados.valorEstimado ? 'border-red-300 focus:border-red-500' : ''}
          />
          {!dados.valorEstimado && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Esfera *</Label>
          <Select
            value={dados.esfera}
            onValueChange={(value) => handleChange('esfera', value)}
            disabled={loadingEsferas}
          >
            <SelectTrigger className={!dados.esfera ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingEsferas ? 'Carregando...' : 'Selecione a esfera'} />
            </SelectTrigger>
            <SelectContent>
              {esferas.map((e: any) => (
                <SelectItem key={e.id} value={String(e.id)}>{e.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.esfera && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>

      {/* Setor + Mercado */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Setor *</Label>
          <Select
            value={dados.setor}
            onValueChange={(value) => handleChange('setor', value)}
            disabled={loadingSetores}
          >
            <SelectTrigger className={!dados.setor ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingSetores ? 'Carregando...' : 'Selecione o setor'} />
            </SelectTrigger>
            <SelectContent>
              {setores.map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.setor && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Mercado *</Label>
          <Select
            value={dados.mercado}
            onValueChange={(value) => handleChange('mercado', value)}
            disabled={loadingMercados}
          >
            <SelectTrigger className={!dados.mercado ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingMercados ? 'Carregando...' : 'Selecione o mercado'} />
            </SelectTrigger>
            <SelectContent>
              {mercados.map((m: any) => (
                <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.mercado && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>

      {/* Modalidade + Portal */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Modalidade *</Label>
          <Select
            value={dados.modalidade}
            onValueChange={(value) => handleChange('modalidade', value)}
            disabled={loadingModalidades}
          >
            <SelectTrigger className={!dados.modalidade ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingModalidades ? 'Carregando...' : 'Selecione a modalidade'} />
            </SelectTrigger>
            <SelectContent>
              {modalidades.map((mod: any) => (
                <SelectItem key={mod.id} value={String(mod.id)}>{mod.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.modalidade && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Portal de Compras</Label>
          <Select
            value={dados.portalCompras}
            onValueChange={(value) => handleChange('portalCompras', value)}
            disabled={loadingPortais}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingPortais ? 'Carregando...' : 'Selecione o portal'} />
            </SelectTrigger>
            <SelectContent>
              {portais.map((p: any) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Datas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Data da Captura *</Label>
          <Input
            type="date"
            value={dados.dataEntrega}
            onChange={(e) => handleChange('dataEntrega', e.target.value)}
            className={!dados.dataEntrega ? 'border-red-300 focus:border-red-500' : ''}
          />
          {!dados.dataEntrega && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Data de Abertura *</Label>
          <Input
            type="date"
            value={dados.dataAbertura}
            onChange={(e) => handleChange('dataAbertura', e.target.value)}
            className={!dados.dataAbertura ? 'border-red-300 focus:border-red-500' : ''}
          />
          {!dados.dataAbertura && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>

      {/* Status + Pipeline */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status do Certame *</Label>
          <Select
            value={dados.status}
            onValueChange={(value) => handleChange('status', value)}
            disabled={loadingStatus}
          >
            <SelectTrigger className={!dados.status ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingStatus ? 'Carregando...' : 'Selecione o status'} />
            </SelectTrigger>
            <SelectContent>
              {statusOps.map((s: any) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.status && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Fase do Pipeline *</Label>
          <Select
            value={dados.pipeline}
            onValueChange={(value) => handleChange('pipeline', value)}
            disabled={loadingFases}
          >
            <SelectTrigger className={!dados.pipeline ? 'border-red-300 focus:border-red-500' : ''}>
              <SelectValue placeholder={loadingFases ? 'Carregando...' : 'Selecione a fase'} />
            </SelectTrigger>
            <SelectContent>
              {fases.map((f: any) => (
                <SelectItem key={f.id} value={String(f.id)}>{f.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!dados.pipeline && <p className="text-xs text-red-500">Este campo é obrigatório</p>}
        </div>
      </div>
    </div>
  )
}

export default EtapaIdentificacao
