document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener ventas del día
    async function obtenerVentasDia() {
        try {
            const response = await fetch('http://localhost:3000/ventas/dia');
            const data = await response.json();
            document.getElementById('general-dia').textContent = `$${data.total_ventas || 0}`;
        } catch (error) {
            console.error('Error al obtener las ventas del día:', error);
        }
    }

    // Función para obtener ventas del mes actual
    async function obtenerVentasMesActual() {
        try {
            const response = await fetch('http://localhost:3000/ventas/mes-actual');
            const data = await response.json();
            document.getElementById('general-mes-actual').textContent = `$${data.total_ventas || 0}`;
        } catch (error) {
            console.error('Error al obtener las ventas del mes actual:', error);
        }
    }

    // Función para obtener ventas del mes anterior
    async function obtenerVentasMesAnterior() {
        try {
            const response = await fetch('http://localhost:3000/ventas/mes-anterior');
            const data = await response.json();
            document.getElementById('general-mes-anterior').textContent = `$${data.total_ventas || 0}`;
        } catch (error) {
            console.error('Error al obtener las ventas del mes anterior:', error);
        }
    }

    // Función para obtener ventas del año actual
    async function obtenerVentasAnual() {
        try {
            const response = await fetch('http://localhost:3000/ventas/anual');
            const data = await response.json();
            document.getElementById('general-anual').textContent = `$${data.total_ventas || 0}`;
        } catch (error) {
            console.error('Error al obtener las ventas del año actual:', error);
        }
    }

    async function obtenerVentasCasaMatriz() {
        try {
            const response = await fetch('http://localhost:3000/ventas/casa-matriz');
            const data = await response.json();

            const totalMesActual = parseFloat(data[data.length - 1]?.total_ventas) || 0;
            const totalMesAnterior = parseFloat(data[data.length - 2]?.total_ventas) || 0;
            const totalAnual = data.reduce((acc, curr) => acc + parseFloat(curr.total_ventas), 0);

            document.getElementById('matriz-dia').innerText = `$${totalMesActual}`;
            document.getElementById('matriz-mes-actual').innerText = `$${totalMesActual}`;
            document.getElementById('matriz-mes-anterior').innerText = `$${totalMesAnterior}`;
            document.getElementById('matriz-anual').innerText = `$${totalAnual}`;

            return { totalMesActual, totalMesAnterior, totalAnual };
        } catch (error) {
            console.error('Error al obtener las ventas de Casa Matriz:', error);
        }
    }

    // Función para obtener las ventas de Nuble
    async function obtenerVentasNuble() {
        try {
            const response = await fetch('http://localhost:3000/ventas/nuble');
            const data = await response.json();

            const totalMesActual = parseFloat(data[data.length - 1]?.total_ventas) || 0;
            const totalMesAnterior = parseFloat(data[data.length - 2]?.total_ventas) || 0;
            const totalAnual = data.reduce((acc, curr) => acc + parseFloat(curr.total_ventas), 0);

            document.getElementById('nuble-dia').innerText = `$${totalMesActual}`;
            document.getElementById('nuble-mes-actual').innerText = `$${totalMesActual}`;
            document.getElementById('nuble-mes-anterior').innerText = `$${totalMesAnterior}`;
            document.getElementById('nuble-anual').innerText = `$${totalAnual}`;

            return { totalMesActual, totalMesAnterior, totalAnual };
        } catch (error) {
            console.error('Error al obtener las ventas de Nuble:', error);
        }
    }

    // Función para obtener las ventas generales sumando Casa Matriz y Nuble
    async function obtenerVentasGenerales() {
        try {
            const ventasCasaMatriz = await obtenerVentasCasaMatriz();
            const ventasNuble = await obtenerVentasNuble();

            // Sumar los totales de ambas tiendas como números
            const totalMesActual = ventasCasaMatriz.totalMesActual + ventasNuble.totalMesActual;
            const totalMesAnterior = ventasCasaMatriz.totalMesAnterior + ventasNuble.totalMesAnterior;
            const totalAnual = ventasCasaMatriz.totalAnual + ventasNuble.totalAnual;

            // Mostrar en el dashboard
            document.getElementById('general-dia').innerText = `$${totalMesActual}`;
            document.getElementById('general-mes-actual').innerText = `$${totalMesActual}`;
            document.getElementById('general-mes-anterior').innerText = `$${totalMesAnterior}`;
            document.getElementById('general-anual').innerText = `$${totalAnual}`;
        } catch (error) {
            console.error('Error al obtener las ventas generales:', error);
        }
    }
   

    // Llamar a todas las funciones para obtener los datos y actualizar el HTML
    obtenerVentasDia();
    obtenerVentasMesActual();
    obtenerVentasMesAnterior();
    obtenerVentasAnual();
    obtenerVentasCasaMatriz();
    obtenerVentasNuble();
    obtenerVentasGenerales();

    // Función para obtener las ventas de los últimos 12 meses (ya la tienes)
    async function obtenerVentasUltimos12Meses() {
        try {
            const response = await fetch('http://localhost:3000/ventas/ultimos-12-meses');
            const data = await response.json();

            // Extraer los meses y los montos de las ventas del JSON recibido
            const meses = data.map(row => row.mes);
            const ventas = data.map(row => row.total_ventas);

            // Crear el gráfico de Chart.js con los datos obtenidos
            const ctx = document.getElementById('ventasChart').getContext('2d');
            const ventasChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: meses, // Etiquetas de los meses
                    datasets: [{
                        label: 'Ventas Totales',
                        data: ventas, // Datos de ventas
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error al obtener las ventas:', error);
        }
    }

    // Llamar a la función para obtener y mostrar las ventas en el gráfico
    obtenerVentasUltimos12Meses();
});
