import { useEffect, useState } from "react";
import { api } from "../api";

interface Message {
  id: string;
  from: "me" | "them";
  text: string;
  createdAt: string;
}

interface UserSummary {
  id: string;
  name: string;
}

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [assignee, setAssignee] = useState("");
  const [deviceRegistered, setDeviceRegistered] = useState(false);
  const [users, setUsers] = useState<UserSummary[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: "1",
        from: "them",
        text: "Bem-vindo ao RoKa Zap!",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    async function register() {
      try {
        const token = localStorage.getItem("fcmToken");
        if (token) {
          await api.post("/devices/register", { token });
          setDeviceRegistered(true);
        }
      } catch {
        setDeviceRegistered(false);
      }
    }
    register();
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data.items || []);
      } catch {
        setUsers([]);
      }
    }
    loadUsers();
  }, []);

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-slate-50">
      <header className="flex items-center gap-3 border-b border-slate-800 px-4 py-3">
        <button className="mr-2 rounded-lg bg-slate-800 px-2 py-1 text-sm md:hidden">
          Menu
        </button>
        <div className="font-semibold">RoKa Zap</div>
        <div className="ml-auto text-xs text-slate-400">
          Atendente logado • Online
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-72 flex-col border-r border-slate-800 bg-slate-950/60 p-3 md:flex">
          <div className="mb-2 text-xs font-semibold uppercase text-slate-500">
            Conversas
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            <button className="w-full rounded-lg bg-slate-800 px-3 py-2 text-left text-sm">
              João da Silva
              <div className="text-xs text-slate-400">
                Última mensagem há 2 min
              </div>
            </button>
          </div>
        </aside>

        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] p-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-lg ${
                    m.from === "me"
                      ? "bg-emerald-500 text-emerald-950"
                      : "bg-slate-800"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="mt-1 text-[10px] text-slate-300">
                    {new Date(m.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-slate-800 bg-slate-950/80 px-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  from: "me",
                  text: input.trim(),
                  createdAt: new Date().toISOString(),
                },
              ]);
              setInput("");
            }}
          >
            <input
              className="flex-1 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500"
              placeholder="Digite uma mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {users.length > 0 && (
              <select
                className="hidden w-52 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:block"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Transferir para</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={async () => {
                if (!assignee) return;
                const conversationId = "5511999999999"; // exemplo; tipicamente, ID do chat aberto
                await api.post(`/conversations/${conversationId}/transfer`, {
                  assigneeUserId: assignee,
                });
                setAssignee("");
                alert("Transferido");
              }}
              className="hidden rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 md:block"
              title="Transferir conversa (admin)"
            >
              Transferir
            </button>
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
            >
              Enviar
            </button>
          </form>
          {!deviceRegistered && (
            <div className="border-t border-slate-800 bg-amber-900/30 p-2 text-center text-xs text-amber-100">
              Habilite notificações para receber transferências e novas mensagens.
            </div>
          )}
        </main>
      </div>

      <nav className="flex border-t border-slate-800 bg-slate-950 px-4 py-2 text-xs md:hidden">
        <button className="flex-1 text-center text-emerald-400">Chats</button>
        <a href="/admin/customers" className="flex-1 text-center text-slate-400">
          Clientes
        </a>
        <button className="flex-1 text-center text-slate-400">Configurações</button>
      </nav>
    </div>
  );
}
