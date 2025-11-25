if (!document.getElementById("virtual-cube-overlay")) {
  const overlay = document.createElement("div");
  overlay.id = "virtual-cube-overlay";
  
  // Set initial position to top right
  overlay.style.top = "20px";
  overlay.style.right = "20px";
  overlay.style.left = "auto";
  
  overlay.innerHTML = `
    <iframe src="https://virtual-cube.net/"></iframe>
    <button id="close-overlay">✕</button>
  `;
  document.body.appendChild(overlay);

  const closeBtn = document.getElementById("close-overlay");
  closeBtn.addEventListener("click", () => overlay.remove());

  // Make draggable
  let isDragging = false;
  let offsetX, offsetY;
  const iframe = overlay.querySelector('iframe');

  overlay.addEventListener("mousedown", (e) => {
    if (e.target === closeBtn || e.target.tagName === 'IFRAME') return;
    isDragging = true;
    const rect = overlay.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    overlay.style.transition = "none";
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
