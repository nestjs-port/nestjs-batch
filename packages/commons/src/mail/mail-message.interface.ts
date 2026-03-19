export interface MailMessage {
  setFrom(from: string): void;
  setReplyTo(replyTo: string): void;
  setTo(...to: string[]): void;
  setCc(...cc: string[]): void;
  setBcc(...bcc: string[]): void;
  setSentDate(sentDate: Date): void;
  setSubject(subject: string): void;
  setText(text: string): void;
}
