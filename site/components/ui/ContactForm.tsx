"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export type FormField = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
};

type Status = "idle" | "sending" | "sent" | "error";

export const ContactForm = ({
  fields,
  context,
}: {
  fields: FormField[];
  context: string;
}) => {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, context }),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-tot-sky p-8 text-center">
        <p className="font-display text-2xl text-tot-teal">Thank you.</p>
        <p className="mt-2 text-tot-teal/75">
          We&rsquo;ve received your message and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-2">
          <span className="text-sm font-medium text-tot-teal">
            {field.label}
            {field.required ? <span className="text-tot-blue"> *</span> : null}
          </span>
          {field.textarea ? (
            <textarea
              name={field.name}
              required={field.required}
              rows={5}
              className="rounded-xl border border-tot-stone/40 bg-tot-white px-4 py-3 text-tot-teal outline-none transition-colors focus-visible:border-tot-blue focus-visible:ring-2 focus-visible:ring-tot-blue/30"
            />
          ) : (
            <input
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              className="rounded-xl border border-tot-stone/40 bg-tot-white px-4 py-3 text-tot-teal outline-none transition-colors focus-visible:border-tot-blue focus-visible:ring-2 focus-visible:ring-tot-blue/30"
            />
          )}
        </label>
      ))}
      <div className="mt-2 flex items-center gap-4">
        <Button type="submit">
          {status === "sending" ? "Sending…" : "Send message"}
        </Button>
        {status === "error" ? (
          <p className="text-sm text-tot-clay">
            Something went wrong, please email us directly.
          </p>
        ) : null}
      </div>
    </form>
  );
};
