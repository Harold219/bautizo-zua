"use client"

import { useState, type FormEvent } from "react"
import { UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Family, InvitationStatus } from "@/lib/guest-data"

type FamilyDialogProps = {
  open: boolean
  family: Family | null
  onOpenChange: (open: boolean) => void
  onSave: (family: Family) => void
}

export function FamilyDialog({ open, family, onOpenChange, onSave }: FamilyDialogProps) {
  const [name, setName] = useState(family?.name ?? "")
  const [phone, setPhone] = useState(family?.phone ?? "")
  const [authorized, setAuthorized] = useState(String(family?.authorized ?? 2))
  const [confirmed, setConfirmed] = useState(String(family?.confirmed ?? 0))
  const [status, setStatus] = useState<InvitationStatus>(family?.status ?? "Pendiente")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const authorizedCount = Math.max(1, Number.parseInt(authorized, 10) || 1)
    const confirmedCount = status === "Confirmado"
      ? Math.min(authorizedCount, Math.max(1, Number.parseInt(confirmed, 10) || 1))
      : 0

    onSave({
      id: family?.id ?? Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      authorized: authorizedCount,
      confirmed: confirmedCount,
      status,
      respondedAt: status === "Pendiente" ? undefined : new Date().toISOString(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto rounded-2xl border-[#EDE2D5] bg-[#FFFEFC] p-5 sm:max-w-[500px] sm:p-6">
        <DialogHeader className="gap-2 pr-8">
          <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-[#F7EAE8] text-[#9A6F69]"><UserRoundPlus aria-hidden="true" className="size-[18px]" strokeWidth={1.7} /></span>
          <DialogTitle className="font-display text-[30px] font-medium text-brown">{family ? "Editar familia" : "Agregar familia"}</DialogTitle>
          <DialogDescription className="text-xs leading-5 text-brown/55">
            Completa los datos de la invitación. Puedes editarlos nuevamente en cualquier momento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-5">
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="family-name" className="text-xs font-medium text-brown">Nombre de la familia</FieldLabel>
              <Input id="family-name" required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Familia García" className="h-10 rounded-xl border-[#E9DED1] bg-white text-sm placeholder:text-brown/35" />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="family-phone" className="text-xs font-medium text-brown">Teléfono de contacto</FieldLabel>
              <Input id="family-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 809 555 0123" className="h-10 rounded-xl border-[#E9DED1] bg-white text-sm placeholder:text-brown/35" />
            </Field>
            <Field>
              <FieldLabel htmlFor="family-authorized" className="text-xs font-medium text-brown">Cupos autorizados</FieldLabel>
              <Input id="family-authorized" type="number" min={1} max={30} required value={authorized} onChange={(event) => setAuthorized(event.target.value)} className="h-10 rounded-xl border-[#E9DED1] bg-white text-sm" />
            </Field>
            <Field>
              <FieldLabel htmlFor="family-confirmed" className="text-xs font-medium text-brown">Asistentes confirmados</FieldLabel>
              <Input id="family-confirmed" type="number" min={0} max={Number(authorized) || 30} value={confirmed} onChange={(event) => setConfirmed(event.target.value)} disabled={status !== "Confirmado"} className="h-10 rounded-xl border-[#E9DED1] bg-white text-sm disabled:bg-[#F8F4EF]" />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="family-status" className="text-xs font-medium text-brown">Estado de la invitación</FieldLabel>
              <Select value={status} onValueChange={(value) => { if (value) setStatus(value as InvitationStatus) }}>
                <SelectTrigger id="family-status" className="h-10 w-full rounded-xl border-[#E9DED1] bg-white px-3 text-sm text-brown">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                    <SelectItem value="Rechazado">Rechazado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter className="mx-0 mb-0 flex-row border-0 bg-transparent p-0 pt-1 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 rounded-xl border-[#E9DED1] bg-white px-4 text-xs text-brown">Cancelar</Button>
            <Button type="submit" className="h-10 rounded-xl bg-brown px-4 text-xs text-white hover:bg-[#584A3F]">Guardar familia</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
