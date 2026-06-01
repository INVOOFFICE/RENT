import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import * as nodemailer from 'https://esm.sh/nodemailer@6.9.16';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface SettingsRow {
  key: string;
  value: string;
}

async function getSettings(supabase: ReturnType<typeof createClient>): Promise<Record<string, string>> {
  const { data } = await supabase.from('settings').select('key, value');
  const map: Record<string, string> = {};
  if (data) {
    for (const row of data as SettingsRow[]) {
      map[row.key] = row.value;
    }
  }
  return map;
}

function buildTransport(smtp: Record<string, string>) {
  return nodemailer.createTransport({
    host: smtp.smtp_host || 'smtp.gmail.com',
    port: parseInt(smtp.smtp_port || '587', 10),
    secure: (smtp.smtp_port || '587') === '465',
    auth: {
      user: smtp.smtp_email,
      pass: smtp.smtp_password,
    },
  });
}

function buildReservationEmail(
  status: string,
  data: {
    client_name?: string;
    client_email?: string;
    client_phone?: string;
    car_name?: string;
    start_date?: string;
    end_date?: string;
    total_eur?: number;
    location?: string;
    message?: string;
  },
  fromName: string,
  smtpEmail: string,
) {
  const statusLabels: Record<string, string> = {
    new: 'Nouvelle',
    contacted: 'Contacté',
    confirmed: 'Confirmée',
    cancelled: 'Annulée',
    completed: 'Terminée',
  };

  const label = statusLabels[status] || status;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F766E;">${fromName}</h2>
      <p>Bonjour <strong>${data.client_name || 'Client'}</strong>,</p>
      <p>Le statut de votre r\u00e9servation est : <strong>${label}</strong></p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        ${data.car_name ? `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">V\u00e9hicule</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">${data.car_name}</td></tr>` : ''}
        ${data.start_date ? `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">D\u00e9but</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">${data.start_date}</td></tr>` : ''}
        ${data.end_date ? `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">Fin</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">${data.end_date}</td></tr>` : ''}
        ${data.location ? `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">Lieu</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">${data.location}</td></tr>` : ''}
        ${data.total_eur ? `<tr><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; color: #4B5563;">Total</td><td style="padding: 8px; border-bottom: 1px solid #E5E7EB; font-weight: 600;">${data.total_eur} \u20ac</td></tr>` : ''}
      </table>
      ${data.message ? `<p style="color: #4B5563; font-style: italic;">Message : ${data.message}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #9CA3AF; font-size: 12px;">Coordonn\u00e9es client : ${data.client_email} / ${data.client_phone || 'Non renseign\u00e9'}</p>
    </div>
  `;

  return { subject: `R\u00e9servation ${label} \u2014 ${fromName}`, html };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS_HEADERS });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env vars' }), { status: 500, headers: CORS_HEADERS });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const settings = await getSettings(supabase);
    const fromName = settings.smtp_from_name || 'INVOLOCATION';
    const smtpEmail = settings.smtp_email;

    const { type, to, status, data } = await req.json();

    if (!to) {
      return new Response(JSON.stringify({ error: 'Missing "to" recipient' }), { status: 400, headers: CORS_HEADERS });
    }

    if (!smtpEmail || !settings.smtp_password) {
      return new Response(
        JSON.stringify({ error: 'SMTP non configur\u00e9. Renseignez les param\u00e8tres email dans Configuration.' }),
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const transporter = buildTransport(settings);

    let subject: string;
    let html: string;

    if (type === 'test') {
      subject = `Test \u2014 ${fromName}`;
      html = `<p style="font-family: Arial; color: #0F766E; font-size: 16px;">Email de test \u2014 ${fromName}</p><p style="font-family: Arial; color: #4B5563;">Si vous recevez ce message, la configuration SMTP est correcte.</p>`;
    } else if (type === 'reservation_status') {
      const emailData = buildReservationEmail(status || '', data || {}, fromName, smtpEmail);
      subject = emailData.subject;
      html = emailData.html;
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), { status: 400, headers: CORS_HEADERS });
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${smtpEmail}>`,
      to,
      subject,
      html,
    });

    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500, headers: CORS_HEADERS });
  }
});
