// Wrapper-Funktion zur Messung der Ausführungszeit einer Methode
function measureExecutionTime(instance, method, ...args) {
    const startTime = performance.now(); // Startzeitpunkt erfassen
    instance[method](...args); // Methode mit den übergebenen Parametern aufrufen
    const endTime = performance.now(); // Endzeitpunkt erfassen
    const executionTime = endTime - startTime; // Differenz berechnen
    return executionTime;
  }