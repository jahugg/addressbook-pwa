// Register service worker to control making site work offline
if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('/src/sw.js').then(
    (registration) => console.log('Service worker registration succeeded:', registration),
    (error) => console.error(`Service worker registration failed: ${error}`)
  );
else console.error('Service workers are not supported.');

// Code to handle install prompt on desktop
let deferredPrompt;

// fires when website is installable
window.addEventListener('beforeinstallprompt', (event) => {

  // Stash the event so it can be triggered later.
  deferredPrompt = event;

  // create dialog element
  const appEl = document.getElementById("app");
  const installDialogEl = document.createElement("dialog");
  installDialogEl.id = "install-dialog";
  installDialogEl.innerHTML = `<p>Make Addressbook available offline!</p>
    <form>
      <button value="install">Install</button>
      <button value="dismiss" formmethod="dialog">Dismiss</button>
    </form>`;
  appEl.appendChild(installDialogEl);

  // open the install dialog
  installDialogEl.showModal();

  // handle tigger install event
  const installButtonEl = installDialogEl.querySelector('button[value="install"]');
  installButtonEl.addEventListener('click', (event) => {
    event.preventDefault(); // We don't want to submit this fake form
    installDialogEl.close();

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') console.log('User accepted the A2HS prompt');
      else console.log('User dismissed the A2HS prompt');
      deferredPrompt = null;
    });
  });
});
