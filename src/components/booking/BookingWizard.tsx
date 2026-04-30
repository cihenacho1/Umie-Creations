"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ServicePackage } from "@prisma/client";
import { ServiceType } from "@prisma/client";
import {
  ALL_SERVICE_TYPES,
  SERVICE_LABELS,
  BUDGET_OPTIONS,
} from "@/lib/constants/services";
import { computePaymentDollars } from "@/lib/pricing";
import type { PaymentOption } from "@prisma/client";

const formSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  servicePackageId: z.string().min(1, "Select a package"),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1),
  address: z.string().min(5),
  budgetRange: z.string().optional(),
  notes: z.string().optional(),
  inspirationImageUrl: z.string().optional(),
  customerName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  paymentChoice: z.enum(["deposit", "full", "custom_quote"]),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  "Service",
  "Package",
  "Details",
  "Your info",
  "Review",
] as const;

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-10 flex flex-wrap justify-center gap-2">
      {steps.map((label, i) => (
        <div
          key={label}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-2 sm:py-1.5 text-[0.65rem] sm:text-xs font-medium ${
            i === step
              ? "bg-blush-400 text-white"
              : i < step
                ? "bg-champagne-200 text-cocoa-600"
                : "bg-cream-200 text-cocoa-500"
          }`}
        >
          <span className="tabular-nums">{i + 1}</span>
          <span className="hidden sm:inline">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function BookingWizard({
  initialServiceType,
}: {
  initialServiceType?: ServiceType | null;
}) {
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [step, setStep] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType:
        initialServiceType && ALL_SERVICE_TYPES.includes(initialServiceType)
          ? initialServiceType
          : "EVENT_DECOR",
      servicePackageId: "",
      eventDate: "",
      eventTime: "",
      address: "",
      budgetRange: "",
      notes: "",
      inspirationImageUrl: "",
      customerName: "",
      email: "",
      phone: "",
      paymentChoice: "deposit",
    },
  });

  const serviceType = watch("serviceType");
  const pkgId = watch("servicePackageId");
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then(setPackages)
      .catch(() => setLoadError("Could not load packages"));
  }, []);

  const filteredPackages = useMemo(
    () => packages.filter((p) => p.serviceType === serviceType),
    [packages, serviceType]
  );

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === pkgId),
    [packages, pkgId]
  );

  useEffect(() => {
    if (!filteredPackages.some((p) => p.id === pkgId)) {
      setValue("servicePackageId", "");
    }
  }, [filteredPackages, pkgId, setValue]);

  useEffect(() => {
    if (selectedPackage?.isCustomQuote) {
      setValue("paymentChoice", "custom_quote");
    }
  }, [selectedPackage, setValue]);

  const onFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/upload/inspiration", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setValue("inspirationImageUrl", data.url);
      } catch (e) {
        setSubmitError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [setValue]
  );

  const nextFromStep = async (s: number) => {
    setSubmitError(null);
    const fields: Record<number, (keyof FormValues)[]> = {
      0: ["serviceType"],
      1: ["servicePackageId"],
      2: ["eventDate", "eventTime", "address"],
      3: ["customerName", "email", "phone"],
      4: [],
    };
    const ok = await trigger(fields[s] ?? []);
    if (ok) setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onFinalSubmit = async (values: FormValues) => {
    setSubmitError(null);
    setPending(true);
    try {
      const pkg = packages.find((p) => p.id === values.servicePackageId);
      if (!pkg) throw new Error("Package not found");

      const paymentOption = (values.paymentChoice === "custom_quote"
        ? "custom_quote"
        : values.paymentChoice) as PaymentOption;

      const body = {
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        servicePackageId: values.servicePackageId,
        eventDate: values.eventDate,
        eventTime: values.eventTime,
        address: values.address,
        budgetRange: values.budgetRange || undefined,
        notes: values.notes || undefined,
        inspirationImageUrl: values.inspirationImageUrl || undefined,
        paymentOption,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not save booking");
      }

      if (data.needsCheckout && data.bookingId) {
        const cRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: data.bookingId }),
        });
        const cData = await cRes.json();
        if (!cRes.ok) {
          throw new Error(cData.error || "Checkout could not start");
        }
        if (cData.url) {
          window.location.href = cData.url;
          return;
        }
      }

      window.location.href = "/book/success?quote=1";
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  const depositPreview =
    selectedPackage && !selectedPackage.isCustomQuote
      ? computePaymentDollars(
          Number(selectedPackage.price),
          selectedPackage.depositPercent,
          false,
          "deposit"
        )
      : null;
  const fullPreview =
    selectedPackage && !selectedPackage.isCustomQuote
      ? computePaymentDollars(
          Number(selectedPackage.price),
          selectedPackage.depositPercent,
          false,
          "full"
        )
      : null;

  if (loadError) {
    return (
      <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">{loadError}</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onFinalSubmit)}
      className="rounded-3xl border border-cream-300/80 bg-white/90 p-5 sm:p-6 shadow-soft md:p-10"
    >
      <StepIndicator step={step} />

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-cocoa-700">Select a service</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ALL_SERVICE_TYPES.map((t) => (
              <label
                key={t}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                  serviceType === t
                    ? "border-blush-400 bg-blush-50/50"
                    : "border-cream-200 hover:border-blush-200"
                }`}
              >
                <input
                  type="radio"
                  value={t}
                  className="sr-only"
                  {...register("serviceType")}
                />
                <span className="font-medium text-cocoa-700">
                  {SERVICE_LABELS[t]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-cocoa-700">Choose your package</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredPackages.map((p) => (
              <label
                key={p.id}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                  pkgId === p.id
                    ? "border-blush-400 bg-blush-50/50"
                    : "border-cream-200 hover:border-blush-200"
                }`}
              >
                <input
                  type="radio"
                  value={p.id}
                  className="sr-only"
                  {...register("servicePackageId")}
                />
                <p className="font-serif text-lg text-cocoa-700">{p.name}</p>
                <p className="mt-1 text-sm text-cocoa-600">{p.description}</p>
                <p className="mt-2 font-medium text-blush-500">
                  {p.isCustomQuote
                    ? "Custom quote"
                    : `$${Number(p.price)} · deposit ${p.depositPercent}%`}
                </p>
              </label>
            ))}
          </div>
          {errors.servicePackageId && (
            <p className="text-sm text-red-600">{errors.servicePackageId.message}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-cocoa-700">
            Event & delivery details
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-cocoa-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-3 sm:py-2 text-cocoa-700"
                {...register("eventDate")}
              />
              {errors.eventDate && (
                <p className="text-sm text-red-600">{errors.eventDate.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-cocoa-700">Time</label>
              <input
                type="time"
                className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-cocoa-700"
                {...register("eventTime")}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">
              Event location or delivery address
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-cocoa-700"
              {...register("address")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">Budget range</label>
            <select
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-cocoa-700"
              {...register("budgetRange")}
            >
              <option value="">Select (optional)</option>
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">
              Notes & inspiration
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-cocoa-700"
              placeholder="Color palette, Pinterest links, vibe words..."
              {...register("notes")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">
              Inspiration photo (optional)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm text-cocoa-600"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {uploading && (
              <p className="mt-1 text-xs text-cocoa-500">Uploading…</p>
            )}
            {watch("inspirationImageUrl") && (
              <p className="mt-1 break-all text-xs text-green-700">Image attached</p>
            )}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl text-cocoa-700">Your contact details</h2>
          <div>
            <label className="text-sm font-medium text-cocoa-700">Full name</label>
            <input
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2"
              {...register("customerName")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2"
              {...register("email")}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-cocoa-700">Phone</label>
            <input
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2"
              {...register("phone")}
            />
          </div>
        </div>
      )}

      {step === 4 && selectedPackage && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-cocoa-700">Review & payment</h2>
          <div className="rounded-2xl bg-cream-100/80 p-6 text-sm text-cocoa-700">
            <p>
              <strong>Service:</strong> {SERVICE_LABELS[serviceType]}
            </p>
            <p className="mt-2">
              <strong>Package:</strong> {selectedPackage.name}
            </p>
            <p className="mt-2">
              <strong>Date:</strong> {watch("eventDate")} at {watch("eventTime")}
            </p>
            <p className="mt-2">
              <strong>Location:</strong> {watch("address")}
            </p>
            <p className="mt-2">
              <strong>Contact:</strong> {watch("customerName")} · {watch("email")}{" "}
              · {watch("phone")}
            </p>
          </div>

          {selectedPackage.isCustomQuote ? (
            <p className="rounded-xl bg-champagne-100 px-4 py-3 text-sm text-cocoa-700">
              We&apos;ll review your details and follow up with a custom quote —
              no payment is collected online for this option.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-cocoa-700">Payment option</p>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-300 p-4">
                <input
                  type="radio"
                  value="deposit"
                  {...register("paymentChoice")}
                />
                <span>
                  <span className="font-medium">Deposit</span>
                  <span className="block text-sm text-cocoa-600">
                    Pay {selectedPackage.depositPercent}% now ($
                    {depositPreview != null ? depositPreview.toFixed(2) : "—"}
                    )
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-cream-300 p-4">
                <input type="radio" value="full" {...register("paymentChoice")} />
                <span>
                  <span className="font-medium">Pay in full</span>
                  <span className="block text-sm text-cocoa-600">
                    {fullPreview != null ? `$${fullPreview.toFixed(2)}` : "—"}
                  </span>
                </span>
              </label>
            </div>
          )}

          {submitError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-cocoa-600 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-cocoa-700 disabled:opacity-60"
          >
            {pending
              ? "Processing…"
              : selectedPackage.isCustomQuote
                ? "Submit inquiry"
                : "Proceed to secure checkout"}
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-between gap-3 sm:gap-4">
        <button
          type="button"
          className="rounded-full border border-cream-300 px-6 py-3 sm:py-2 text-sm font-medium text-cocoa-600 hover:bg-cream-100 flex-1 sm:flex-none"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || pending}
        >
          Back
        </button>
        {step < steps.length - 1 && (
          <button
            type="button"
            className="rounded-full bg-blush-400 px-6 py-3 sm:py-2 text-sm font-semibold text-white hover:bg-blush-500 flex-1 sm:flex-none"
            onClick={() => nextFromStep(step)}
          >
            Continue
          </button>
        )}
      </div>
    </form>
  );
}
