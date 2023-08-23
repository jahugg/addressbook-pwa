// Register service worker to control making site work offline
if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('/src/sw.js').then(
    (registration) => console.log('Service worker registration succeeded:', registration),
    (error) => console.error(`Service worker registration failed: ${error}`)
  );
else console.error('Service workers are not supported.');

// Code to handle install prompt on desktop
let deferredInstallPrompt;

// fires when website is installable
window.addEventListener('beforeinstallprompt', (event) => {
  // Stash the event so it can be triggered later.
  deferredInstallPrompt = event;

  // create dialog element
  const appEl = document.getElementById('app');
  const installDialogEl = document.createElement('dialog');
  installDialogEl.id = 'install-dialog';
  installDialogEl.innerHTML = `<div>
      <img src="icons/icon.webp" alt="" />
      <p>Make available offline.</p>
    </div>
    <form>
      <button value="dismiss" formmethod="dialog">Dismiss</button>
      <button value="install">Install</button>
    </form>`;
  appEl.appendChild(installDialogEl);

  // open the install dialog
  installDialogEl.show();

  // handle tigger install event
  const installButtonEl = installDialogEl.querySelector('button[value="install"]');
  installButtonEl.addEventListener('click', (event) => {
    event.preventDefault(); // We don't want to submit this fake form
    installDialogEl.close();

    // Show the prompt
    deferredInstallPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') console.log('User accepted the A2HS prompt');
      else console.log('User dismissed the A2HS prompt');
      deferredInstallPrompt = null;
    });
  });
});
