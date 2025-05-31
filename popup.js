document.addEventListener('DOMContentLoaded', () => {
  const modifyButton = document.getElementById('modifyUrlButton');
  const statusMessageDiv = document.getElementById('statusMessage');

  modifyButton.addEventListener('click', () => {
    // Clear previous status
    statusMessageDiv.textContent = '';
    statusMessageDiv.className = '';

    // Query for the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        statusMessageDiv.textContent = 'Error: No active tab found.';
        statusMessageDiv.className = 'error';
        return;
      }
      const activeTab = tabs[0];

      // Check if the tab has a URL, required for sending a message
      if (!activeTab.url) {
          statusMessageDiv.textContent = 'Cannot access tab URL (e.g. chrome:// pages).';
          statusMessageDiv.className = 'error';
          return;
      }

      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(activeTab.id, { action: "modifyLinkedInUrl" }, (response) => {
        if (chrome.runtime.lastError) {
          // Handle errors, e.g., if the content script isn't there
          statusMessageDiv.textContent = 'Error: Could not connect to content script. Refresh LinkedIn page?';
          statusMessageDiv.className = 'error';
          console.error(chrome.runtime.lastError.message);
        } else if (response) {
          statusMessageDiv.textContent = response.message || 'No message received.';
          if (response.status === "success") {
            statusMessageDiv.className = 'success';
            // Optionally close the popup on success
            // window.close();
          } else if (response.status === "info") {
            statusMessageDiv.className = 'info';
          } else if (response.status === "error") {
            statusMessageDiv.className = 'error';
          }
        } else {
          // This case might happen if the content script doesn't send a response
          // or if the page reloaded very quickly.
          statusMessageDiv.textContent = 'No response from content script. Page might be reloading.';
          statusMessageDiv.className = 'info';
        }
      });
    });
  });
});
