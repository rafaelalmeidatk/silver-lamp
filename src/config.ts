export const config = {
  days: [1, 15, 30, 90],
  errorMessages: {
    unknown: {
      type: 'error',
      message: 'Ops, algo de errado aconteceu! Por favor, tente novamente',
    },
    timeout: {
      type: 'error',
      message: 'Demoramos para receber uma resposta, tente novamente',
    },
    delay: {
      type: 'warning',
      message:
        'Estamos demorando para receber uma resposta, cheque se sua conexão está estável',
    },
    network: {
      type: 'error',
      message:
        'Não foi possível obter uma resposta, cheque sua conexão com a internet',
    },
  },
};
