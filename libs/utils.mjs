export { getUpcomingEvents };
const getUpcomingEvents = async (icsUrl) => {
    try {
        const response = await fetch(icsUrl);
        const text = await response.text();
        return parseICS(text);
    } catch (e) {
        console.error("Error during ICS polling :", e);
        return [];
    }
}

const parseICS = (data) => {
    const events = [];
    const lines = data.split(/\r?\n/);
    let event = null;

    lines.forEach(line => {
        if (line.startsWith("BEGIN:VEVENT")) {
            event = {};
        } else if (line.startsWith("END:VEVENT")) {
            events.push(event);
            event = null;
        } else if (event) {
            if (line.startsWith("SUMMARY:")) {
                event.summary = line.slice(8);
            } else if (line.startsWith("DTSTART")) {
                const match = line.match(/:(\d{8}T\d{6})/);
                if (match) event.start = parseICSTime(match[1]);
            }
        }
    });

    return events;
}

const parseICSTime = (str) => {
    const year = parseInt(str.substr(0, 4), 10);
    const month = parseInt(str.substr(4, 2), 10) - 1;
    const day = parseInt(str.substr(6, 2), 10);
    const hour = parseInt(str.substr(9, 2), 10);
    const min = parseInt(str.substr(11, 2), 10);
    return new Date(Date.UTC(year, month, day, hour, min));
}