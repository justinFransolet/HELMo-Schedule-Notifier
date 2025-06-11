/**
 * Get the ICS URL from Chrome storage
 *
 * @returns {Promise<string>} A promise that resolves to the ICS URL
 */
const getICSUrl = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['icsUrl'], (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.icsUrl || '');
            }
        });
    });
}

/**
 * Save the ICS URL to Chrome storage
 */
const saveICSUrl = (url) => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ icsUrl: url }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

// Display the ICS URL in the popup and allow the user to save it
document.addEventListener('DOMContentLoaded', () => {
    getICSUrl()
        .then(r => {
            document.getElementById('icsUrlInput').value = r;
        })
        .catch(e => {
            document.getElementById('icsUrlInput').value = '';
            console.error('Erreur lors de la récupération de l\'URL ICS :', e);
        });
});

// Sauvegarder l'URL ICS quand l'utilisateur clique sur le bouton
document.getElementById('saveIcsUrl').addEventListener('click', () => {
    const url = document.getElementById('icsUrlInput').value;
    const result = document.getElementById('resultStatus');
    saveICSUrl(url)
        .then(r => {
            result.textContent = 'Sauvegardé !';
            result.style.color = 'green';
        })
        .catch(e => {
            result.textContent = `Erreur : ${e.message}`;
            result.style.color = 'red';
        });
});