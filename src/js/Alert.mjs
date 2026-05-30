export default class Alert {
  constructor() {
    this.alerts = [];
  }

  async init() {
    try {
      const response = await fetch("/json/alerts.json");
      if (!response.ok) throw new Error("No se pudo cargar alerts.json");
      this.alerts = await response.json();
      this.render();
    } catch (error) {
      console.warn("Alertas no disponibles:", error);
    }
  }

  render() {
    if (!this.alerts.length) return;

    const alertSection = document.createElement("section");
    alertSection.className = "alert-list";

    this.alerts.forEach((alert) => {
      const alertDiv = document.createElement("div");
      alertDiv.className = "alert";
      alertDiv.style.backgroundColor = alert.background;
      alertDiv.style.color = alert.color;
      alertDiv.style.display = "flex";
      alertDiv.style.justifyContent = "space-between";
      alertDiv.style.alignItems = "center";

      // Mensaje
      const messageSpan = document.createElement("span");
      messageSpan.textContent = alert.message;
      alertDiv.appendChild(messageSpan);

      // Botón cerrar (X)
      const closeBtn = document.createElement("span");
      closeBtn.textContent = "✕";
      closeBtn.className = "alert-close";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.fontWeight = "bold";
      closeBtn.style.marginLeft = "1rem";
      closeBtn.style.fontSize = "1.2rem";
      closeBtn.style.padding = "0 0.3rem";

      // Evento para eliminar esta alerta
      closeBtn.addEventListener("click", () => {
        alertDiv.remove();
        // Si no quedan alertas, eliminar la sección entera
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