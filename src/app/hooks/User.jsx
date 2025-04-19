import { useSession } from 'next-auth/react';
import React from 'react'

export default function User() {
  const { data: session, status } = useSession();
  const user= session?.user;
  return user;
}
