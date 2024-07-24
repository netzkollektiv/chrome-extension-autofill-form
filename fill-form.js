const getFormData = (data) => {
  for (const pattern in data) {
    const regex = new RegExp(pattern);
    if (regex.test(window.location.href)) {
      return data[pattern];
    }
  }
}

const processSelectors = (result) => {
    const formData = getFormData(JSON.parse(result.formSelectors.join('')));
    if (formData) {
      // Loop through each field and set the value
      for (const selector in formData) {
        let value = formData[selector];
        const element = document.querySelector(selector);
        if (!element) {
          continue;
        }
        if (element.tagName == 'BUTTON') {
          window.setTimeout(()=>{
            element.dispatchEvent(new Event('click'));
          },1000);
          return;
        }
        console.log(element);
        console.log(value); 
        setInputValue(element, value);
      }
    }
}

function setInputValue(inputElement, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(inputElement, value);

  inputElement.checked = true;
   
  ['keydown','keyup','keypress','input', 'change', 'blur'].map((eventName) => {
    let ev = new Event(eventName, { bubbles: true });
    inputElement.dispatchEvent(ev);
  });
}

// Retrieve saved form data
chrome.storage.sync.get(['formSelectors'], (result) => {
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      processSelectors(result);
    },1000);
  });

  window.navigation.addEventListener("navigate", (event) => {
    window.setTimeout(() => {
      processSelectors(result);
    },1000);
  });
});
