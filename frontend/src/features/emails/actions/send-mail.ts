'use server';

import { serverFetch } from '@/lib/server-fetch';
import { backendUrl, sendMailPath } from '@/features/emails/api/paths';
import {
  sendMailPayloadSchema,
  type SendMailPayload,
} from '@/features/emails/schemas/send-mail-schema';

/**
 * メールを送信する。
 *
 * バックエンド契約 (未実装。実装時はこの形を想定):
 *   POST /api/v1/mails/send
 *   Request body: {
 *     to: string[];      // 宛先 (1件以上)
 *     cc: string[];      // Cc (0件可)
 *     bcc: string[];     // Bcc (0件可)
 *     subject: string;   // 件名
 *     body: string;      // 本文 (プレーンテキスト)
 *   }
 *   Response: 2xx で成功。エラー時は非 2xx。
 */
export async function sendMail(input: SendMailPayload): Promise<void> {
  // Server Action は公開エンドポイントのため、サーバー側でも再検証する
  const payload = sendMailPayloadSchema.parse(input);

  const res = await serverFetch(`${backendUrl()}${sendMailPath()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Failed to send mail: ${res.status}`);
  }
}
