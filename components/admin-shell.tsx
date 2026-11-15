"use client"

import { useMemo, useState } from "react"
import {
  Baby,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  Sparkles,
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"
import { EventSettings } from "@/components/event-settings"
import { GuestManagement } from "@/components/guest-management"
import { OverviewSection } from "@/components/overview-section"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { initialEvent, initialFamilies, type EventDetails, type Family } from "@/lib/guest-data"

type Section = "dashboard" | "guests" | "settings"
type SidebarProps = {
  active: Section
  onNavigate: (section: Section) => void
  onSignOut: () => void
  event: EventDetails
  mobile?: boolean
}

const navigation: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "guests", label: "Invitados", icon: UsersRound },
  { id: "settings", label: "Configuración", icon: Settings2 },
]

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="relative flex size-11 items-center justify-center rounded-2xl bg-rose/70 text-brown">
        <Baby aria-hidden="true" className="size-5" strokeWidth={1.55} />
        <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#FBF7F1] bg-gold" />
      </div>
      <div className="leading-none">
        <p className="font-display text-[23px] font-semibold tracking-[0.015em] text-brown">Bautizo Azua</p>
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-brown/55">Panel de invitaciones</p>
      </div>
    </div>
  )
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`))
}

function SidebarContent({ active, onNavigate, onSignOut, event, mobile = false }: SidebarProps) {
  return (
    <>
      <div className="px-6 pb-8 pt-7">
        <Brand />
      </div>
      <div className="px-6 pb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brown/45">Menú principal</div>
      <nav aria-label="Navegación principal" className="flex flex-col gap-1 px-3">
        {navigation.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onNavigate(id)}
              className={`group flex h-11 items-center gap-3 rounded-xl px-3.5 text-left text-[14px] transition-colors ${
                isActive
                  ? "bg-white text-brown shadow-[0_3px_14px_rgba(92,68,48,0.06)]"
                  : "text-brown/65 hover:bg-white/70 hover:text-brown"
              }`}
            >
              <Icon aria-hidden="true" className={`size-[18px] ${isActive ? "text-[#A47D5D]" : "text-brown/50 group-hover:text-brown"}`} strokeWidth={1.7} />
              <span className={isActive ? "font-semibold" : "font-medium"}>{label}</span>
              {isActive && <span className="ml-auto size-1.5 rounded-full bg-gold" />}
            </button>
          )
        })}
      </nav>
      <div className="mt-auto px-3 pb-5 pt-8">
        <div className="mb-4 rounded-2xl border border-[#EDE2D5] bg-white/70 p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-brown/60">
            <CalendarDays aria-hidden="true" className="size-3.5 text-gold" />
            Evento activo
          </div>
          <p className="font-display text-[20px] leading-5 text-brown">{event.name.replace("Bautizo de ", "")}</p>
          <p className="mt-1 text-xs text-brown/55">{formatEventDate(event.date)}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="flex h-10 w-full items-center gap-3 rounded-xl px-3.5 text-left text-sm font-medium text-brown/55 transition-colors hover:bg-white/70 hover:text-brown"
        >
          <LogOut aria-hidden="true" className="size-[17px]" strokeWidth={1.7} />
          Cerrar sesión
        </button>
        {mobile && <p className="px-3.5 pt-3 text-[10px] text-brown/40">Versión de demostración · v1.0</p>}
      </div>
    </>
  )
}

function Sidebar({ active, onNavigate, onSignOut, event }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col border-r border-[#EEE5DB] bg-[#FBF7F1] lg:flex">
      <SidebarContent active={active} onNavigate={onNavigate} onSignOut={onSignOut} event={event} />
    </aside>
  )
}

function MobileNavigation({ active, onNavigate, onSignOut, event }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const handleNavigate = (section: Section) => {
    onNavigate(section)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="outline" size="icon" aria-label="Abrir menú" className="border-[#E9DED1] bg-white/80 text-brown" />}>
          <Menu aria-hidden="true" />
        </SheetTrigger>
        <SheetContent side="left" className="flex w-[min(84vw,300px)] flex-col border-[#EEE5DB] bg-[#FBF7F1] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú de Bautizo Azua</SheetTitle>
          </SheetHeader>
          <SidebarContent active={active} onNavigate={handleNavigate} onSignOut={onSignOut} event={event} mobile />
        </SheetContent>
      </Sheet>
      <Brand />
    </div>
  )
}

function getSectionTitle(section: Section) {
  if (section === "guests") return "Invitados"
  if (section === "settings") return "Configuración"
  return "Dashboard"
}

export function AdminShell() {
  const [activeSection, setActiveSection] = useState<Section>("dashboard")
  const [families, setFamilies] = useState<Family[]>(initialFamilies)
  const [event, setEvent] = useState<EventDetails>(initialEvent)

  const summary = useMemo(() => ({
    familyCount: families.length,
    authorized: families.reduce((total, family) => total + family.authorized, 0),
    confirmed: families.reduce((total, family) => total + family.confirmed, 0),
    pending: families.filter((family) => family.status === "Pendiente").length,
    rejected: families.filter((family) => family.status === "Rechazado").length,
  }), [families])

  const handleFamilySave = (savedFamily: Family) => {
    setFamilies((current) => {
      const exists = current.some((family) => family.id === savedFamily.id)
      return exists
        ? current.map((family) => family.id === savedFamily.id ? savedFamily : family)
        : [savedFamily, ...current]
    })
    toast.success("Familia guardada", { description: "Los cambios son temporales en esta sesión." })
  }

  const handleDeleteFamily = (id: number) => {
    setFamilies((current) => current.filter((family) => family.id !== id))
    toast.success("Familia eliminada de la vista previa")
  }

  const handleCopyLink = async (family: Family) => {
    const link = `https://bautizo-azua.com/invitacion/${family.id}`
    try {
      await navigator.clipboard.writeText(link)
      toast.success("Enlace copiado", { description: `Invitación para ${family.name}` })
    } catch {
      toast.error("No se pudo copiar el enlace", { description: "Verifica los permisos del navegador." })
    }
  }

  const handleShareWhatsApp = (family: Family) => {
    const message = `Hola, ${family.name}. Te compartimos la invitación al ${event.name}: https://bautizo-azua.com/invitacion/${family.id}`
    const phone = family.phone.replace(/\D/g, "")
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
  }

  const handleSignOut = () => {
    toast.info("La autenticación se integrará en una etapa posterior.")
  }

  return (
    <div className="min-h-svh bg-ivory text-ink">
      <Sidebar active={activeSection} onNavigate={setActiveSection} onSignOut={handleSignOut} event={event} />
      <div className="min-h-svh lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between border-b border-[#EEE5DB]/80 bg-ivory/90 px-4 backdrop-blur-md sm:px-7 lg:px-10">
          <MobileNavigation active={activeSection} onNavigate={setActiveSection} onSignOut={handleSignOut} event={event} />
          <div className="hidden items-center gap-2 text-sm text-brown/50 lg:flex">
            <span>Administración</span>
            <span aria-hidden="true" className="text-[#CBB9A8]">/</span>
            <span className="font-medium text-brown">{getSectionTitle(activeSection)}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[#EDE2D5] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-brown/60 sm:flex">
              <span className="size-1.5 rounded-full bg-[#A3AE8D]" />
              Vista previa · datos de ejemplo
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-[#EAD7CB] font-display text-lg font-semibold text-brown" aria-label="Ana María">
              AM
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-7 sm:px-7 sm:pt-9 lg:px-10 lg:pt-10">
          {activeSection === "dashboard" && <OverviewSection event={event} summary={summary} families={families} onViewGuests={() => setActiveSection("guests")} />}
          {activeSection === "guests" && (
            <GuestManagement
              families={families}
              onSaveFamily={handleFamilySave}
              onDeleteFamily={handleDeleteFamily}
              onCopyLink={handleCopyLink}
              onShareWhatsApp={handleShareWhatsApp}
            />
          )}
          {activeSection === "settings" && <EventSettings event={event} onSave={setEvent} />}
        </main>
        <footer className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 border-t border-[#EEE5DB] px-4 py-5 text-[11px] text-brown/45 sm:px-7 lg:px-10">
          <span className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-3.5 text-gold" /> Bautizo Azua</span>
          <span>Panel de gestión · Datos temporales</span>
        </footer>
      </div>
    </div>
  )
}
