"use client"

import { useState, type FormEvent } from "react"
import { CalendarCheck2, CalendarDays, Check, CircleHelp, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { EventDetails } from "@/lib/guest-data"

type EventSettingsProps = {
  event: EventDetails
  onSave: (event: EventDetails) => void
}

export function EventSettings({ event, onSave }: EventSettingsProps) {
  const [draft, setDraft] = useState<EventDetails>(event)

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault()
    onSave(draft)
    toast.success("Configuración actualizada", { description: "El cambio se guarda de forma temporal en esta sesión." })
  }

  const updateField = (field: keyof EventDetails, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="flex max-w-[980px] flex-col gap-7 sm:gap-8">
      <section>
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#A28361]">
          <span className="size-1.5 rounded-full bg-gold" />
          Personalización
        </div>
        <h1 className="font-display text-[40px] font-medium leading-none tracking-[-0.02em] text-brown sm:text-[48px]">Configuración del evento</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-brown/60">Mantén actualizados los datos principales de la celebración.</p>
      </section>

      <Card className="gap-0 border-[#EEE5DB] bg-white/85 py-0 shadow-[0_8px_28px_rgba(75,54,38,0.035)]">
        <CardHeader className="border-b border-[#F0E8DF] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EAE8] text-[#9A6F69]"><CalendarCheck2 aria-hidden="true" className="size-[18px]" strokeWidth={1.7} /></span>
            <div>
              <CardTitle className="font-display text-[27px] font-medium text-brown">Detalles del evento</CardTitle>
              <CardDescription className="mt-1 text-xs leading-5 text-brown/50">Esta información ayuda a mantener cada invitación actualizada.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FieldGroup className="grid gap-5 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <FieldLabel htmlFor="event-name" className="text-xs font-medium text-brown">Nombre del evento</FieldLabel>
                <Input id="event-name" required maxLength={80} value={draft.name} onChange={(event) => updateField("name", event.target.value)} className="h-11 rounded-xl border-[#E9DED1] bg-[#FFFEFC] text-sm text-brown focus-visible:border-gold focus-visible:ring-gold/20" />
              </Field>
              <Field>
                <FieldLabel htmlFor="event-date" className="text-xs font-medium text-brown">Fecha del evento</FieldLabel>
                <div className="relative">
                  <Input id="event-date" type="date" required value={draft.date} onChange={(event) => updateField("date", event.target.value)} className="h-11 rounded-xl border-[#E9DED1] bg-[#FFFEFC] text-sm text-brown focus-visible:border-gold focus-visible:ring-gold/20" />
                  <CalendarDays aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brown/40" />
                </div>
                <p className="text-[11px] leading-5 text-brown/45">Día en que se celebrará el bautizo.</p>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmation-deadline" className="text-xs font-medium text-brown">Fecha límite de confirmación</FieldLabel>
                <div className="relative">
                  <Input id="confirmation-deadline" type="date" required value={draft.deadline} onChange={(event) => updateField("deadline", event.target.value)} className="h-11 rounded-xl border-[#E9DED1] bg-[#FFFEFC] text-sm text-brown focus-visible:border-gold focus-visible:ring-gold/20" />
                  <CalendarDays aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brown/40" />
                </div>
                <p className="text-[11px] leading-5 text-brown/45">Último día para recibir respuestas.</p>
              </Field>
            </FieldGroup>

            <div className="flex flex-col gap-4 border-t border-[#F0E8DF] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5 text-[11px] leading-5 text-brown/50">
                <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#A58B6C]" />
                Los cambios se aplican solo a esta demostración y se perderán al recargar la página.
              </div>
              <Button type="submit" className="h-10 shrink-0 rounded-xl bg-brown px-4 text-xs font-medium text-white hover:bg-[#584A3F]">
                <Save aria-hidden="true" data-icon="inline-start" />
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-2xl border border-[#E6E3D7] bg-[#F6F6EF] p-4 sm:p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#708267]"><Check aria-hidden="true" className="size-4" /></span>
        <div>
          <p className="text-xs font-semibold text-brown">Listo para conectar</p>
          <p className="mt-1 max-w-2xl text-[11px] leading-5 text-brown/55">La información de este formulario está aislada en el navegador. En una siguiente etapa, estos campos podrán enlazarse a la configuración del evento en tu base de datos.</p>
        </div>
      </div>
    </div>
  )
}
