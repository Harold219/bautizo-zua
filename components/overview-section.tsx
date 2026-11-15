import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  UsersRound,
  UserRoundCheck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EventDetails, Family, InvitationStatus } from "@/lib/guest-data"

type Summary = {
  familyCount: number
  authorized: number
  confirmed: number
  pending: number
  rejected: number
}

type OverviewSectionProps = {
  event: EventDetails
  summary: Summary
  families: Family[]
  onViewGuests: () => void
}

const statusStyles: Record<InvitationStatus, string> = {
  Confirmado: "border-[#D8E5D6] bg-[#F2F7F0] text-[#587354]",
  Pendiente: "border-[#E8DCC5] bg-[#FAF5EA] text-[#987B47]",
  Rechazado: "border-[#E9D6D2] bg-[#FBF1EF] text-[#A3635C]",
}

function formatResponseDate(value?: string) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short" }).format(new Date(value))
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  className = "",
}: {
  label: string
  value: number
  detail: string
  icon: typeof UsersRound
  tone: "rose" | "gold" | "green" | "sand" | "clay"
  className?: string
}) {
  const toneClasses = {
    rose: "bg-[#F9E9EA] text-[#A76E75]",
    gold: "bg-[#F6EEDC] text-[#9D804C]",
    green: "bg-[#EDF2E9] text-[#6F866B]",
    sand: "bg-[#F4EDE4] text-[#8C715A]",
    clay: "bg-[#F5E8E2] text-[#A86E5A]",
  }

  return (
    <Card className={`${className} min-w-0 gap-5 border-[#EEE5DB] bg-white/85 py-5 shadow-[0_8px_28px_rgba(75,54,38,0.035)] sm:py-5`}>
      <CardHeader className="flex-row items-start justify-between gap-3 px-5 pb-0 sm:px-5">
        <div className="min-w-0">
          <p className="text-[11px] font-medium leading-4 text-brown/60 sm:text-xs">{label}</p>
          <p className="mt-2 font-display text-[32px] leading-none text-brown sm:text-[36px]">{value}</p>
        </div>
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon aria-hidden="true" className="size-[17px]" strokeWidth={1.7} />
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-0">
        <p className="text-[10px] leading-4 text-brown/45 sm:text-[11px]">{detail}</p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  return <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[status]}`}>{status}</Badge>
}

function DistributionCard({ summary }: { summary: Summary }) {
  const total = summary.familyCount || 1
  const confirmedDegrees = (summary.familyCount - summary.pending - summary.rejected) / total * 100
  const pendingDegrees = summary.pending / total * 100
  const rejectedDegrees = summary.rejected / total * 100
  const gradient = `conic-gradient(#A77B69 0% ${confirmedDegrees}%, #D0B06F ${confirmedDegrees}% ${confirmedDegrees + pendingDegrees}%, #D9A3A4 ${confirmedDegrees + pendingDegrees}% ${confirmedDegrees + pendingDegrees + rejectedDegrees}%, #EFE6DC ${confirmedDegrees + pendingDegrees + rejectedDegrees}% 100%)`
  const entries = [
    { label: "Confirmadas", count: summary.familyCount - summary.pending - summary.rejected, color: "bg-[#A77B69]" },
    { label: "Pendientes", count: summary.pending, color: "bg-[#D0B06F]" },
    { label: "Rechazadas", count: summary.rejected, color: "bg-[#D9A3A4]" },
  ]

  return (
    <Card className="gap-5 border-[#EEE5DB] bg-white/85 py-5 shadow-[0_8px_28px_rgba(75,54,38,0.035)]">
      <CardHeader className="px-5 pb-0 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display text-[25px] font-medium text-brown">Estado de las invitaciones</CardTitle>
            <p className="mt-1 text-xs text-brown/50">Distribución por familia</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-[#FBF5EC] text-[#9B7958]">
            <CircleCheck aria-hidden="true" className="size-[17px]" strokeWidth={1.7} />
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 px-5 pb-1 sm:flex-row sm:justify-center sm:gap-8 sm:px-6">
        <div
          role="img"
          aria-label={`Gráfico de invitaciones: ${entries[0].count} confirmadas, ${entries[1].count} pendientes y ${entries[2].count} rechazadas`}
          className="relative flex size-[148px] shrink-0 items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="flex size-[106px] flex-col items-center justify-center rounded-full bg-white">
            <span className="font-display text-[34px] leading-none text-brown">{summary.familyCount}</span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.16em] text-brown/45">familias</span>
          </div>
        </div>
        <div className="grid w-full gap-4 sm:max-w-[195px]">
          {entries.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className={`size-2.5 rounded-full ${entry.color}`} />
                <span className="text-xs text-brown/65">{entry.label}</span>
              </div>
              <span className="text-sm font-semibold tabular-nums text-brown">{entry.count}</span>
            </div>
          ))}
          <div className="mt-1 border-t border-[#F0E8DF] pt-3 text-[10px] text-brown/45">Invitaciones enviadas a {summary.familyCount} familias</div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentConfirmations({ families }: { families: Family[] }) {
  const confirmations = [...families]
    .filter((family) => family.status === "Confirmado")
    .sort((left, right) => (right.respondedAt ?? "").localeCompare(left.respondedAt ?? ""))
    .slice(0, 5)

  return (
    <Card className="gap-0 border-[#EEE5DB] bg-white/85 py-5 shadow-[0_8px_28px_rgba(75,54,38,0.035)]">
      <CardHeader className="flex-row items-center justify-between gap-3 px-5 pb-4 sm:px-6">
        <div>
          <CardTitle className="font-display text-[25px] font-medium text-brown">Confirmaciones recientes</CardTitle>
          <p className="mt-1 text-xs text-brown/50">Las últimas respuestas de tus invitados</p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F4EDE4] text-[#8C715A]">
          <Clock3 aria-hidden="true" className="size-[17px]" strokeWidth={1.7} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-y-[#F1E9E0] hover:bg-transparent">
                <TableHead className="pl-5 text-[10px] font-medium uppercase tracking-[0.12em] text-brown/45 sm:pl-6">Familia</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-[0.12em] text-brown/45">Asistentes</TableHead>
                <TableHead className="pr-5 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-brown/45 sm:pr-6">Respuesta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {confirmations.length > 0 ? confirmations.map((family) => (
                <TableRow key={family.id} className="border-[#F4EEE7]">
                  <TableCell className="min-w-[180px] py-3.5 pl-5 sm:pl-6">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F7ECEA] font-display text-sm text-[#8C655F]">
                        {family.name.replace("Familia ", "").slice(0, 1)}
                      </span>
                      <span className="text-xs font-medium text-brown">{family.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-brown/65">{family.confirmed} de {family.authorized}</TableCell>
                  <TableCell className="py-3.5 pr-5 text-right text-xs text-brown/50 sm:pr-6">{formatResponseDate(family.respondedAt)}</TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={3} className="py-9 text-center text-sm text-brown/50">Aún no hay confirmaciones.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function OverviewSection({ event, summary, families, onViewGuests }: OverviewSectionProps) {
  const eventDate = new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${event.date}T12:00:00`))
  const stats = [
    { label: "Familias invitadas", value: summary.familyCount, detail: "En la lista de invitados", icon: UsersRound, tone: "rose" as const },
    { label: "Personas autorizadas", value: summary.authorized, detail: "Cupos totales asignados", icon: UserRoundCheck, tone: "gold" as const },
    { label: "Asistentes confirmados", value: summary.confirmed, detail: "Personas que nos acompañan", icon: Check, tone: "green" as const },
    { label: "Invitaciones pendientes", value: summary.pending, detail: "Familias por responder", icon: Clock3, tone: "sand" as const },
    { label: "Invitaciones rechazadas", value: summary.rejected, detail: "Familias que no asistirán", icon: X, tone: "clay" as const },
  ]

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#A28361]">
            <span className="size-1.5 rounded-full bg-gold" />
            Resumen de la celebración
          </div>
          <h1 className="font-display text-[38px] font-medium leading-[0.98] tracking-[-0.02em] text-brown sm:text-[48px]">Todo listo para un día especial</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-brown/60">Un vistazo sencillo a las invitaciones y respuestas de {event.name.replace("Bautizo de ", "")}.</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#EDE2D5] bg-white/65 px-4 py-3 sm:mb-1">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#F6EDEA] text-[#A06F69]"><CalendarDays aria-hidden="true" className="size-[18px]" strokeWidth={1.7} /></span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-brown/45">Fecha del evento</p>
            <p className="mt-0.5 text-sm font-medium text-brown">{eventDate}</p>
          </div>
        </div>
      </section>

      <section aria-label="Indicadores de invitaciones" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        {stats.map((stat, index) => <StatCard key={stat.label} {...stat} className={index === 4 ? "col-span-2 xl:col-span-1" : ""} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <DistributionCard summary={summary} />
        <RecentConfirmations families={families} />
      </section>

      <section className="relative overflow-hidden rounded-[22px] border border-[#EADFD2] bg-[#F6EDE5] px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full border border-[#E6D7C8] sm:right-24 sm:size-52" />
        <div className="pointer-events-none absolute -right-4 -top-8 size-32 rounded-full border border-[#E6D7C8] sm:right-32 sm:size-40" />
        <div className="relative flex items-start gap-3.5">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#987B5B]"><CircleCheck aria-hidden="true" className="size-[18px]" strokeWidth={1.7} /></div>
          <div>
            <h2 className="font-display text-[24px] font-medium leading-tight text-brown">Tu lista, siempre al día</h2>
            <p className="mt-1 max-w-lg text-xs leading-5 text-brown/60">Consulta cada familia, revisa los cupos y comparte su invitación cuando lo necesites.</p>
          </div>
        </div>
        <Button onClick={onViewGuests} className="relative mt-4 h-10 rounded-xl bg-brown px-4 text-xs font-medium text-white hover:bg-[#584A3F] sm:mt-0">
          Ver invitados <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </section>
    </div>
  )
}
