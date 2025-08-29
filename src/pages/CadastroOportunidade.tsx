/*
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import EtapaIdentificacao from '@/components/oportunidade/EtapaIdentificacao';
import EtapaLotesItens from '@/components/oportunidade/EtapaLotesItens';
import EtapaCategorizacao from '@/components/oportunidade/EtapaCategorizacao';
import { useToast } from '@/hooks/use-toast';

interface OportunidadeData {
  identificacao: {
    titulo: string;
    numeroProcesso: string;
    orgao: string;
    valorEstimado: string;
    modalidade: string;
    portalCompras: string;
    dataAbertura: string;
    dataEntrega: string;
    objeto: string;
  };
  lotes: Array<{
    id: string;
    nome: string;
    itens: Array<{
      id: string;
      descricao: string;
      quantidade: number;
      valorUnitario: number;
    }>;
  }>;
  categorias: string[];
  observacoes: string;
}

const etapas = [
  { id: 1, nome: 'Identificação', desc: 'Dados básicos da oportunidade' },
  { id: 2, nome: 'Lotes e Itens', desc: 'Detalhamento dos lotes' },
  { id: 3, nome: 'Categorização', desc: 'Classificação da oportunidade' }
];

const CadastroOportunidade = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dadosOportunidade, setDadosOportunidade] = useState<OportunidadeData>({
    identificacao: {
      titulo: '',
      numeroProcesso: '',
      orgao: '',
      valorEstimado: '',
      modalidade: '',
      portalCompras: '',
      dataAbertura: '',
      dataEntrega: '',
      objeto: ''
    },
    lotes: [],
    categorias: [],
    observacoes: ''
  });
  const { toast } = useToast();

  const atualizarDados = (secao: keyof OportunidadeData, dados: any) => {
    setDadosOportunidade(prev => ({
      ...prev,
      [secao]: dados
    }));
  };

  const validarEtapaAtual = () => {
    switch (etapaAtual) {
      case 1:
        const { identificacao } = dadosOportunidade;
        const camposObrigatorios = ['numeroProcesso', 'orgao', 'valorEstimado', 'modalidade', 'dataAbertura', 'dataEntrega'];
        const camposVazios = camposObrigatorios.filter(campo => !identificacao[campo as keyof typeof identificacao]);
        
        if (camposVazios.length > 0) {
          toast({
            title: "Campos obrigatórios não preenchidos",
            description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 2:
        if (dadosOportunidade.lotes.length === 0) {
          toast({
            title: "Nenhum lote cadastrado",
            description: "É necessário cadastrar pelo menos um lote para continuar.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      case 3:
        if (dadosOportunidade.categorias.length === 0) {
          toast({
            title: "Nenhuma categoria selecionada",
            description: "É necessário selecionar pelo menos uma categoria para finalizar.",
            variant: "destructive"
          });
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const proximaEtapa = () => {
    if (validarEtapaAtual() && etapaAtual < 3) {
      setEtapaAtual(etapaAtual + 1);
      toast({
        title: "Etapa avançada",
        description: `Você está agora na etapa: ${etapas[etapaAtual].nome}`
      });
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const salvarOportunidade = () => {
    if (validarEtapaAtual()) {
      console.log('Salvando oportunidade:', dadosOportunidade);
      toast({
        title: "Oportunidade salva com sucesso!",
        description: "A nova oportunidade foi cadastrada no sistema."
      });
      // Aqui implementaria a chamada para API
    }
  };

  const cancelarCadastro = () => {
    if (confirm('Tem certeza que deseja cancelar o cadastro? Todos os dados serão perdidos.')) {
      window.history.back();
    }
  };

  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <EtapaIdentificacao
            dados={dadosOportunidade.identificacao}
            onDadosChange={(dados) => atualizarDados('identificacao', dados)}
          />
        );
      case 2:
        return (
          <EtapaLotesItens
            lotes={dadosOportunidade.lotes}
            onLotesChange={(lotes) => atualizarDados('lotes', lotes)}
          />
        );
      case 3:
        return (
          <EtapaCategorizacao
            categorias={dadosOportunidade.categorias}
            observacoes={dadosOportunidade.observacoes}
            onCategoriasChange={(categorias) => atualizarDados('categorias', categorias)}
            onObservacoesChange={(observacoes) => atualizarDados('observacoes', observacoes)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
       //  Header 
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">Nova Oportunidade</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={cancelarCadastro}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>

          //Progress Steps 
          <div className="flex items-center justify-between mb-6">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${etapaAtual >= etapa.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {etapa.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${etapaAtual >= etapa.id ? 'text-primary' : 'text-muted-foreground'}`}>
                      {etapa.nome}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {etapa.desc}
                    </p>
                  </div>
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`
                      flex-1 h-px mx-4 mt-5
                      ${etapaAtual > etapa.id ? 'bg-primary' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

      // Content 
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {etapaAtual}
              </span>
              {etapas[etapaAtual - 1].nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderizarEtapa()}
          </CardContent>
        </Card>

        // Navigation 
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={etapaAtual === 1}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {etapaAtual < 3 ? (
              <Button
                onClick={proximaEtapa}
                className="flex-1 sm:flex-none"
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={salvarOportunidade}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
              >
                Salvar Oportunidade
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroOportunidade;
*/

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import EtapaIdentificacao from '@/components/oportunidade/EtapaIdentificacao';
import EtapaLotesItens from '@/components/oportunidade/EtapaLotesItens';
import EtapaCategorizacao from '@/components/oportunidade/EtapaCategorizacao';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; // axios pré-configurado apontando para http://localhost:3000/api

interface OportunidadeData {
  identificacao: {
    titulo: string;
    numeroProcesso: string;
    orgao: string;          // SUPÕE: ID de orgao (string)
    valorEstimado: string;  // "12345.67" (convertemos para número)
    modalidade: string;     // SUPÕE: ID de modalidade (string)
    portalCompras: string;  // SUPÕE: ID de portal (string)
    dataAbertura: string;   // "YYYY-MM-DD"
    dataEntrega: string;    // "YYYY-MM-DD"
    objeto: string;
    // se tiver 'uasg', 'uf', 'esfera', 'mercado', 'setor', 'status', 'pipeline', adicione aqui e no payload abaixo
  };
  lotes: Array<{
    id: string;
    nome: string;
    itens: Array<{
      id: string;
      descricao: string;
      quantidade: number;
      valorUnitario: number;
      unidadeId?: string; // se você já incluiu unidade no item
    }>;
  }>;
  categorias: string[]; // SUPÕE: IDs de categorias (string)
  observacoes: string;
}

const etapas = [
  { id: 1, nome: 'Identificação', desc: 'Dados básicos da oportunidade' },
  { id: 2, nome: 'Lotes e Itens', desc: 'Detalhamento dos lotes' },
  { id: 3, nome: 'Categorização', desc: 'Classificação da oportunidade' }
];

const CadastroOportunidade = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [dadosOportunidade, setDadosOportunidade] = useState<OportunidadeData>({
    identificacao: {
      titulo: '',
      numeroProcesso: '',
      orgao: '',
      valorEstimado: '',
      modalidade: '',
      portalCompras: '',
      dataAbertura: '',
      dataEntrega: '',
      objeto: ''
    },
    lotes: [],
    categorias: [],
    observacoes: ''
  });

  const { toast } = useToast();

  const atualizarDados = (secao: keyof OportunidadeData, dados: any) => {
    setDadosOportunidade(prev => ({
      ...prev,
      [secao]: dados
    }));
  };

  const validarEtapaAtual = () => {
    switch (etapaAtual) {
      case 1: {
        const { identificacao } = dadosOportunidade;
        const camposObrigatorios = [
          'numeroProcesso',
          'orgao',
          'valorEstimado',
          'modalidade',
          'dataAbertura',
          'dataEntrega',
          'objeto'
        ];
        const vazios = camposObrigatorios.filter(
          (campo) => !identificacao[campo as keyof typeof identificacao]
        );
        if (vazios.length > 0) {
          toast({
            title: 'Campos obrigatórios não preenchidos',
            description: 'Preencha todos os campos obrigatórios antes de continuar.',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      case 2:
        if (dadosOportunidade.lotes.length === 0) {
          toast({
            title: 'Nenhum lote cadastrado',
            description: 'Cadastre pelo menos um lote para continuar.',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      case 3:
        if (dadosOportunidade.categorias.length === 0) {
          toast({
            title: 'Nenhuma categoria selecionada',
            description: 'Selecione pelo menos uma categoria para finalizar.',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const proximaEtapa = () => {
    if (validarEtapaAtual() && etapaAtual < 3) {
      setEtapaAtual(etapaAtual + 1);
      toast({
        title: 'Etapa avançada',
        description: `Você está agora na etapa: ${etapas[etapaAtual].nome}`
      });
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

  const salvarOportunidade = async () => {
    // Valida a última etapa também
    if (!validarEtapaAtual()) return;

    setIsSaving(true);
    try {
      const { identificacao, lotes, categorias, observacoes } = dadosOportunidade;

      // 1) Cria OPORTUNIDADE
      // Ajuste o payload conforme seu backend (nomes das colunas)
      const oportunidadePayload: any = {
        numero_processo: identificacao.numeroProcesso,
        orgao_id: parseInt(identificacao.orgao, 10), // supõe id vindo como string
        modalidade_id: parseInt(identificacao.modalidade, 10),
        portal_id: identificacao.portalCompras ? parseInt(identificacao.portalCompras, 10) : null,
        data_abertura: identificacao.dataAbertura,
        data_entrega: identificacao.dataEntrega,
        objeto: identificacao.objeto,
        valor_estimado: identificacao.valorEstimado ? Number(identificacao.valorEstimado) : null,
        titulo: identificacao.titulo || null,
        observacoes: observacoes || null,
        // Se tiver no form, inclua: uasg, uf, esfera_id, mercado_id, setor_id, status_id, fase_pipeline_id etc.
      };

      const oppRes = await api.post('/oportunidades', oportunidadePayload);
      const oportunidadeId = oppRes?.id ?? oppRes?.data?.id; // dependendo de como seu api.ts retorna

      if (!oportunidadeId) {
        throw new Error('Não foi possível obter o ID da oportunidade criada.');
      }

      // 2) Cria LOTES e ITENS
      for (const lote of lotes) {
        const lotePayload = {
          oportunidade_id: oportunidadeId,
          nome: lote.nome,
          descricao: '' // opcional
        };
        const loteRes = await api.post('/lotes', lotePayload);
        const loteId = loteRes?.id ?? loteRes?.data?.id;
        if (!loteId) throw new Error('Falha ao criar lote.');

        for (const item of lote.itens) {
          const itemPayload: any = {
            lote_id: loteId,
            nome: item.descricao,        // se sua tabela "itens" tem "nome", use descrição aqui
            descricao: item.descricao,   // se sua tabela tem "descricao", preenche também
            quantidade: item.quantidade,
            valor_unitario: item.valorUnitario,
            unidade_id: item.unidadeId ? parseInt(item.unidadeId, 10) : null
          };
          await api.post('/itens', itemPayload);
        }
      }

      // 3) CATEGORIZAÇÃO (tabela oportunidade_categoria)
      // Você pode ter um endpoint bulk, mas aqui mostro 1 a 1 para clareza
      for (const cat of categorias) {
        const categoriaId = parseInt(cat, 10);
        await api.post('/oportunidade-categoria', {
          oportunidade_id: oportunidadeId,
          categoria_id: categoriaId
        });
      }

      toast({
        title: 'Oportunidade salva com sucesso!',
        description: 'Todos os dados foram registrados (oportunidade, lotes, itens e categorias).'
      });

      // Redirecionar ou limpar formulário (como preferir)
      // window.location.href = '/oportunidades'; // exemplo
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Erro ao salvar oportunidade',
        description: err?.message || 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const cancelarCadastro = () => {
    if (confirm('Tem certeza que deseja cancelar o cadastro? Todos os dados serão perdidos.')) {
      window.history.back();
    }
  };

  const renderizarEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <EtapaIdentificacao
            dados={dadosOportunidade.identificacao}
            onDadosChange={(dados) => atualizarDados('identificacao', dados)}
          />
        );
      case 2:
        return (
          <EtapaLotesItens
            lotes={dadosOportunidade.lotes}
            onLotesChange={(lotes) => atualizarDados('lotes', lotes)}
          />
        );
      case 3:
        return (
          <EtapaCategorizacao
            categorias={dadosOportunidade.categorias}
            observacoes={dadosOportunidade.observacoes}
            onCategoriasChange={(categorias) => atualizarDados('categorias', categorias)}
            onObservacoesChange={(observacoes) => atualizarDados('observacoes', observacoes)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">Nova Oportunidade</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={cancelarCadastro}
              className="text-muted-foreground hover:text-destructive"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between mb-6">
            {etapas.map((etapa, index) => (
              <div key={etapa.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${etapaAtual >= etapa.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {etapa.id}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${etapaAtual >= etapa.id ? 'text-primary' : 'text-muted-foreground'}`}>
                      {etapa.nome}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {etapa.desc}
                    </p>
                  </div>
                </div>
                {index < etapas.length - 1 && (
                  <div
                    className={`
                      flex-1 h-px mx-4 mt-5
                      ${etapaAtual > etapa.id ? 'bg-primary' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">
                {etapaAtual}
              </span>
              {etapas[etapaAtual - 1].nome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderizarEtapa()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={etapaAnterior}
            disabled={etapaAtual === 1 || isSaving}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2 w-full sm:w-auto">
            {etapaAtual < 3 ? (
              <Button onClick={proximaEtapa} className="flex-1 sm:flex-none" disabled={isSaving}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={salvarOportunidade}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar Oportunidade'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroOportunidade;
