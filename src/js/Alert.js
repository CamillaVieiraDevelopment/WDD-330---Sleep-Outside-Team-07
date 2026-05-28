export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async init() {
    try {
      const response = await fetch("/json/alerts.json");
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      this.alerts = Array.isArray(data) ? data : [];
    } catch (error) {

      return;
    }

    if (this.alerts.length > 0) {
      this.renderAlerts();
    }
  }

  renderAlerts() {
    const alertSection = document.createElement("section");
    alertSection.className = "alert-list";

    this.alerts.forEach((alert) => {
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert";
      alertDiv.textContent = alert.message;
      alertDiv.style.backgroundColor = alert.background;
      alertDiv.style.color = alert.color;
      alertDiv.style.position = "relative";
      alertDiv.style.padding = "0.75rem 2rem 0.75rem 1rem";
      alertDiv.style.textAlign = "center";
      alertDiv.style.fontWeight = "bold";
      alertDiv.style.borderRadius = "4px";
      alertDiv.style.marginBottom = "0.5rem";

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕";
      closeBtn.setAttribute("aria-label", "close alert");
      closeBtn.style.position = "absolute";
      closeBtn.style.right = "10px";
      closeBtn.style.top = "50%";
      closeBtn.style.transform = "translateY(-50%)";
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.fontSize = "1.2rem";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.color = "inherit";
      closeBtn.style.opacity = "0.7";
      closeBtn.style.padding = "0";
      closeBtn.style.margin = "0";
      closeBtn.style.width = "24px";
      closeBtn.style.height = "24px";
      closeBtn.style.display = "flex";
      closeBtn.style.alignItems = "center";
      closeBtn.style.justifyContent = "center";

      closeBtn.addEventListener("click", () => {
        alertDiv.remove();
        if (alertSection.children.length === 0) {
          alertSection.remove();
        }
      });

      alertDiv.appendChild(closeBtn);
      alertSection.appendChild(alertDiv);
    });

    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.prepend(alertSection);
    }
  }
}