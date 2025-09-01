// Teste simples para enviar email
const nodemailer = require('nodemailer');

// Configurar transportador
const transportador = nodemailer.createTransport({
  host: 'mail.imovia.ai',
  port: 465,
  secure: true,
  auth: {
    user: 'relatorios@imovia.ai',
    pass: 'Lala147??',
  },
  logger: true,
  debug: true
});

// Configuração do email
const mailOptions = {
  from: '"iMovia" <relatorios@imovia.ai>',
  to: 'suporte@vyzer.com.br',
  subject: 'Teste de Email - iMovia',
  text: 'Este é um email de teste para verificar a configuração SMTP.',
  html: '<h1>Teste de Email</h1><p>Este é um email de teste para verificar a configuração SMTP do iMovia.</p>'
};

// Enviar email
console.log('Tentando enviar email...');
transportador.sendMail(mailOptions)
  .then(info => {
    console.log('Email enviado com sucesso!');
    console.log('ID da mensagem:', info.messageId);
    process.exit(0);
  })
  .catch(erro => {
    console.error('Erro ao enviar email:', erro);
    process.exit(1);
  });
