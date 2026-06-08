chrome.action.onClicked.addListener(async (tab) => {
  // Inject CSS first
  await chrome.scripting.insertCSS({
    target: { tabId: tab.id },
    files: ["overlay.css"]
  });
  
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const existing = document.getElementById("virtual-cube-overlay");
      if (existing) {
        existing.remove();
      } else {
        const overlay = document.createElement("div");
        overlay.id = "virtual-cube-overlay";
        
        overlay.innerHTML = `
          <iframe src="https://virtual-cube.net/"></iframe>
          <button id="close-overlay">✕</button>
        `;
        document.body.appendChild(overlay);

        const closeBtn = document.getElementById("close-overlay");
        closeBtn.addEventListener("click", () => overlay.remove());

        // Make draggable
        let isDragging = false, offsetX, offsetY;
        const iframe = overlay.querySelector('iframe');
        
        overlay.addEventListener("mousedown", (e) => {
          if (e.target === closeBtn || e.target.tagName === 'IFRAME') return;
          isDragging = true;
          const rect = overlay.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          overlay.style.cursor = "grabbing";
          iframe.style.pointerEvents = "none";
          e.preventDefault();
        });
        
        document.addEventListener("mousemove", (e) => {
          if (isDragging) {
            overlay.style.right = "auto";
            overlay.style.left = e.clientX - offsetX + "px";
            overlay.style.top = e.clientY - offsetY + "px";
          }
        });
        
        document.addEventListener("mouseup", () => {
          if (isDragging) {
            isDragging = false;
            overlay.style.cursor = "move";
            iframe.style.pointerEvents = "auto";
          }
        });
      }
    }
  });
});
