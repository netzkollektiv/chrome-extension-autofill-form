document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('selectors');
  const saveButton = document.getElementById('saveSelectors');
  const fillButton = document.getElementById('fillForm');

  // Load saved selectors
  chrome.storage.sync.get(['formSelectors'], (result) => {
    if (result.formSelectors) {
      textarea.value = result.formSelectors.join('\n');
    }
  });

  // Save selectors to storage
  saveButton.addEventListener('click', () => {
    const selectors = textarea.value.split('\n').filter(line => line.trim() !== '');
    chrome.storage.sync.set({ formSelectors: selectors }, () => {
      alert('Selectors saved!');
    });
  });

  // Inject content script to fill form
  fillButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['fill-form.js']
      });
    });
  });
});
