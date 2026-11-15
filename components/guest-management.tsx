"use client"

import { useMemo, useState, type FormEvent } from "react"
import {
  Check,
  CircleX,
  Clock3,
  Copy,
  Ellipsis,
  MessageCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FamilyDialog } from "@/components/family-dialog"
import type { Family, InvitationStatus } from "@/lib/guest-data"

type StatusFilter = "Todas" | InvitationStatus

type GuestManagementProps = {
  families: Family[]
  onSaveFamily: (family: Family) => void
  onDeleteFamily: (id: number) => void
  onCopyLink: (family: Family) => void
  onShareWhatsApp: (family: Family) => void
}

const statusStyles: Record<InvitationStatus, string> = {
  Pendiente: "border-[#E8DCC5] bg-[#FAF5EA] text-[#987B47]",
  Confirmado: "border-[#D8E5D6] bg-[#F2F7F0] text-[#587354]",
  Rechazado: "border-[#E9D6D2] bg-[#FBF1EF] text-[#A3635C]",
}

function StatusBadge({ status }: { status: InvitationStatus }) {
  const StatusIcon = status === "Confirmado" ? Check : status === "Rechazado" ? CircleX : Clock3
  return (
    <Badge variant="outline" className={`gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${statusStyles[status]}`}>
      <StatusIcon aria-hidden="true" className="size-3" strokeWidth={2} />
      {status}
    </Badge>
  )
}

function getInitials(name: string) {
  return name.replace("Familia ", "").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

export function GuestManagement({ families, onSaveFamily, onDeleteFamily, onCopyLink, onShareWhatsApp }: GuestManagementProps) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todas")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFamily, setEditingFamily] = useState<Family | null>(null)
  const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null)

  const filteredFamilies = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es")
    return families.filter((family) => {
      const matchesQuery = !normalizedQuery || family.name.toLocaleLowerCase("es").includes(normalizedQuery) || family.phone.includes(normalizedQuery)
      const matchesStatus = statusFilter === "Todas" || family.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [families, query, statusFilter])

  const openCreateDialog = () => {
    setEditingFamily(null)
    setDialogOpen(true)
  }

  const openEditDialog = (family: Family) => {
    setEditingFamily(family)
    setDialogOpen(true)
  }

  const saveFamily = (family: Family) => {
    onSaveFamily(family)
    setDialogOpen(false)
    setEditingFamily(null)
  }

  const confirmDelete = () => {
    if (!familyToDelete) return
    onDeleteFamily(familyToDelete.id)
    setFamilyToDelete(null)
  }

  const clearFilters = () => {
    setQuery("")
    setStatusFilter("Todas")
  }

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.19em] text-[#A28361]">
            <span className="size-1.5 rounded-full bg-gold" />
            Organización
          </div>
          <h1 className="font-display text-[40px] font-medium leading-none tracking-[-0.02em] text-brown sm:text-[48px]">Familias invitadas</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-brown/60">Gestiona tus invitaciones, cupos y respuestas en un solo lugar.</p>
        </div>
        <Button onClick={openCreateDialog} className="h-10 w-full rounded-xl bg-brown px-4 text-xs font-medium text-white shadow-sm hover:bg-[#584A3F] sm:w-auto">
          <Plus aria-hidden="true" data-icon="inline-start" />
          Agregar familia
        </Button>
      </section>

      <Card className="gap-0 overflow-hidden border-[#EEE5DB] bg-white/85 py-0 shadow-[0_8px_28px_rgba(75,54,38,0.035)]">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4 border-b border-[#F0E8DF] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[270px]">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brown/40" strokeWidth={1.7} />
                <Input
                  aria-label="Buscar familias"
                  placeholder="Buscar familia o teléfono"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-10 rounded-xl border-[#E9DED1] bg-[#FDFAF6] pl-9 text-xs placeholder:text-brown/40 focus-visible:border-gold focus-visible:ring-gold/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="guest-status-filter" className="sr-only">Filtrar por estado</Label>
                <Select value={statusFilter} onValueChange={(value) => value && setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger id="guest-status-filter" className="h-10 w-full min-w-[150px] rounded-xl border-[#E9DED1] bg-[#FDFAF6] px-3 text-xs text-brown sm:w-[160px]">
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Todas">Todos los estados</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                      <SelectItem value="Rechazado">Rechazado</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs text-brown/50 lg:justify-end">
              <span><strong className="font-semibold text-brown">{filteredFamilies.length}</strong> {filteredFamilies.length === 1 ? "familia" : "familias"}</span>
              {(query || statusFilter !== "Todas") && <button type="button" onClick={clearFilters} className="font-medium text-[#937352] underline decoration-[#D8C3A9] underline-offset-4 hover:text-brown">Limpiar filtros</button>}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-[#F0E8DF] bg-[#FCF9F5] hover:bg-[#FCF9F5]">
                  <TableHead className="min-w-[235px] pl-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-brown/45 sm:pl-6">Familia</TableHead>
                  <TableHead className="min-w-[145px] text-[10px] font-semibold uppercase tracking-[0.13em] text-brown/45">Cupos autorizados</TableHead>
                  <TableHead className="min-w-[150px] text-[10px] font-semibold uppercase tracking-[0.13em] text-brown/45">Asistentes confirmados</TableHead>
                  <TableHead className="min-w-[135px] text-[10px] font-semibold uppercase tracking-[0.13em] text-brown/45">Estado</TableHead>
                  <TableHead className="w-[56px] pr-5 sm:pr-6"><span className="sr-only">Acciones</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFamilies.length > 0 ? filteredFamilies.map((family) => (
                  <TableRow key={family.id} className="border-[#F4EEE7] transition-colors hover:bg-[#FEFCF9]">
                    <TableCell className="py-4 pl-5 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F6EAE8] font-display text-sm font-semibold text-[#896561]">{getInitials(family.name)}</span>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-brown">{family.name}</p>
                          <p className="mt-0.5 text-[10px] text-brown/45">{family.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-brown/70">{family.authorized} <span className="text-brown/40">personas</span></TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium tabular-nums text-brown">{family.confirmed}</span>
                        <span className="text-[10px] text-brown/40">de {family.authorized}</span>
                        <span className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-[#F0E8DF] sm:block">
                          <span className="block h-full rounded-full bg-[#B5C0A5]" style={{ width: `${family.authorized ? Math.min(100, family.confirmed / family.authorized * 100) : 0}%` }} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4"><StatusBadge status={family.status} /></TableCell>
                    <TableCell className="py-4 pr-5 text-right sm:pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Acciones para ${family.name}`} className="text-brown/55 hover:bg-[#F6EFE8] hover:text-brown" />}>
                          <Ellipsis aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[190px] rounded-xl border-[#EDE2D5] bg-white p-1.5">
                          <DropdownMenuItem onClick={() => onCopyLink(family)} className="gap-2 rounded-lg py-2 text-xs text-brown">
                            <Copy aria-hidden="true" /> Copiar enlace
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onShareWhatsApp(family)} className="gap-2 rounded-lg py-2 text-xs text-brown">
                            <MessageCircle aria-hidden="true" /> Compartir por WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#F0E8DF]" />
                          <DropdownMenuItem onClick={() => openEditDialog(family)} className="gap-2 rounded-lg py-2 text-xs text-brown">
                            <Pencil aria-hidden="true" /> Editar familia
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setFamilyToDelete(family)} variant="destructive" className="gap-2 rounded-lg py-2 text-xs">
                            <Trash2 aria-hidden="true" /> Eliminar familia
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-52 text-center">
                      <div className="mx-auto flex max-w-xs flex-col items-center">
                        <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-[#F6EFE8] text-[#9A7B5C]"><UsersRound aria-hidden="true" className="size-5" /></span>
                        <p className="font-display text-[22px] text-brown">No encontramos familias</p>
                        <p className="mt-1 text-xs leading-5 text-brown/50">Prueba con otro nombre o modifica los filtros.</p>
                        {(query || statusFilter !== "Todas") && <Button variant="link" onClick={clearFilters} className="mt-1 text-xs text-[#937352]">Limpiar búsqueda</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-1 border-t border-[#F0E8DF] bg-[#FCF9F5]/65 px-5 py-3 text-[10px] text-brown/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Los datos mostrados son de ejemplo y solo viven en esta sesión.</span>
            <span className="tabular-nums">Mostrando {filteredFamilies.length} de {families.length} familias</span>
          </div>
        </CardContent>
      </Card>

      <FamilyDialog
        key={dialogOpen ? `family-${editingFamily?.id ?? "new"}` : "closed"}
        open={dialogOpen}
        family={editingFamily}
        onOpenChange={setDialogOpen}
        onSave={saveFamily}
      />

      <AlertDialog open={Boolean(familyToDelete)} onOpenChange={(open) => { if (!open) setFamilyToDelete(null) }}>
        <AlertDialogContent className="rounded-2xl border-[#EDE2D5] bg-[#FFFEFC]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[27px] font-medium text-brown">¿Eliminar esta familia?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-brown/60">
              {familyToDelete?.name} se quitará de esta vista previa. Esta acción no se puede deshacer durante la sesión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-[#E9DED1] bg-white text-brown">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-xl bg-[#A3635C] text-white hover:bg-[#8E554F]">Eliminar familia</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

