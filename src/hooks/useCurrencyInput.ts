
export const formatCurrency = (valueInCentsString) => {
    // 1. Garante que o valor é uma string de dígitos
    const cleanedCents = cleanInputToCents(valueInCentsString); 
    
    // Se for vazia ou nula (usuário apagou tudo), RETORNA STRING VAZIA
    if (cleanedCents === '' || cleanedCents === '0') {
        return ''; 
    }
    
    // 2. Converte para o número de centavos
    const valueInCents = Number(cleanedCents);
    
    // Se por algum motivo a conversão falhar (embora improvável após cleanInput), retorna vazio.
    if (isNaN(valueInCents)) {
        return '';
    }
    
    // 3. Formata usando Intl.NumberFormat
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    console.log(   'Formatando valor:', valueInCents, 'centavos como', formatter.format(valueInCents / 100));
    
    // O valor para formatação é o valor em centavos dividido por 100
    return formatter.format(valueInCents / 100);
};

/** Hook para manipular o input de moeda (Permanentemente CORRETO) */
export const useCurrencyInputCents = (fieldName, setForm) => {
  const handleCurrencyChange = (inputValue) => {
    const centsString = cleanInputToCents(inputValue);
    setForm(prevData => ({
      ...prevData,
      [fieldName]: centsString,
    }));
  };
  return handleCurrencyChange;
};