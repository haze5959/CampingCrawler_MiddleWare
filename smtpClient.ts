import "https://deno.land/x/dotenv/load.ts";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";

const client = new SmtpClient();
await client.connectTLS({
  hostname: "smtp.gmail.com",
  port: 465,
  username: Deno.env.get("GMAIL_USERNAME"),
  password: Deno.env.get("GMAIL_PASSWORD"),
});

let mailerObj = async (title: string, body: string) => {
  await client.send({
    from: "oqkwon92@gmail.com",
    to: "oqkwon92@gmail.com",
    subject: title,
    content: body,
  });
};

export { mailerObj };