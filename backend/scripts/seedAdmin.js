import 'dotenv/config'
import bcrypt from 'bcrypt'
import { getSupabaseClient } from '../src/config/supabase.js'
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_INITIAL_PASSWORD
if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are required')
if (password.length < 8) throw new Error('ADMIN_INITIAL_PASSWORD must be at least 8 characters')
const db = getSupabaseClient()
const { data, error } = await db.from('admin_users').select('id').eq('email', email).maybeSingle()
if (error) throw error
if (data) { console.log(`Admin user already exists: ${email}`); process.exit(0) }
const password_hash = await bcrypt.hash(password, 12)
const { error: insertError } = await db.from('admin_users').insert({ email, password_hash, role: 'admin' })
if (insertError) throw insertError
console.log(`Admin user created: ${email}`)
