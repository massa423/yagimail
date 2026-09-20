import { z } from 'zod';

const splitAddresses = (value: string): string[] =>
  value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const invalidEmailMessage = 'メールアドレスの形式が正しくありません';
const emptyToMessage = '宛先を入力してください';

// バックエンドに送るペイロードの形。Server Action 側の再検証にも使う。
export const sendMailPayloadSchema = z.object({
  to: z.array(z.email({ error: invalidEmailMessage })).min(1, {
    error: emptyToMessage,
  }),
  cc: z.array(z.email({ error: invalidEmailMessage })),
  bcc: z.array(z.email({ error: invalidEmailMessage })),
  subject: z.string().trim().min(1, { error: '件名を入力してください' }),
  body: z.string(),
});

// 配列要素のエラーは to[0] のようなパスに付き、フォームのフィールド直下に
// 表示できないため、文字列の段階で全アドレスを検証してから変換する。
const allAddressesValid = (value: string): boolean =>
  splitAddresses(value).every((a) => z.email().safeParse(a).success);

// フォームの形。宛先系はカンマ区切り文字列で受け取り、string[] に変換する。
export const sendMailFormSchema = z.object({
  to: z
    .string()
    .trim()
    .min(1, { error: emptyToMessage })
    .refine(allAddressesValid, { error: invalidEmailMessage })
    .transform(splitAddresses)
    .pipe(sendMailPayloadSchema.shape.to),
  cc: z
    .string()
    .trim()
    .refine(allAddressesValid, { error: invalidEmailMessage })
    .transform(splitAddresses)
    .pipe(sendMailPayloadSchema.shape.cc),
  bcc: z
    .string()
    .trim()
    .refine(allAddressesValid, { error: invalidEmailMessage })
    .transform(splitAddresses)
    .pipe(sendMailPayloadSchema.shape.bcc),
  subject: sendMailPayloadSchema.shape.subject,
  body: sendMailPayloadSchema.shape.body,
});

export type SendMailFormInput = z.input<typeof sendMailFormSchema>;
export type SendMailPayload = z.output<typeof sendMailFormSchema>;
