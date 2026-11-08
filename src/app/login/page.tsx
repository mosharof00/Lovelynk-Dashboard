'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Heart, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col items-center justify-center p-4">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-radial from-[#FFF0F3] via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-8 shadow-xl shadow-stone-200/40 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0F3] border border-[#FF4B72]/20 flex items-center justify-center text-[#FF4B72] shadow-sm mb-4">
            <Heart className="w-7 h-7 fill-[#FF4B72]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E1E24]">LoveLynk Admin</h1>
          <p className="text-sm text-[#64748B] mt-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#FF4B72]" /> Secure Management Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E1E24] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lovelynk.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-sm text-[#1E1E24] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E1E24] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-sm text-[#1E1E24] placeholder:text-[#64748B]/60 focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1E1E24] hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#EFECE6] text-center">
          <p className="text-[11px] text-[#64748B]">
            Authorized personnel only. Access is monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}

