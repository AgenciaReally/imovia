// Variáveis de ambiente expostas ao frontend de forma segura
export const ENV = {
  // Orulo API
  ORULO_PUBLIC: {
    HAS_CLIENT_ID: typeof process.env.ORULO_CLIENT_ID === 'string',
    HAS_CLIENT_SECRET: typeof process.env.ORULO_CLIENT_SECRET === 'string',
    HAS_API_KEY: typeof process.env.ORULO_API_KEY === 'string',
  }
};
