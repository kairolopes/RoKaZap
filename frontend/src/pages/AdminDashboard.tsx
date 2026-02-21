import { useEffect, useState } from "react";
import { api } from "../api";

export function AdminDashboard() {
  const [template, setTemplate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get("/templates/purchase")
      .then((res) => setTemplate(res.data.template || ""))
      .catch(() => undefined);
  }, []);

  async function save() {
    setSaved(false);
    await api.post("/templates/purchase", { template });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-50">
      <h1 className="mb-4 text-xl font-semibold">Dashboard Administrativo</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Mensagens enviadas
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">—</div>
        </div>
        <div className="rounded-xl bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Tempo médio de resposta
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">—</div>
        </div>
        <div className="rounded-xl bg-slate-900 p-4">
          <div className="text-xs uppercase text-slate-400">
            Taxa de resolução
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">—</div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        <h2 className="mb-2 text-lg font-semibold">Template de Compra</h2>
        <p className="mb-2 text-xs text-slate-400">
          Use placeholders: {"{{cliente}}"}, {"{{peca}}"}, {"{{valor}}"}, {"{{mensagem}}"}
        </p>
        <textarea
          className="h-28 w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-sm outline-none focus:border-emerald-500"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={save}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
          >
            Salvar
          </button>
          {saved && <span className="text-xs text-emerald-300">Salvo</span>}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-900 p-4">
        <h2 className="mb-2 text-lg font-semibold">Exportar Relatórios</h2>
        <a
          href={`${import.meta.env.VITE_API_BASE || "/api/v1"}/reports/messages.csv`}
          target="_blank"
          className="inline-block rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
        >
          Baixar CSV (últimos 7 dias)
        </a>
      </div>
    </div>
  );
}
