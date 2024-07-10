document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('transactionBody');
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let saldo = parseFloat(localStorage.getItem('saldo')) || 30000;

    // Función para actualizar la tabla con todos los registros
    function updateTable() {
        tbody.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.fecha}</td>
                <td>${transaction.cantidad}</td>
                <td>${transaction.tipo}</td>
                <td>${transaction.verificado ? 'Verificado' : 'No verificado'}</td>
                <td>
                    <button class="ver-button">Ver</button>
                    <button class="verificar-button" data-index="${index}">Verificar</button>
                </td>
            `;
            tbody.appendChild(newRow);
        });
    }

    // Manejar clics en el botón Ver (delegación de eventos)
    tbody.addEventListener('click', function(event) {
        if (event.target.classList.contains('ver-button')) {
            const row = event.target.closest('tr');

            // Generar el contenido del archivo con la información de la fila
            const rowData = `
                Id: ${row.cells[0].textContent}\n
                Fecha: ${row.cells[1].textContent}\n
                Cantidad: ${row.cells[2].textContent}\n
                Tipo: ${row.cells[3].textContent}
            `;

            // Crear un blob con el contenido del archivo
            const blob = new Blob([rowData], { type: 'text/plain' });

            // Crear un enlace de descarga
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `transaccion_${row.cells[0].textContent}.txt`; // Nombre del archivo
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);

            // Simular clic en el enlace de descarga para iniciar la descarga
            downloadLink.click();

            // Limpiar después de la descarga
            document.body.removeChild(downloadLink);
        }

        if (event.target.classList.contains('verificar-button')) {
            const index = event.target.getAttribute('data-index');
            const transaction = transactions[index];

            if (!transaction.verificado) {
                transaction.verificado = true;
                saldo -= transaction.cantidad;
                localStorage.setItem('transactions', JSON.stringify(transactions));
                localStorage.setItem('saldo', saldo);
                updateTable();
            }
        }
    });

    // Inicializar la tabla
    updateTable();
});
