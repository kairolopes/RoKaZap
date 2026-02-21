import request from "supertest";
import app from "../server";
import jwt from "jsonwebtoken";

jest.mock("../services/queueService", () => {
  return {
    outgoingMessageQueue: {
      add: jest.fn().mockResolvedValue(undefined),
    },
  };
});

jest.mock("../services/templatesService", () => {
  return {
    getPurchaseTemplate: jest
      .fn()
      .mockResolvedValue(
        "Olá {{cliente}}, sua compra da peça {{peca}} no valor de R$ {{valor}} foi registrada. {{mensagem}}"
      ),
    setPurchaseTemplate: jest.fn().mockResolvedValue(undefined),
  };
});

describe("POST /api/v1/notify-purchase", () => {
  process.env.JWT_SECRET = "test-secret";
  const token = jwt.sign(
    { sub: "tester", tenantId: "tenant-test", roles: ["admin"] },
    process.env.JWT_SECRET as string
  );
  const auth = `Bearer ${token}`;

  it("valida campos obrigatórios", async () => {
    const res = await request(app)
      .post("/api/v1/notify-purchase")
      .set("Authorization", auth)
      .send({});
    expect(res.status).toBe(400);
  });

  it("aceita payload válido e enfileira mensagem", async () => {
    const res = await request(app)
      .post("/api/v1/notify-purchase")
      .set("Authorization", auth)
      .send({
        cliente: "João da Silva",
        telefone: "+55 11 99999-9999",
        mensagem: "Compra confirmada",
        pecaId: "P123",
        valor: 199.9,
      });

    expect(res.status).toBe(202);
  });
});
