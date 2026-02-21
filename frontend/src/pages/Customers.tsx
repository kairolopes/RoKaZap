import { useEffect, useState } from "react";
import { api } from "../api";

interface Customer {
  id?: string;
  name: string;
  phone: string;
  tags?: string[];
  notes?: string;
}

export function Customers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [form, setForm] = useState<Customer>({ name: "", phone: "" });

  async function load() {
    const res = await api.get("/customers");
    setItems(res.data.items || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!form.name || !form.phone) return;
    await api.post("/customers", form);
    setForm({ name: "", phone: "" });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-50">
      <h1 className="mb-4 text-xl font-semibold">Clientes</h1>
      <div className="mb-4 rounded-xl bg-slate-900 p-4">
        <div className="grid gap-2 md:grid-cols-3">
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            placeholder="Telefone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <button
            onClick={add}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950"
          >
            Adicionar
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((c) => (
          <div key={c.id} className="rounded-xl bg-slate-900 p-4">
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="text-xs text-slate-400">{c.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

