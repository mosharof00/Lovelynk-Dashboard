'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ShieldAlert, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import styles from './login.module.scss';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      // Check if user has an active admin record
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', data.user.id)
        .eq('is_active', true)
        .single();

      if (adminErr || !adminRecord) {
        // Not an active admin
        await supabase.auth.signOut();
        setErrorMsg('Access denied: Your account is not authorized as an active admin.');
        setIsLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoBox}>
            <Sparkles size={26} />
          </div>
          <h1>Lovelynk Admin</h1>
          <p>Sign in with your administrative credentials to manage app telemetry and operations.</p>
        </div>

        <form onSubmit={handleSignIn} className={styles.form}>
          {errorMsg && (
            <div className={styles.errorBanner}>
              {errorMsg}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="admin@lovelynk.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className={styles.cardFooter}>
          <Lock size={12} />
          <span>Protected by Supabase Auth with private schema RLS</span>
        </div>
      </div>
    </div>
  );
}
