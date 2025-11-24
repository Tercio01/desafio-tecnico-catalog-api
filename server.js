// Servidor principal em JavaScript que carrega o TypeScript compilado
require('dotenv').config();

console.log('🚀 Iniciando servidor híbrido...');

// Carregar a aplicação TypeScript compilada
try {
  require('./dist/index.js');
  console.log('✅ TypeScript carregado com sucesso');
} catch (error) {
  console.error('❌ Erro ao carregar TypeScript:', error);
  process.exit(1);
}
