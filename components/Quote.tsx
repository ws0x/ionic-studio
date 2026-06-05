"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n";
import { projectTypeOptions } from "@/lib/content";
import { site, waLink } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function Quote() {
  const { t, locale } = useLocale();
  const [form, setForm] = useState({ name: "", phone: "", type: "", area: "", city: "", details: "" });
  const [error, setError] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setError(true); return; }
    setError(false);

    const typeLabel = projectTypeOptions.find((o) => o.value === form.type)?.label[locale] ?? "";
    const L = locale === "ar"
      ? { head: "طلب عرض سعر جديد", name: "الاسم", phone: "الهاتف", type: "نوع المشروع", area: "المساحة", city: "المنطقة", details: "تفاصيل" }
      : { head: "New quote request", name: "Name", phone: "Phone", type: "Project type", area: "Area", city: "City", details: "Details" };

    const msg = [
      `*${L.head}: ${site.name[locale]}*`,
      `${L.name}: ${form.name}`,
      `${L.phone}: ${form.phone}`,
      `${L.type}: ${typeLabel}`,
      form.area && `${L.area}: ${form.area} m²`,
      form.city && `${L.city}: ${form.city}`,
      form.details && `${L.details}: ${form.details}`,
    ].filter(Boolean).join("\n");

    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  };

  const field = "h-12 w-full rounded-xl border border-line bg-mist px-4 text-sm text-ink outline-none transition-all placeholder:text-platinum/60 focus:border-ink focus:bg-paper focus:ring-0 cursor-text";

  return (
    <section id="quote" className="bg-off-white py-24 md:py-36">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={t("quote.eyebrow")}
          title={t("quote.title")}
          subtitle={t("quote.subtitle")}
          align="center"
        />

        <Reveal className="mt-14 rounded-3xl bg-paper p-6 card-shadow sm:p-10">
          <form onSubmit={submit} noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Labeled label={t("quote.name")} required>
                <input className={field} value={form.name} onChange={set("name")} placeholder={t("quote.namePh")} autoComplete="name" />
              </Labeled>
              <Labeled label={t("quote.phone")} required>
                <input className={field} value={form.phone} onChange={set("phone")} placeholder={t("quote.phonePh")} inputMode="tel" autoComplete="tel" dir="ltr" />
              </Labeled>
              <Labeled label={t("quote.type")}>
                <select className={`${field} appearance-none cursor-pointer`} value={form.type} onChange={set("type")}>
                  <option value="">{t("quote.selectType")}</option>
                  {projectTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label[locale]}</option>
                  ))}
                </select>
              </Labeled>
              <Labeled label={t("quote.area")}>
                <input className={field} value={form.area} onChange={set("area")} placeholder={t("quote.areaPh")} inputMode="numeric" />
              </Labeled>
              <div className="sm:col-span-2">
                <Labeled label={t("quote.city")}>
                  <input className={field} value={form.city} onChange={set("city")} placeholder={t("quote.cityPh")} />
                </Labeled>
              </div>
              <div className="sm:col-span-2">
                <Labeled label={t("quote.details")}>
                  <textarea className={`${field} h-28 resize-none py-3`} value={form.details} onChange={set("details")} placeholder={t("quote.detailsPh")} />
                </Labeled>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-xs font-medium text-ink">{t("quote.required")}</p>
            )}

            <button
              type="submit"
              className="btn-primary mt-7 w-full justify-center cursor-pointer"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm4.4 12c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 01-1.9-1.2 7.2 7.2 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.8 2.8 0 006 8.8a4.9 4.9 0 001 2.6 11 11 0 004.3 3.8c.6.3 1.1.4 1.5.5a3.5 3.5 0 001.6.1 2.6 2.6 0 001.7-1.2 2.1 2.1 0 00.2-1.2c-.1-.1-.3-.2-.5-.3z" />
              </svg>
              {t("quote.submit")}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Labeled({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block cursor-pointer">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-platinum">
        {label}{required && <span className="ms-1 text-ink">*</span>}
      </span>
      {children}
    </label>
  );
}
