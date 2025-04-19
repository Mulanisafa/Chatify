import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function useProtectedPage() {
    const { data: session, status } = useSession();
    const router=useRouter()

    if (status === 'loading') {
      return null;
    }
  
    if (!session) {
      router.push('/login')
    }
}
