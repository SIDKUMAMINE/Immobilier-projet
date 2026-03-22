'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader, CheckCircle } from 'lucide-react';
import { useAuth, AuthProvider } from '@/lib/auth/context';
import { API_BASE_URL } from '@/lib/config';

function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    agency_name: '',
    password: '',
    password_confirm: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validatePassword = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*()_+-=[\]{}|;:,.<>?]/.test(pwd)) strength++;
    setPasswordStrength(strength);
    return strength === 4;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      validatePassword(value);
    }

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.full_name) newErrors.full_name = 'Nom complet requis';
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    if (formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Doit contenir une majuscule, un chiffre et un caractère spécial';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          full_name: formData.full_name,
          phone_number: formData.phone_number || null,
          agency_name: formData.agency_name || null,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.detail || "Erreur lors de l'inscription" });
        return;
      }

      await login(data.access_token, data.refresh_token);
      router.push('/dashboard');
    } catch (err) {
      setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrengthColor = {
    0: 'bg-gray-300',
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-green-500',
  }[passwordStrength];

  const passwordStrengthText = {
    0: '',
    1: 'Très faible',
    2: 'Faible',
    3: 'Moyen',
    4: 'Fort',
  }[passwordStrength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mb-4">
            <span className="text-2xl font-bold text-white">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-slate-400">Rejoignez la plateforme immobilière</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 space-y-4">
          {errors.general && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="vous@example.com"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Nom complet</label>
            <input
              type="text" name="full_name" value={formData.full_name}
              onChange={handleChange} placeholder="Jean Dupont"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
            {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Téléphone (opt.)</label>
              <input
                type="tel" name="phone_number" value={formData.phone_number}
                onChange={handleChange} placeholder="+212..."
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-1">Agence (opt.)</label>
              <input
                type="text" name="agency_name" value={formData.agency_name}
                onChange={handleChange} placeholder="Mon Agence"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••"
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded ${i < passwordStrength ? passwordStrengthColor : 'bg-slate-600'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-400">Force : {passwordStrengthText}</p>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Confirmer le mot de passe</label>
            <input
              type="password" name="password_confirm" value={formData.password_confirm}
              onChange={handleChange} placeholder="••••••••"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
            {errors.password_confirm && (
              <p className="text-red-400 text-xs mt-1">{errors.password_confirm}</p>
            )}
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 mt-6">
            {isLoading ? (
              <><Loader size={18} className="animate-spin" />Inscription...</>
            ) : (
              <><CheckCircle size={18} />S&apos;inscrire</>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  );
}