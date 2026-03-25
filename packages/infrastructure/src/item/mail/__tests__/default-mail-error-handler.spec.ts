import { describe, expect, it } from "vitest";
import { SimpleMailMessage } from "@nestjs-batch/commons";

import { DefaultMailErrorHandler } from "../default-mail-error-handler";

describe("DefaultMailErrorHandler", () => {
  const handler = new DefaultMailErrorHandler();

  it("test set max message length", () => {
    handler.setMaxMessageLength(20);
    const mailMessage = new SimpleMailMessage();

    const handle = () =>
      handler.handle(mailMessage, new Error("MessagingException"));

    expect(handle).toThrow(Error);
    expect(handle).toThrow(/SimpleMailMessage: f/);
  });

  it("test handle", () => {
    expect(() =>
      handler.handle(new SimpleMailMessage(), new Error("MessagingException")),
    ).toThrow(Error);
  });
});
