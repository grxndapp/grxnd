'use client';
import { ReactNode, useState } from 'react';
import { CustomSpinner } from '../Spinner/Spinner';
import { UserRoundPlus } from 'lucide-react';

export default function SubscribeButton ({ children }: { children?: ReactNode }) {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   async function handleSubscribe(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
         const response = await fetch('/api/checkout', { method: 'POST' });
         const data: { url?: string; error?: string } = await response.json();
         if (!response.ok || !data.url) {
            throw new Error(data.error ?? 'Unable to start checkout');
         }

         window.location.assign(data.url);
      } catch (error: unknown) {
         setError(error instanceof Error ? error.message : 'Something went wrong',);
         setLoading(false);
      }
   }

   return (
      <div className='box full dfb column gap-5 align-center'>
         <button
            className="xxs pd-15 full accent-hover"
            onClick={handleSubscribe}
            disabled={loading}
         >
            {loading 
               ? <><CustomSpinner color='white' size={19} /> Please Wait...</> 
               : <>{children ?? <><UserRoundPlus size={18} /> Subscribe</>}</>
            }
         </button>
         {error && <div className="text-xxs error-text pd-05 text-center">{error}</div>}
      </div>
   );
}