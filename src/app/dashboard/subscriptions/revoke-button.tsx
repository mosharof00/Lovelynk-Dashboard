'use client';

import { useTransition } from 'react';
import { revokeSubscription } from './actions';
import { Loader2, XCircle } from 'lucide-react';

export function RevokeButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRevoke = () => {
    if (confirm('Are you sure you want to revoke LoveLynk Plus access for this user?')) {
      startTransition(async () => {
        await revokeSubscription(userId);
      });
    }
  };

  return (
    <button
      onClick={handleRevoke}
      disabled={isPending}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
      title="Revoke subscription"
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      <span>Revoke</span>
    </button>
  );
}
