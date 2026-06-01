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
    contacted: 'Contact\u00e9',
    confirmed: 'Confirm\u00e9e',
    cancelled: 'Annul\u00e9e',
    completed: 'Termin\u00e9e',
  };

  const statusColors: Record<string, string> = {
    new: '#DC2626',
    contacted: '#F59E0B',
    confirmed: '#16A34A',
    cancelled: '#6B7280',
    completed: '#2563EB',
  };

  const label = statusLabels[status] || status;
  const statusColor = statusColors[status] || '#DC2626';

  const rows: string[] = [];
  const addRow = (label: string, value: string) => {
    rows.push(`
      <tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #F3F4F6; color: #6B7280; font-size: 13px; white-space: nowrap; vertical-align: top;">${label}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #F3F4F6; color: #111827; font-size: 14px; font-weight: 600; vertical-align: top;">${value}</td>
      </tr>`);
  };

  if (data.car_name) addRow('V\u00e9hicule', data.car_name);
  if (data.start_date) addRow('D\u00e9but', data.start_date);
  if (data.end_date) addRow('Fin', data.end_date);
  if (data.location) addRow('Lieu', data.location);
  if (data.total_eur) addRow('Total', `${data.total_eur.toFixed(2)} \u20ac`);

  const isNew = status === 'new';
  const greeting = isNew
    ? `Nouvelle r\u00e9servation de <strong>${data.client_name || 'Client'}</strong>`
    : `Bonjour <strong>${data.client_name || 'Client'}</strong>, le statut de votre r\u00e9servation a \u00e9t\u00e9 mis \u00e0 jour.`;

  const html = `
    <div style="background-color: #F9FAFB; padding: 32px 16px; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">
      <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <tr>
          <td style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 28px 32px; text-align: center;">
            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${fromName}</h1>
            <p style="margin: 4px 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Location de v\u00e9hicules \u2022 Marrakech</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 32px 32px 8px;">
            <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.6;">${greeting}</p>
            <div style="display: inline-block; background-color: ${statusColor}15; color: ${statusColor}; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; letter-spacing: 0.3px; text-transform: uppercase;">${label}</div>
          </td>
        </tr>
        ${rows.length ? `<tr><td style="padding: 16px 32px 8px;"><table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #E5E7EB;">${rows.join('')}</table></td></tr>` : ''}
        ${data.message ? `
        <tr>
          <td style="padding: 8px 32px;">
            <div style="background-color: #FFFBEB; border-left: 3px solid #F59E0B; padding: 12px 16px; border-radius: 0 6px 6px 0;">
              <p style="margin: 0; color: #92400E; font-size: 13px; font-style: italic;">${data.message}</p>
            </div>
          </td>
        </tr>` : ''}
        <tr>
          <td style="padding: 16px 32px 32px;">
            <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; border: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Coordonn\u00e9es client</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 2px 8px 2px 0; color: #374151; font-size: 13px;"><strong>Email :</strong></td>
                  <td style="padding: 2px 0; color: #DC2626; font-size: 13px;"><a href="mailto:${data.client_email}" style="color: #DC2626; text-decoration: none;">${data.client_email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 2px 8px 2px 0; color: #374151; font-size: 13px;"><strong>T\u00e9l :</strong></td>
                  <td style="padding: 2px 0; color: #374151; font-size: 13px;">${data.client_phone || 'Non renseign\u00e9'}</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <td style="background-color: #F3F4F6; padding: 20px 32px; text-align: center;">
            <p style="margin: 0; color: #9CA3AF; font-size: 12px;">${fromName} \u2014 Location de v\u00e9hicules \u00e0 Marrakech</p>
            <p style="margin: 4px 0 0; color: #9CA3AF; font-size: 11px;">Cet email est automatique, merci de ne pas y r\u00e9pondre.</p>
          </td>
        </tr>
      </table>
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
      html = `
        <div style="background-color: #F9FAFB; padding: 32px 16px; font-family: 'Segoe UI', Arial, Helvetica, sans-serif;">
          <table align="center" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, #DC2626, #EF4444); padding: 28px 32px; text-align: center;">
                <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${fromName}</h1>
                <p style="margin: 4px 0 0; color: rgba(255,255,255,0.85); font-size: 13px;">Location de v\u00e9hicules \u2022 Marrakech</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 32px; text-align: center;">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #DC2626, #EF4444); border-radius: 50%; display: inline-block; line-height: 56px; font-size: 28px; margin-bottom: 16px;">\u2709\uFE0F</div>
                <h2 style="margin: 0 0 8px; color: #111827; font-size: 18px;">Email de test r\u00e9ussi</h2>
                <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">Si vous recevez ce message, la configuration SMTP de <strong>${fromName}</strong> est correcte et fonctionnelle.</p>
              </td>
            </tr>
            <tr>
              <td style="background-color: #F3F4F6; padding: 20px 32px; text-align: center;">
                <p style="margin: 0; color: #9CA3AF; font-size: 12px;">${fromName} \u2014 Location de v\u00e9hicules \u00e0 Marrakech</p>
              </td>
            </tr>
          </table>
        </div>`;
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
