// Supabase Edge Function: send-result-email
// Configure RESEND_API_KEY, EMAIL_FROM e APP_URL como secrets no ambiente Supabase.
// Nunca exponha RESEND_API_KEY no frontend.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user?.email) return new Response('Unauthorized', { status: 401 })

  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('EMAIL_FROM')
  const appUrl = Deno.env.get('APP_URL')
  if (!apiKey || !from || !appUrl) return new Response('Email service not configured', { status: 503 })

  const result = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [user.email],
      subject: 'Seu resultado no Stylist AI está pronto',
      html: `<p>Seu mapa de estilo está pronto.</p><p><a href="${appUrl}">Abrir minha área no Stylist AI</a></p><p>Se você não solicitou esta mensagem, pode ignorá-la.</p>`,
    }),
  })
  const body = await result.text()
  return new Response(body, { status: result.status, headers: { 'Content-Type': 'application/json' } })
})
