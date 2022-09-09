
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function calculateTimeLeft(date) {
    const difference = date - new Date()

    let timeLeft = {}

    if (difference > 0) {
        timeLeft = { 
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            timeEnd: false 
        }
    } else { 
        timeLeft = { timeEnd: true } 
    }

    return timeLeft
}