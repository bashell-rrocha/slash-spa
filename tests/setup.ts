/**
 * Configuração global de testes
 * Configura o ambiente DOM usando happy-dom para testes unitários
 */

// Importa e configura happy-dom para simular o DOM
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { plugin } from "bun";

// Registra o ambiente DOM global
GlobalRegistrator.register();

// Configura variáveis de ambiente para testes
process.env.NODE_ENV = "test";

// Mock CSS modules - retorna um proxy que retorna o nome da classe
plugin({
  name: "css-modules-mock",
  setup(build) {
    build.onLoad({ filter: /\.module\.css$/ }, () => {
      return {
        contents: "export default new Proxy({}, { get: (_, prop) => String(prop) })",
        loader: "js",
      };
    });
  },
});
