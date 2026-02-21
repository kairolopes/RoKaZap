"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("../services/queueService", () => {
    return {
        outgoingMessageQueue: {
            add: jest.fn().mockResolvedValue(undefined),
        },
    };
});
describe("POST /api/v1/notify-purchase", () => {
    process.env.JWT_SECRET = "test-secret";
    const token = jsonwebtoken_1.default.sign({ sub: "tester", tenantId: "tenant-test", roles: ["admin"] }, process.env.JWT_SECRET);
    const auth = `Bearer ${token}`;
    it("valida campos obrigatórios", async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post("/api/v1/notify-purchase")
            .set("Authorization", auth)
            .send({});
        expect(res.status).toBe(400);
    });
    it("aceita payload válido e enfileira mensagem", async () => {
        const res = await (0, supertest_1.default)(server_1.default)
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
