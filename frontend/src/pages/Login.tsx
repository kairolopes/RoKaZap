import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Credenciais inválidas");
      // console.log(err);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl bg-slate-900 p-6 shadow-xl"
      >
        <h1 className="text-center text-xl font-semibold text-slate-50">
          RoKa Zap
        </h1>
        <p className="text-center text-xs text-slate-400">
          Acesse com seu usuário de atendente
        </p>

        {error && (
          <div className="rounded-md bg-red-900/60 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        <div className="space-y-1 text-sm">
          <label className="block text-slate-200" htmlFor="email">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1 text-sm">
          <label className="block text-slate-200" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950"
        >
          Entrar
        </button>

        <button
          type="button"
          className="w-full text-center text-xs text-emerald-300"
        >
          Esqueci minha senha
        </button>
      </form>
    </div>
  );
}

