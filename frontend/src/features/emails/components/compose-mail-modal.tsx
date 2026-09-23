'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSendMailMutation } from '@/features/emails/hooks/use-send-mail-mutation';
import {
  sendMailFormSchema,
  type SendMailFormInput,
  type SendMailPayload,
} from '@/features/emails/schemas/send-mail-schema';

type ComposeMailModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AddressFieldName = 'to' | 'cc' | 'bcc';

const addressFields: { name: AddressFieldName; label: string }[] = [
  { name: 'to', label: '宛先' },
  { name: 'cc', label: 'Cc' },
  { name: 'bcc', label: 'Bcc' },
];

export default function ComposeMailModal({
  open,
  onOpenChange,
}: ComposeMailModalProps) {
  const sendMailMutation = useSendMailMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SendMailFormInput, unknown, SendMailPayload>({
    resolver: zodResolver(sendMailFormSchema),
    defaultValues: { to: '', cc: '', bcc: '', subject: '', body: '' },
  });

  const onSubmit = (payload: SendMailPayload) => {
    sendMailMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 p-0"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-dvh flex-col bg-background"
        >
          <div className="flex items-center justify-between border-b px-2 py-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="h-5 w-5" />
              <span className="sr-only">閉じる</span>
            </Button>
            <DialogTitle>新規メール</DialogTitle>
            <Button type="submit" disabled={sendMailMutation.isPending}>
              送信
            </Button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {addressFields.map(({ name, label }) => (
              <div key={name} className="flex flex-col gap-1">
                <Label htmlFor={`compose-${name}`}>{label}</Label>
                <Input
                  id={`compose-${name}`}
                  type="text"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  placeholder="example@example.com, ..."
                  {...register(name)}
                />
                {errors[name] && (
                  <p className="text-sm text-destructive">
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <Label htmlFor="compose-subject">件名</Label>
              <Input
                id="compose-subject"
                type="text"
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Label htmlFor="compose-body">本文</Label>
              <Textarea
                id="compose-body"
                className="min-h-40 flex-1 resize-none"
                {...register('body')}
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
