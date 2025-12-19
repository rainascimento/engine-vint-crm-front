/*import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useParameters } from '@/hooks/useParameters_org';
import { useParametersList } from "@/hooks/useParameters"
import { toast } from 'sonner';

const clientFormSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome deve ter no máximo 200 caracteres'),
    sigla: z.string().min(1, 'Sigla é obrigatória').max(20, 'Sigla deve ter no máximo 20 caracteres'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório').max(18, 'CNPJ deve ter no máximo 18 caracteres'),
    esfera_adm_id: z.string().min(1, 'Esfera administrativa é obrigatória'),
    tipo_orgao_id: z.string().min(1, 'Tipo de órgão é obrigatório'),
    email_institucional: z.string().email('Email inválido').max(120, 'Email deve ter no máximo 120 caracteres'),
    telefone_geral: z.string().max(30, 'Telefone deve ter no máximo 30 caracteres').optional(),
    site_oficial: z.string().url('URL inválida').max(200, 'Site deve ter no máximo 200 caracteres').optional().or(z.literal('')),
    nome_responsavel: z.string().max(100, 'Nome do responsável deve ter no máximo 100 caracteres').optional(),
    email_responsavel: z.string().email('Email inválido').max(120, 'Email deve ter no máximo 120 caracteres').optional().or(z.literal('')),
    telefone_responsavel: z.string().max(30, 'Telefone deve ter no máximo 30 caracteres').optional(),
    status_orgao_id: z.string().min(1, 'Status do órgão é obrigatório'),
    logo_orgao: z.string().max(255, 'Logo deve ter no máximo 255 caracteres').optional()
});

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientRegistrationFormProps {
    onSubmit?: (data: ClientFormData) => void;
}

export const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ onSubmit }) => {
    const { getParameters } = useParameters();

    const esferasAdministrativas = getParameters('esferas_administrativas');
    const tiposOrgao = getParameters('tipos_orgao');
    const statusOrgao = getParameters('status_orgao');

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            nome: '',
            sigla: '',
            cnpj: '',
            esfera_adm_id: '',
            tipo_orgao_id: '',
            email_institucional: '',
            telefone_geral: '',
            site_oficial: '',
            nome_responsavel: '',
            email_responsavel: '',
            telefone_responsavel: '',
            status_orgao_id: '',
            logo_orgao: ''
        }
    });

    const handleSubmit = (data: ClientFormData) => {

        toast.success('Cliente/Órgão cadastrado com sucesso!');
        onSubmit?.(data);
        form.reset();
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Cadastro de Cliente/Órgão Público</CardTitle>
                <CardDescription>
                    Preencha os dados do cliente ou órgão público que deseja cadastrar
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                   
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações Básicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da organização" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sigla"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sigla *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sigla da organização" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cnpj"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNPJ *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="00.000.000/0000-00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="esfera_adm_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Esfera Administrativa *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a esfera" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {esferasAdministrativas.map((esfera) => (
                                                        <SelectItem key={esfera.id} value={esfera.id.toString()}>
                                                            {esfera.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo_orgao_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Órgão *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {tiposOrgao.map((tipo) => (
                                                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                                            {tipo.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status_orgao_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statusOrgao.map((status) => (
                                                        <SelectItem key={status.id} value={status.id.toString()}>
                                                            {status.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                    
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações de Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email_institucional"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Institucional *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contato@organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefone_geral"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone Geral</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(00) 0000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="site_oficial"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Site Oficial</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://www.organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                     
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações do Responsável</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nome_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Responsável</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email do Responsável</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="responsavel@organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefone_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone do Responsável</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(00) 00000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="logo_orgao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL do Logo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://exemplo.com/logo.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Limpar
                            </Button>
                            <Button type="submit">
                                Cadastrar Cliente/Órgão
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};*/

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useParametersList } from '@/hooks/useParameters'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const clientFormSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome deve ter no máximo 200 caracteres'),
    sigla: z.string().min(1, 'Sigla é obrigatória').max(20, 'Sigla deve ter no máximo 20 caracteres'),
    cnpj: z.string().min(1, 'CNPJ é obrigatório').max(18, 'CNPJ deve ter no máximo 18 caracteres'),
    esfera_adm_id: z.string().min(1, 'Esfera administrativa é obrigatória'),
    tipo_orgao_id: z.string().min(1, 'Tipo de órgão é obrigatório'),
    email_institucional: z.string().email('Email inválido').max(120, 'Email deve ter no máximo 120 caracteres'),
    telefone_geral: z.string().max(30, 'Telefone deve ter no máximo 30 caracteres').optional(),
    site_oficial: z
        .string()
        .url('URL inválida')
        .max(200, 'Site deve ter no máximo 200 caracteres')
        .optional()
        .or(z.literal('')),
    nome_responsavel: z.string().max(100, 'Nome do responsável deve ter no máximo 100 caracteres').optional(),
    email_responsavel: z
        .string()
        .email('Email inválido')
        .max(120, 'Email deve ter no máximo 120 caracteres')
        .optional()
        .or(z.literal('')),
    telefone_responsavel: z.string().max(30, 'Telefone deve ter no máximo 30 caracteres').optional(),
    status_orgao_id: z.string().min(1, 'Status do órgão é obrigatório'),
    logo_orgao: z.string().max(255, 'Logo deve ter no máximo 255 caracteres').optional(),
})

type ClientFormData = z.infer<typeof clientFormSchema>

interface ClientRegistrationFormProps {
    onSubmit?: (data: ClientFormData) => void
}

export const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ onSubmit }) => {
    // Carrega opções do backend
    const { data: esferas = [], isLoading: loadingEsferas } = useParametersList('esferas_administrativas')
    const { data: tipos = [], isLoading: loadingTipos } = useParametersList('tipos_orgao')
    const { data: status = [], isLoading: loadingStatus } = useParametersList('status_orgao')

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientFormSchema),
        defaultValues: {
            nome: '',
            sigla: '',
            cnpj: '',
            esfera_adm_id: '',
            tipo_orgao_id: '',
            email_institucional: '',
            telefone_geral: '',
            site_oficial: '',
            nome_responsavel: '',
            email_responsavel: '',
            telefone_responsavel: '',
            status_orgao_id: '',
            logo_orgao: '',
        },
    })

    // Normaliza valores opcionais vazios para null (compatível com MySQL)
    function normalizeOptional(v?: string | null) {
        if (v === undefined) return undefined
        const trimmed = String(v).trim()
        return trimmed === '' ? null : trimmed
    }

    async function handleSubmit(data: ClientFormData) {
        try {
            // Mapeia strings de IDs do Select para números conforme o schema do BD
            const payload = {
                nome: data.nome,
                sigla: data.sigla,
                cnpj: data.cnpj,
                esfera_adm_id: Number(data.esfera_adm_id),
                tipo_orgao_id: Number(data.tipo_orgao_id),
                email_institucional: data.email_institucional,
                telefone_geral: normalizeOptional(data.telefone_geral),
                site_oficial: normalizeOptional(data.site_oficial),
                nome_responsavel: normalizeOptional(data.nome_responsavel),
                email_responsavel: normalizeOptional(data.email_responsavel),
                telefone_responsavel: normalizeOptional(data.telefone_responsavel),
                status_orgao_id: Number(data.status_orgao_id),
                logo_orgao: normalizeOptional(data.logo_orgao),
            }

            await api.post('/orgaos_publicos', payload)

            toast.success('Cliente/Órgão cadastrado com sucesso!')
            onSubmit?.(data)
            form.reset()
        } catch (err: any) {
            console.error(err)
            toast.error('Erro ao cadastrar cliente/órgão')
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Cadastro de Cliente/Órgão Público</CardTitle>
                <CardDescription>Preencha os dados do cliente ou órgão público que deseja cadastrar</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações Básicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome da organização" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="sigla"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sigla *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sigla da organização" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cnpj"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CNPJ *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="00.000.000/0000-00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="esfera_adm_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Esfera Administrativa *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={loadingEsferas}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione a esfera" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {esferas.map((e: any) => (
                                                        <SelectItem key={e.id} value={e.id.toString()}>
                                                            {e.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="tipo_orgao_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Órgão *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={loadingTipos}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {tipos.map((t: any) => (
                                                        <SelectItem key={t.id} value={t.id.toString()}>
                                                            {t.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status_orgao_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status *</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={loadingStatus}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {status.map((s: any) => (
                                                        <SelectItem key={s.id} value={s.id.toString()}>
                                                            {s.nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Informações de Contato */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações de Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email_institucional"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Institucional *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contato@organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefone_geral"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone Geral</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(00) 0000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="site_oficial"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Site Oficial</FormLabel>
                                            <FormControl>
                                                <Input type="url" placeholder="https://www.organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Informações do Responsável */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Informações do Responsável</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nome_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Responsável</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email do Responsável</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="responsavel@organizacao.gov.br" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefone_responsavel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Telefone do Responsável</FormLabel>
                                            <FormControl>
                                                <Input placeholder="(00) 00000-0000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="logo_orgao"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL do Logo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://exemplo.com/logo.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => form.reset()}>
                                Limpar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Enviando..." : "Cadastrar Cliente/Órgão"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
