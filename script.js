document.addEventListener('DOMContentLoaded', function() {
    const rechargeButton = document.getElementById('rechargeButton');
    const generateButton = document.getElementById('generateButton');
    const rechargeFormDiv = document.getElementById('rechargeForm');
    const generateFormDiv = document.getElementById('generateForm');
    const formRecarga = document.getElementById('formRecarga');
    const formGenerate = document.getElementById('formGenerate');
    const tbody = document.getElementById('transactionBody');
    const verMas = document.getElementById('verMas');
    const saldoDisplay = document.getElementById('saldo');

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let saldo = parseFloat(localStorage.getItem('saldo')) || 30000;

    rechargeButton.addEventListener('click', function() {
        generateFormDiv.style.display = 'none';
        rechargeFormDiv.style.display = 'block';
    });

    generateButton.addEventListener('click', function() {
        rechargeFormDiv.style.display = 'none';
        generateFormDiv.style.display = 'block';
    });

    formRecarga.addEventListener('submit', function(event) {
        event.preventDefault();

        const recargaId = document.getElementById('recargaId').value;
        const recargaFecha = document.getElementById('recargaFecha').value;
        const recargaCantidad = document.getElementById('recargaCantidad').value;
        const recargaTipo = document.getElementById('recargaTipo').value;

        const newTransaction = {
            id: recargaId,
            fecha: recargaFecha,
            cantidad: parseFloat(recargaCantidad),
            tipo: recargaTipo,
            verificado: false
        };
        transactions.unshift(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        formRecarga.reset();
        rechargeFormDiv.style.display = 'none';

        updateTable();
    });

    formGenerate.addEventListener('submit', function(event) {
        event.preventDefault();

        const generateAmount = document.getElementById('generateAmount').value;

        saldo += parseFloat(generateAmount);
        localStorage.setItem('saldo', saldo);
        updateSaldo();

        formGenerate.reset();
        generateFormDiv.style.display = 'none';
    });

    function updateSaldo() {
        saldoDisplay.textContent = `SALDO: L. ${saldo.toFixed(2)}`;
    }

    function updateTable() {
        tbody.innerHTML = '';
        const visibleTransactions = transactions.slice(0, 10);
        visibleTransactions.forEach((transaction, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.fecha}</td>
                <td>${transaction.cantidad}</td>
                <td>${transaction.tipo}</td>
                <td>${transaction.verificado ? 'Verificado' : 'No verificado'}</td>
                <td>
                    <button class="ver-button" data-index="${index}">Ver</button>
                    <button class="delete-button" data-index="${index}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(newRow);
        });
        verMas.style.display = transactions.length > 10 ? 'block' : 'none';
    }

    tbody.addEventListener('click', async function(event) {
        const index = event.target.getAttribute('data-index');
        
        if (event.target.classList.contains('ver-button')) {
            const row = event.target.closest('tr');

            const rowData = {
                Id: row.cells[0].textContent,
                Fecha: row.cells[1].textContent,
                Cantidad: row.cells[2].textContent,
                Tipo: row.cells[3].textContent
            };

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const logo = new Image();
            logo.src = 'images/logohcm.jpg';
            logo.onload = function() {
                doc.addImage(logo, 'JPEG', 10, 10, 50, 30);

                doc.setFontSize(16);
                doc.text(`Id: ${rowData.Id}`, 10, 50);
                doc.text(`Fecha: ${rowData.Fecha}`, 10, 60);
                doc.text(`Cantidad: ${rowData.Cantidad}`, 10, 70);
                doc.text(`Tipo: ${rowData.Tipo}`, 10, 80);

                doc.save(`transaccion_${rowData.Id}.pdf`);
            };
        }

        if (event.target.classList.contains('delete-button')) {
            transactions.splice(index, 1);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            updateTable();
        }
    });

    verMas.addEventListener('click', function(event) {
        event.preventDefault();
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
                    <button class="ver-button" data-index="${index}">Ver</button>
                    <button class="delete-button" data-index="${index}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(newRow);
        });
        verMas.style.display = 'none';
    });

    updateSaldo();
    updateTable();
});
