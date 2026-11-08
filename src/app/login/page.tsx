'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Heart, Lock, Mail, ArrowRight, Loader2, ShieldCheck, KeyRound, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sign in with Email + Password
  const handlePasswordLogin = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Send 6-digit OTP code to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: false,
        },
      });

      if (otpError) {
        throw new Error(otpError.message);
      }

      setOtpSent(true);
      setSuccessMsg(`A 6-digit login code has been sent to ${email.trim()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to send login code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 6-digit OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpToken.trim(),
        type: 'email',
      });

      if (verifyError) {
        throw new Error(verifyError.message);
      }

      if (data.user) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Soft gradient ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFF0F3] rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EFECE6] p-8 shadow-xl shadow-stone-200/50 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo.png"
            alt="LoveLynk Logo"
            className="w-14 h-14 rounded-2xl shadow-sm object-cover mb-3"
          />
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1530]">LoveLynk Admin</h1>
          <p className="text-xs text-[#6B667A] mt-1 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF4FA3]" /> Secure Management Portal
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#F9F8F4] border border-[#EFECE6] rounded-xl mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMethod === 'password'
                ? 'bg-white text-[#1E1E24] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E1E24]'
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setError(null);
            }}
            className={`py-2 rounded-lg transition-all cursor-pointer ${
              authMethod === 'otp'
                ? 'bg-white text-[#1E1E24] shadow-xs'
                : 'text-[#64748B] hover:text-[#1E1E24]'
            }`}
          >
            Email Code (OTP)
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            {successMsg}
          </div>
        )}

        {/* Form: Password Login */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                  placeholder="e.g. mosharof5khan@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-sm text-[#1E1E24] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72] transition-all"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-sm text-[#1E1E24] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#FF4B72] hover:bg-[#E03E61] active:scale-[0.99] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Form: Email OTP */}
        {authMethod === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E24] mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. mosharof5khan@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-sm text-[#1E1E24] placeholder:text-[#64748B]/50 focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72] transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    We will send a 6-digit verification code to your email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#FF4B72] hover:bg-[#E03E61] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Send 6-Digit Code</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1E24] mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpToken}
                    onChange={(e) => setOtpToken(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-xl font-bold py-3 rounded-xl border border-[#EFECE6] bg-[#F9F8F4] text-[#1E1E24] focus:outline-none focus:ring-2 focus:ring-[#FF4B72]/30 focus:border-[#FF4B72]"
                  />
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-[#64748B]">Sent to: {email}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[#FF4B72] hover:underline cursor-pointer"
                    >
                      Change email
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-[#FF4B72] hover:bg-[#E03E61] text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Enter Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Note */}
        <p className="text-[11px] text-center text-[#64748B] mt-6">
          Authorized personnel only. Access is monitored and logged.
        </p>
      </div>
    </div>
  );
}
