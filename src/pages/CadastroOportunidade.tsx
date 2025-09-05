import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import EtapaIdentificacao from '@/components/oportunidade/EtapaIdentificacao';
import EtapaCategorizacao from '@/components/oportunidade/EtapaCategorizacao';
import EtapaGruposLotesItens from '@/components/oportunidade/EtapaLotesItens';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

type GrupoForm = {
  id?: string;
  nome: string;
  descricao?: string;
  lotes: Array<{
    id?: string;
    nome: string;
    descricao?: string;
    itens: Array<{
      id?: string;
      nome: string;          // usado no POST
      unidadeId?: string;    // select de unidades
      valorUnitario: number; // usado no POST
      quantidade?: number;   // só para cálculos no front (não vai no POST)
    }>;
  }>;
};

interface OportunidadeData {
  identificacao: {
    numeroProcesso: string;
    orgao: string;
    estado: string;
    setor: string;
    mercado: string;
    valorEstimado: string;
    modalidade: string;
    portalCompras: string;
    dataAbertura: string;
    dataEntrega: string;
    objeto: string;
    uasg: string;
    esfera: string;
    status: string;
    pipeline: string;
  };
  grupos: GrupoForm[];
  categorias: string[]; // IDs das categorias
  observacoes: string;
}

const etapas = [
  { id: 1, nome: 'Identificação', desc: 'Dados básicos da oportunidade' },
  { id: 2, nome: 'Grupos • Lotes • Itens', desc: 'Estruture os grupos e seus lotes/itens' },
  { id: 3, nome: 'Categorização', desc: 'Classificação da oportunidade' }
];

const CadastroOportunidade = () => {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [dadosOportunidade, setDadosOportunidade] = useState<OportunidadeData>({
    identificacao: {
      numeroProcesso: '',
      orgao: '',
      estado: '',
      setor: '',
      mercado: '',
      valorEstimado: '',
      modalidade: '',
      portalCompras: '',
      dataAbertura: '',
      dataEntrega: '',
      objeto: '',
      uasg: '',
      esfera: '',
      status: '',
      pipeline: ''
    },
    grupos: [],
    categorias: [],
    observacoes: ''
  });

  const { toast } = useToast();

  const atualizarDados = (secao: keyof OportunidadeData, dados: any) => {
    setDadosOportunidade(prev => ({ ...prev, [secao]: dados }));
  };

  const validarEtapaAtual = () => {
    switch (etapaAtual) {
      case 1: {
        const { identificacao } = dadosOportunidade;
        const obrig = ['numeroProcesso', 'orgao', 'valorEstimado', 'modalidade', 'dataAbertura', 'dataEntrega', 'objeto'];
        const vazios = obrig.filter((k) => !identificacao[k as keyof typeof identificacao]);
        if (vazios.length) {
          toast({
            title: 'Campos obrigatórios não preenchidos',
            description: 'Preencha todos os campos obrigatórios antes de continuar.',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      case 2: {
        if (dadosOportunidade.grupos.length === 0) {
          toast({
            title: 'Nenhum grupo cadastrado',
            description: 'Adicione pelo menos um grupo com seus lotes/itens.',
            variant: 'destructive'
          });
          return false;
        }
        // pode validar se há pelo menos 1 lote em algum grupo etc.
        return true;
      }
      case 3: {
        if (dadosOportunidade.categorias.length === 0) {
          toast({
            title: 'Nenhuma categoria selecionada',
            description: 'Selecione ao menos uma categoria.',
            variant: 'destructive'
          });
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const proximaEtapa = () => {
    if (validarEtapaAtual() && etapaAtual < 3) {
      setEtapaAtual(e => e + 1);
      toast({
        title: 'Etapa avançada',
        description: `Você está agora na etapa: ${etapas[etapaAtual].nome}`
      });
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) setEtapaAtual(e => e - 1);
  };

  const salvarOportunidade = async () => {
    if (!validarEtapaAtual()) return;
    setIsSaving(true);

    try {
      const { identificacao, grupos, categorias, observacoes } = dadosOportunidade;

      // 1) OPORTUNIDADE
      const oportunidadePayload: any = {
        numero_processo: identificacao.numeroProcesso,
        orgao_id: parseInt(identificacao.orgao, 10),
        modalidade_id: parseInt(identificacao.modalidade, 10),
        portal_id: identificacao.portalCompras ? parseInt(identificacao.portalCompras, 10) : null,
        data_abertura: identificacao.dataAbertura,
        data_entrega: identificacao.dataEntrega,
        objeto: identificacao.objeto,
        valor_estimado: identificacao.valorEstimado ? Number(identificacao.valorEstimado) : null,
        uasg: identificacao.uasg || null,
        uf: identificacao.estado || null,
        esfera_id: identificacao.esfera ? parseInt(identificacao.esfera, 10) : null,
        mercado_id: identificacao.mercado ? parseInt(identificacao.mercado, 10) : null,
        setor_id: identificacao.setor ? parseInt(identificacao.setor, 10) : null,
        status_id: identificacao.status ? parseInt(identificacao.status, 10) : null,
        fase_pipeline_id: identificacao.pipeline ? parseInt(identificacao.pipeline, 10) : null,
        observacoes: observacoes || null
      };

      const oppRes = await api.post('/oportunidades', oportunidadePayload);
      const oportunidadeId: number = oppRes?.data?.id ?? oppRes?.id;
      if (!oportunidadeId) throw new Error('Não foi possível obter o ID da oportunidade criada.');

      // 2) GRUPOS → LOTES → ITENS
      for (const grupo of grupos) {
        // 2.1 Grupo
        const grupoPayload = {
         // id: 0, // se o back gera ID, pode enviar 0 ou omitir
          oportunidade_id: oportunidadeId,
          nome: grupo.nome,
          descricao: grupo.descricao || ''
        };
        console.log('Grupo criado:', grupoPayload);

        const gRes = await api.post('/grupo', grupoPayload);
        console.log('Resposta grupo:', gRes);
        const grupoId: number = gRes?.data?.id ?? gRes?.id;
        if (!grupoId) throw new Error('Falha ao criar grupo.');

        // 2.2 Lotes do Grupo
        for (const lote of grupo.lotes) {
          const lotePayload = {
           // id: 0,
            oportunidade_id: oportunidadeId, // exigido pelo seu body
            nome: lote.nome,
            descricao: lote.descricao || '', // *** CORRETO: 'descricao'
            grupo_id: grupoId
          };
          const lRes = await api.post('/lotes', lotePayload);
          const loteId: number = lRes?.data?.id ?? lRes?.id;
          if (!loteId) throw new Error('Falha ao criar lote.');

          // 2.3 Itens do Lote
          for (const item of lote.itens) {
            const itemPayload = {
             // id: 0,
              lote_id: loteId,
              nome: item.nome, // o form já guarda como 'nome' no componente de grupos
              unidade_id: item.unidadeId ? parseInt(item.unidadeId, 10) : null,
              valor_unitario: item.valorUnitario ?? 0
            };
            await api.post('/itens', itemPayload);
          }
        }
      }

      // 3) Categorias
      for (const cat of categorias) {
        await api.post('/oportunidade_categoria', {
          oportunidade_id: oportunidadeId,
          categoria_id: parseInt(cat, 10)
        });
      }

      toast({
        title: 'Oportunidade salva com sucesso!',
        description: 'Estrutura completa gravada (oportunidade, grupos, lotes, itens e categorias).'
      });

      // Redirecione/limpe se quiser:
      // window.location.href = '/oportunidades';
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
    if (confirm('Cancelar o cadastro? Os dados serão perdidos.')) {
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
          <EtapaGruposLotesItens
            grupos={dadosOportunidade.grupos}
            onGruposChange={(grupos) => atualizarDados('grupos', grupos)}
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
                      ${etapaAtual >= etapa.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
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
                  <div className={`flex-1 h-px mx-4 mt-5 ${etapaAtual > etapa.id ? 'bg-primary' : 'bg-muted'}`} />
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
          <CardContent>{renderizarEtapa()}</CardContent>
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
              <Button onClick={salvarOportunidade} className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700" disabled={isSaving}>
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

