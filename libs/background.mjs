import { getUpcomingEvents } from "./utils.mjs";

const ICS_URL = "https://mon-espace.helmo.be/MonHoraire/ICalendarEtudiant/Fichier?token=F1527TRID3NrssW8luun1RHuP0jmv5vBeg35MZGSIsxh4eDydRestZgxtJm8uoWI";

chrome.runtime.onInstalled.addListener(() => {
    // Check for updates every 5 minutes
    chrome.alarms.create("checkSchedule", { periodInMinutes: 5 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === "checkSchedule") {
        const events = await getUpcomingEvents(ICS_URL);
        const now = new Date();
        const soon = new Date(now.getTime() + 20 * 60 * 1000);

        const nextEvent = events.find(ev => {
            const start = new Date(ev.start);
            return start > now && start <= soon;
        });

        if (nextEvent) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icons/icon128.png",
                title: "Cours à venir",
                message: `${nextEvent.summary} commence à ${new Date(nextEvent.start).toLocaleTimeString()}.`,
                priority: 2
            });
        }
    }
});
