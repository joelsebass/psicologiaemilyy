// Función para sumar y dividir los valores de cada grupo de 4 subceldas
function sumAndDivide(inputElement) {
    const cell = inputElement.closest('td'); // Encuentra la celda actual
    const div = cell.querySelector('.results'); // Div donde se mostrarán los resultados
  
    const inputs = cell.querySelectorAll('.input'); // Obtén todos los inputs dentro de esta celda
    let sum = 0;
    let validInputs = 0;
  
    // Sumar los valores de todos los inputs en este grupo de 4 subceldas
    inputs.forEach(input => {
      const value = parseFloat(input.value);
      if (!isNaN(value)) {
        sum += value;
        validInputs++;
      }
    });
  
    // Calcular la división (si hay al menos un valor válido)
    let division = validInputs > 0 ? sum / validInputs : 0;
  
    // Mostrar los resultados en el div de resultados de esta celda
    div.innerHTML = `Suma: ${sum} | División: ${division.toFixed(2)}`;
    
    // Clasificar y mostrar la clasificación de la división
    classifyDivisionAndDisplay(div, division);
}
  
// Función para clasificar la división (Bajo, Medio, Alto) y mostrarlo
function classifyDivisionAndDisplay(resultsDiv, divisionValue) {
    let classification = classifyDivision(divisionValue);
    let divisionText = resultsDiv.innerHTML.split('|')[0].trim(); // Obtiene la suma
    resultsDiv.innerHTML = `${divisionText} | División: ${divisionValue.toFixed(2)} (${classification})`;
}
  
// Función para clasificar los valores de la división
function classifyDivision(value) {
    if (value >= 0 && value <= 3) {
      return 'Bajo';
    } else if (value >= 3.1 && value <= 6.5) {
      return 'Medio';
    } else if (value >= 6.6) {
      return 'Alto';
    }
    return 'Desconocido'; // Por si no hay un valor válido
}
  
// Función para agregar una nueva fila
function addRow() {
    const table = document.getElementById('mainTable');
    const tbody = table.querySelector('tbody');
    const rowCount = tbody.rows.length;
    const newRow = document.createElement('tr');
    
    newRow.classList.add('dataRow');
    
    newRow.innerHTML = `
      <td class="rowNumber">${rowCount + 1}</td>
      <td><input type="text" placeholder="Nombre" class="nameInput"></td>
      <td>
        <div>
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
        </div>
        <div class="results">Suma: 0 | División: 0</div>
      </td>
      <td>
        <div>
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
        </div>
        <div class="results">Suma: 0 | División: 0</div>
      </td>
      <td>
        <div>
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
        </div>
        <div class="results">Suma: 0 | División: 0</div>
      </td>
      <td>
        <div>
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
          <input type="number" class="input" oninput="sumAndDivide(this)" placeholder="Num">
        </div>
        <div class="results">Suma: 0 | División: 0</div>
      </td>
    `;
    
    tbody.appendChild(newRow);
    updateRowNumbers(); // Actualiza la numeración de las filas
}
  
// Función para borrar la última fila
function deleteRow() {
    const table = document.getElementById('mainTable');
    const tbody = table.querySelector('tbody');
    
    // Asegurarse de que haya filas para eliminar
    if (tbody.rows.length > 1) {
      tbody.deleteRow(tbody.rows.length - 1);
      updateRowNumbers(); // Actualiza la numeración de las filas
    }
}
  
// Función para actualizar la numeración de las filas
function updateRowNumbers() {
    const rows = document.querySelectorAll('.dataRow');
    rows.forEach((row, index) => {
      row.querySelector('.rowNumber').innerText = index + 1;
    });
}
// Función para exportar la tabla a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Configurar el título con un tamaño adecuado
    doc.setFontSize(16);  // Cambiar el tamaño de la fuente para el título
    const margin = 10; // Espacio para los márgenes
    const titleLine1 = "RESULTADOS DEL PRE-TEST DE LA ESCALA DE VALORACION";
    const titleLine2 = "DEL ESTADO DE ANIMO (EVEA)";
  
    // Calcular el ancho de los títulos y centrar el texto
    const pageWidth = doc.internal.pageSize.width;
    const titleLine1Width = doc.getTextWidth(titleLine1);
    const titleLine2Width = doc.getTextWidth(titleLine2);
  
    const titleX1 = (pageWidth - titleLine1Width) / 2; // Posición X para la primera línea del título
    const titleX2 = (pageWidth - titleLine2Width) / 2; // Posición X para la segunda línea del título
  
    const titleHeight = 10; // Altura para la primera línea del título
    doc.text(titleLine1, titleX1, titleHeight + margin);  // Primera línea del título
    doc.text(titleLine2, titleX2, titleHeight + margin + 10);  // Segunda línea del título (con espacio adicional)

    doc.setFontSize(12);  // Cambiar el tamaño de la fuente para el contenido posterior

    const table = document.getElementById('mainTable');
    const rows = [];
    const headers = ['#', 'Nombre', 'Tristeza y Depresión', 'Ansiedad', 'Ira-Ostilidad', 'Alegría'];
  
    // Recorrer las filas de la tabla para recoger los datos
    for (let i = 1; i < table.rows.length; i++) { // Empezamos desde 1 para evitar la cabecera
      const row = table.rows[i];
      const rowData = [];
  
      // Obtener el número de fila
      rowData.push(row.cells[0].innerText);
  
      // Obtener el nombre
      const name = row.cells[1].querySelector('input')?.value || '';
      rowData.push(name);
  
      // Recorrer las 4 columnas de resultados
      for (let j = 2; j < row.cells.length; j++) {
        const resultDiv = row.cells[j].querySelector('.results');
        const resultText = resultDiv ? resultDiv.innerText : '';
        
        // Obtener la parte de la división
        const divisionValue = parseFloat(resultText.split(' | ')[1].split(': ')[1]) || 0;
        const classification = classifyDivision(divisionValue);  // Clasificar el resultado
  
        rowData.push(`${divisionValue.toFixed(2)} (${classification})`);
      }
  
      rows.push(rowData);
    }
  
    // Generar el PDF con los datos
    doc.autoTable({
      head: [headers],
      body: rows,
      columnStyles: {
        0: { cellWidth: 15 }, // Columna de número
        1: { cellWidth: 40 }, // Columna de nombre (más ancha)
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
      },
      theme: 'striped', // Estilo para las filas
      startY: titleHeight + margin + 20, // Comienza la tabla justo después del título
    });
  
    // Descargar el PDF
    doc.save('tabla.pdf');
}
