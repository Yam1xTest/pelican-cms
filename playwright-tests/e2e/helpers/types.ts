type HeroBlock = {
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

type SeoBlock = {
  metaTitle: string,
  metaDescription: string
}

type TextAndMediaBlock = {
  title: string,
  description: string,
  filePath: string,
}

type ServicesBlock = {
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