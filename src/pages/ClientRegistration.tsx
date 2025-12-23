import React from 'react';
import Layout from '@/components/Layout';
import { ClientRegistrationForm } from '@/components/ClientRegistrationForm';

const ClientRegistration = () => {
  const handleClientSubmit = (data: any) => {

    // Here you would typically send the data to your backend
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cadastro de Clientes/Órgãos</h1>
          <p className="text-muted-foreground mt-2">
            Cadastre novos clientes ou órgãos públicos no sistema
          </p>
        </div>
        
        <ClientRegistrationForm onSubmit={handleClientSubmit} />
      </div>
    </Layout>
  );
};

export default ClientRegistration;