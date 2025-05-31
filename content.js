chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "modifyLinkedInUrl") {
    let currentUrl = window.location.href;
    const targetParam = "f_TPR=r86400";
    const replacementParam = "f_TPR=r3600";

    if (currentUrl.includes("linkedin.com/jobs/search/")) {
      if (currentUrl.includes(targetParam)) {
        let newUrl = currentUrl.replace(targetParam, replacementParam);
        window.location.href = newUrl;
        // It's good practice to send a response, though the page will reload.
        sendResponse({status: "success", message: "URL modified and page reloading."});
      } else if (currentUrl.includes(replacementParam)) {
        sendResponse({status: "info", message: "Filter already set to 1 hour."});
      } 
      else {
        sendResponse({status: "info", message: "'Past 24 hours' filter (f_TPR=r86400) not found in URL. Please apply it first."});
      }
    } else {
      sendResponse({status: "error", message: "Not a LinkedIn job search page."});
    }
    // Return true to indicate you wish to send a response asynchronously
    // This is important if window.location.href is called, as the current page context
    // might be destroyed before the response is sent if not handled this way.
    // However, with immediate page reload, the response might not always be received by the popup.
    return true;
  }
});
