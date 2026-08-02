"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitAudit } from "@/app/audit/actions";
import { ButtonEl } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Mirrors lib/leads.ts's schema for instant client-side feedback. The server
 * re-validates everything — this copy exists purely so the user finds out
 * about a bad email before a round trip, never as the security boundary.
 */
const schema = z.object({
  service: z.enum(["reviews", "website", "seo", "everything"]),
  business: z.string().min(2, "Please enter your business name"),
  website: z.string().optional(),
  industry: z.string().optional(),
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  country: z.string().min(2, "Please select your country"),
  notes: z.string().optional(),
  company_website: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const serviceOptions = [
  {
    value: "reviews",
    label: "More Google reviews",
    hint: "My rating or review count is holding me back",
  },
  {
    value: "website",
    label: "A better website",
    hint: "My site is slow, dated, or doesn't get calls",
  },
  {
    value: "seo",
    label: "Ranking higher",
    hint: "People can't find me when they search",
  },
  {
    value: "everything",
    label: "All of it",
    hint: "Honestly, I need the whole thing looked at",
  },
] as const;

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Ireland",
  "India",
  "Other",
];

const steps = [
  { title: "What do you need?", fields: ["service"] },
  { title: "About your business", fields: ["business", "website", "industry"] },
  { title: "Where do we send it?", fields: ["name", "email", "phone", "country"] },
] as const;

export function AuditForm({ defaultNeed }: { defaultNeed?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Timing check: bots submit near-instantly.
  const startedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      // Deep-linked from the "which one is you?" cards and the pricing CTAs,
      // so the form opens with the visitor's answer already chosen.
      service: (["reviews", "website", "seo", "everything"] as const).includes(
        defaultNeed as never,
      )
        ? (defaultNeed as FormValues["service"])
        : "everything",
      country: "United States",
    },
  });

  const service = watch("service");

  const next = async () => {
    const valid = await trigger(steps[step].fields as never);
    if (valid) setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const onSubmit = (values: FormValues) => {
    setServerError(null);
    startTransition(async () => {
      const result = await submitAudit({
        ...values,
        startedAt: startedAt.current,
      });
      if (result.ok) {
        router.push("/thank-you");
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass rounded-[var(--radius-card)] p-7 sm:p-9"
    >
      {/* Progress */}
      <div className="flex items-center gap-3">
        {steps.map((s, i) => (
          <div key={s.title} className="flex flex-1 flex-col gap-2">
            <span
              className={cn(
                "h-0.5 rounded-full transition-all duration-500",
                i <= step ? "bg-linear-to-r from-brand to-brand-2" : "bg-line",
              )}
            />
            <span
              className={cn(
                "text-[0.7rem] transition-colors",
                i <= step ? "text-muted" : "text-faint",
              )}
            >
              Step {i + 1}
            </span>
          </div>
        ))}
      </div>

      {steps.map((s, i) => (
        <h2
          key={s.title}
          className="mt-7 text-xl font-semibold"
          hidden={step !== i}
        >
          {s.title}
        </h2>
      ))}

      {/* Honeypot — visually hidden, never announced, must stay empty. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Do not fill this in</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      {/* STEP 1 */}
      {/* All three panels stay mounted; only visibility changes. */}
      <fieldset className="mt-6" data-step="0" hidden={step !== 0}>
          <legend className="sr-only">What do you need help with?</legend>
          <div className="flex flex-col gap-3">
            {serviceOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all",
                  service === option.value
                    ? "border-brand/60 bg-brand/[0.08]"
                    : "border-line hover:border-brand-soft/40",
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register("service")}
                  onChange={() => setValue("service", option.value)}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition-colors",
                    service === option.value
                      ? "border-brand-2"
                      : "border-line",
                  )}
                >
                  {service === option.value && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-2" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-faint">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>


      {/* STEP 2 */}

      <div className="mt-6 flex flex-col gap-5" data-step="1" hidden={step !== 1}>
          <Field
            label="Business name"
            error={errors.business?.message}
            required
          >
            <input
              type="text"
              autoComplete="organization"
              placeholder="Rivera Dental"
              {...register("business")}
              className={inputClass}
            />
          </Field>

          <Field
            label="Website"
            hint="Leave blank if you don't have one — that's useful to know too."
            error={errors.website?.message}
          >
            <input
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="riveradental.com"
              {...register("website")}
              className={inputClass}
            />
          </Field>

          <Field label="What kind of business?" error={errors.industry?.message}>
            <input
              type="text"
              placeholder="Dental practice, plumber, med spa…"
              {...register("industry")}
              className={inputClass}
            />
          </Field>
        </div>


      {/* STEP 3 */}

      <div className="mt-6 flex flex-col gap-5" data-step="2" hidden={step !== 2}>
          <Field label="Your name" error={errors.name?.message} required>
            <input
              type="text"
              autoComplete="name"
              {...register("name")}
              className={inputClass}
            />
          </Field>

          <Field label="Email" error={errors.email?.message} required>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              {...register("email")}
              className={inputClass}
            />
          </Field>

          <Field label="Phone" hint="Optional" error={errors.phone?.message}>
            <input
              type="tel"
              autoComplete="tel"
              {...register("phone")}
              className={inputClass}
            />
          </Field>

          <Field label="Country" error={errors.country?.message} required>
            <select
              autoComplete="country-name"
              {...register("country")}
              className={inputClass}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Anything else?" hint="Optional">
            <textarea
              rows={3}
              placeholder="Anything you want us to look at specifically."
              {...register("notes")}
              className={cn(inputClass, "resize-y")}
            />
          </Field>
        </div>


      {serverError && (
        <p role="alert" className="mt-5 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <ButtonEl
            type="button"
            variant="secondary"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </ButtonEl>
        )}

        {step < steps.length - 1 ? (
          <ButtonEl type="button" onClick={next} className="flex-1">
            Continue
          </ButtonEl>
        ) : (
          <ButtonEl type="submit" disabled={pending} className="flex-1">
            {pending ? "Sending…" : "Send me the audit"}
          </ButtonEl>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-faint">
        We&apos;ll only use this to send your audit and follow up once. No
        newsletter, no list, no sharing it with anyone.
      </p>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-line bg-ink-2/80 px-4 py-3 text-[0.95rem] " +
  "text-fg placeholder:text-faint transition-colors focus:border-brand-2 " +
  "focus:outline-none";

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-brand-2">
            *
          </span>
        )}
      </span>
      {children}
      {hint && !error && <span className="text-xs text-faint">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </label>
  );
}
