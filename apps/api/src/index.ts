import Fastify from "fastify";
import { characterRoutes } from "./routes/character";

const app = Fastify({
  logger: true,
});

// Registrar as rotas do arquivo externo
app.register(characterRoutes);

// Rota de teste DIRETA no index para diagnosticar o 404
app.get("/", async () => {
  return { message: "Index carregado com sucesso!" };
});

app.get("/health", async () => {
  return { status: "OK - CODIGO ATUALIZADO 123" };
});

const start = async () => {
  try {
    // Adicionei um log visual único para termos certeza que o processo reiniciou
    await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log(">>>> API REINICIADA - PORTA 3333 <<<<");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();