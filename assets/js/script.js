// Global variables//

const getInput = document.querySelector("#input-id")
const getSelector = document.querySelector("#selector-id")
const getBtn = document.querySelector("#btn-id")
const getResults = document.querySelector("#results-id")
const getChart = document.querySelector("#chart-id")
const apiUrlToday = "https://mindicador.cl/api/";
const apiUrlDolar = "https://mindicador.cl/api/dolar"
const apiUrlEuro = "https://mindicador.cl/api/euro"
let myChart;

// Get API Data of Today Function//
async function getExchangeToday() {
    try {
        const res = await fetch(apiUrlToday);
        const dataExchangeToday = await res.json();
        return dataExchangeToday;
    } catch (e) {
        alert(e.message);
    }
}

// Get API Data of Monthly Function//
async function getMonthlyData(apiUrl) {
    try {
        const res = await fetch(apiUrl);
        const dataMonthly = await res.json();
        const last10DataPoints = dataMonthly.serie.slice(0, 10);
        return last10DataPoints;
    } catch (e) {
        alert(e.message);
    }
}

// Create chart and conversion function
async function renderExchange() {
    // Delete previous Chart
    if (myChart) {
        myChart.destroy();
    }

    const dataExchangeToday = await getExchangeToday();
    let template = "";
    const dolarValueToday = parseInt(dataExchangeToday.dolar.valor);
    const euroValueToday = parseInt(dataExchangeToday.euro.valor);

    const selectedData = await getMonthlyData(
        getSelector.value === "dolar" ? apiUrlDolar : apiUrlEuro // True or false, depending on selector
    );

    // Create array of dates and value
    const dates = selectedData.map(item => formatFecha(item.fecha));
    const values = selectedData.map(item => parseFloat(item.valor));

    // Limit dates to 10 characters
    function formatFecha(fecha) {
        return fecha.slice(0, 10); //(AAAA-MM-DD)
    }

    const canvas = document.getElementById("myChart2");
    canvas.style.backgroundColor = "white";

    const canvas2D = canvas.getContext("2d");

    // Create new chart
    myChart = new Chart(canvas2D, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                {
                    label: "Valores históricos de divisa seleccionada",
                    data: values,
                    borderColor: "red",
                    tension: 0
                }
            ]
        }
    });

    // Conversion function
    if (getSelector.value === "dolar") {
        inputClp = parseInt(getInput.value);
        result = inputClp / dolarValueToday;
        template += result.toFixed(2) + " US$";
    } else if (getSelector.value === "euro") {
        inputClp = parseInt(getInput.value);
        result = inputClp / euroValueToday;
        template += result.toFixed(2) + " €";
    }

    getResults.innerHTML = template;
}

// Call renderExchange with click in BTN
getBtn.addEventListener("click", renderExchange);

// Get API Fuctions Calling
async function fetchData() {
    await getExchangeToday();
    await getMonthlyData(apiUrlDolar);
    await getMonthlyData(apiUrlEuro);
}

fetchData();
