export type InvitationStatus = "Pendiente" | "Confirmado" | "Rechazado"

export type Family = {
  id: number
  name: string
  phone: string
  authorized: number
  confirmed: number
  status: InvitationStatus
  respondedAt?: string
}

export type EventDetails = {
  name: string
  date: string
  deadline: string
}

export const initialEvent: EventDetails = {
  name: "Bautizo de Mateo Azua",
  date: "2026-12-20",
  deadline: "2026-12-01",
}

export const initialFamilies: Family[] = [
  {
    id: 1,
    name: "Familia de la Cruz",
    phone: "+1 809 555 0182",
    authorized: 4,
    confirmed: 4,
    status: "Confirmado",
    respondedAt: "2026-11-15T10:42:00",
  },
  {
    id: 2,
    name: "Familia Valdez",
    phone: "+1 809 555 0136",
    authorized: 5,
    confirmed: 3,
    status: "Confirmado",
    respondedAt: "2026-11-15T09:18:00",
  },
  {
    id: 3,
    name: "Familia Guzmán",
    phone: "+1 809 555 0149",
    authorized: 3,
    confirmed: 0,
    status: "Pendiente",
  },
  {
    id: 4,
    name: "Familia Díaz",
    phone: "+1 809 555 0114",
    authorized: 2,
    confirmed: 2,
    status: "Confirmado",
    respondedAt: "2026-11-14T18:26:00",
  },
  {
    id: 5,
    name: "Familia Reyes",
    phone: "+1 809 555 0171",
    authorized: 4,
    confirmed: 0,
    status: "Pendiente",
  },
  {
    id: 6,
    name: "Familia Pichardo",
    phone: "+1 809 555 0168",
    authorized: 3,
    confirmed: 0,
    status: "Rechazado",
    respondedAt: "2026-11-13T14:05:00",
  },
  {
    id: 7,
    name: "Familia Sánchez",
    phone: "+1 809 555 0107",
    authorized: 6,
    confirmed: 4,
    status: "Confirmado",
    respondedAt: "2026-11-12T16:40:00",
  },
  {
    id: 8,
    name: "Familia Mateo",
    phone: "+1 809 555 0195",
    authorized: 2,
    confirmed: 1,
    status: "Confirmado",
    respondedAt: "2026-11-11T12:12:00",
  },
  {
    id: 9,
    name: "Familia Hernández",
    phone: "+1 809 555 0153",
    authorized: 4,
    confirmed: 2,
    status: "Confirmado",
    respondedAt: "2026-11-10T11:30:00",
  },
]
