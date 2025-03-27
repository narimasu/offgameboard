import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/database.types'
import { cache } from 'react'

export const createServerClient = cache(() => 
  createServerComponentClient<Database>({ cookies })
)