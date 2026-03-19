import assert from "node:assert/strict";
import type { MailMessage } from "./mail-message.interface.js";

export interface SimpleMailMessageProps {
  from?: string | null;
  replyTo?: string | null;
  to?: string[] | null;
  cc?: string[] | null;
  bcc?: string[] | null;
  sentDate?: Date | null;
  subject?: string | null;
  text?: string | null;
}

export class SimpleMailMessage implements MailMessage {
  private _from: string | null;
  private _replyTo: string | null;
  private _to: string[] | null;
  private _cc: string[] | null;
  private _bcc: string[] | null;
  private _sentDate: Date | null;
  private _subject: string | null;
  private _text: string | null;

  constructor(props?: SimpleMailMessageProps | SimpleMailMessage) {
    if (props instanceof SimpleMailMessage) {
      assert(props, "'original' message argument must not be null");
      this._from = props.from;
      this._replyTo = props.replyTo;
      this._to = props.to ? [...props.to] : null;
      this._cc = props.cc ? [...props.cc] : null;
      this._bcc = props.bcc ? [...props.bcc] : null;
      this._sentDate = props.sentDate;
      this._subject = props.subject;
      this._text = props.text;
    } else {
      this._from = props?.from ?? null;
      this._replyTo = props?.replyTo ?? null;
      this._to = props?.to ?? null;
      this._cc = props?.cc ?? null;
      this._bcc = props?.bcc ?? null;
      this._sentDate = props?.sentDate ?? null;
      this._subject = props?.subject ?? null;
      this._text = props?.text ?? null;
    }
  }

  setFrom(from: string): void {
    this._from = from;
  }

  get from(): string | null {
    return this._from;
  }

  setReplyTo(replyTo: string): void {
    this._replyTo = replyTo;
  }

  get replyTo(): string | null {
    return this._replyTo;
  }

  setTo(...to: string[]): void {
    this._to = to;
  }

  get to(): string[] | null {
    return this._to;
  }

  setCc(...cc: string[]): void {
    this._cc = cc;
  }

  get cc(): string[] | null {
    return this._cc;
  }

  setBcc(...bcc: string[]): void {
    this._bcc = bcc;
  }

  get bcc(): string[] | null {
    return this._bcc;
  }

  setSentDate(sentDate: Date): void {
    this._sentDate = sentDate;
  }

  get sentDate(): Date | null {
    return this._sentDate;
  }

  setSubject(subject: string): void {
    this._subject = subject;
  }

  get subject(): string | null {
    return this._subject;
  }

  setText(text: string): void {
    this._text = text;
  }

  get text(): string | null {
    return this._text;
  }

  copyTo(target: MailMessage): void {
    assert(target, "'target' MailMessage must not be null");
    if (this.from != null) {
      target.setFrom(this.from);
    }
    if (this.replyTo != null) {
      target.setReplyTo(this.replyTo);
    }
    if (this.to != null) {
      target.setTo(...[...this.to]);
    }
    if (this.cc != null) {
      target.setCc(...[...this.cc]);
    }
    if (this.bcc != null) {
      target.setBcc(...[...this.bcc]);
    }
    if (this.sentDate != null) {
      target.setSentDate(this.sentDate);
    }
    if (this.subject != null) {
      target.setSubject(this.subject);
    }
    if (this.text != null) {
      target.setText(this.text);
    }
  }
}
