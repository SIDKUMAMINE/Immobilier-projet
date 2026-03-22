'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { API_BASE_URL } from '@/lib/config';

function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Email ou mot de passe incorrect');
        return;
      }

      // ✅ La redirection vers /dashboard est gérée dans context.tsx
      await login(data.access_token, data.refresh_token);

    } catch (err) {
      setError('Erreur de connexion. Veuillez reessayer.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mb-4">
            <span className="text-2xl font-bold text-white">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SABBAR</h1>
          <p className="text-slate-400">Connexion Agents Immobiliers</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-6">

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@example.com"
              required
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <label className="flex items-center text-slate-400 text-sm cursor-pointer hover:text-slate-300">
            <input type="checkbox" className="w-4 h-4 mr-2 rounded" />
            Se souvenir de moi
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>

        </form>

        {/* Liens bas de page */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-slate-400">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-amber-500 hover:text-amber-400 font-semibold">
              S&apos;inscrire
            </Link>
          </p>
          <p className="text-slate-500 text-sm">
            <Link href="/" className="hover:text-slate-300 transition">
              &larr; Retour vers le site public
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}