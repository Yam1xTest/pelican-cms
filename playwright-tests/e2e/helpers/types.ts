export type HeroBlock = {
  title: string,
  infoCard: {
    title: string,
    description: string
  },
  scheduleCard: {
    title: string,
    timetable: {
      days: string,
      time: string,
      ticketsOfficeTime: string
    }[]
  },
  filePath: string
}

export type SeoBlock = {
  metaTitle: string,
  metaDescription: string
}

export type TextAndMediaBlock = {
  title: string,
  description: string,
  filePath: string,
}

export type ServicesBlock = {
  phone: string,
  email: string,
  cards: {
    title: string,
    cards: {
      title: string,
      description: string,
      link: string,
      labels: {
        text: string
      }[]
    }[]
  },
  filePath: string
}

export type ImageWithButtonGridBlock = {
  title: string,
  description: string,
  link: string,
  label: string,
  largeImagePath: string,
  smallImagePath: string,
}

export type Ticket = {
  category: string,
  description: string,
  price: string,
  frequency?: string,
};

export type HomeTicketsBlock = {
  generalTicketsTitle: string,
  generalTickets: Ticket[],
  generalTicketsLink: string,
  subsidizedTicketsTitle: string,
  subsidizedTicketsDescription: string,
  subsidizedTickets: Ticket[],
  subsidizedTicketsLink: string,
}

export type sharedTicketsBlock = {
  title: string,
  description: string,
  tickets: Ticket[],
  link: string,
  note: string,
}

export type MapCardBlock = {
  note: string,
  title: string,
  description: string,
  imagePath: string,
}