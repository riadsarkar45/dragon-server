export const startOfDay = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export const diffFromToday = (expireDate: Date) => {
    const today = startOfDay()
    const expire = startOfDay(expireDate)

    return Math.floor(
        (expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )
}