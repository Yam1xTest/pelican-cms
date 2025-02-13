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
  }
}