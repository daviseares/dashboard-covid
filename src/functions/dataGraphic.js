/**
 * resposta da api de data - selecionada
 * @param {Object} resposta 
 */
export default function dataGraphic(resposta) {
    var json = resposta.properties.cases
    const labelResp = []
    const confirmed = []
    const estimateCases = []
    json.map(value => {
        labelResp.push(
            value.name
        )
        confirmed.push(
            value.confirmed
        )
        estimateCases.push(
            value.estimate_cases
        )
    })


    const dashboardNASDAQChart = {
        data: {
            labels: labelResp,
            datasets: [
                {
                    label:"Confirmados",
                    data: confirmed,
                    fill: false,
                    borderColor: "#fbc658",
                    backgroundColor: "transparent",
                    pointBorderColor: "#fbc658",
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    pointBorderWidth: 2
                },
                {
                    label: "Estimados",
                    data: estimateCases,
                    fill: false,
                    borderColor: "#51CACF",
                    backgroundColor: "transparent",
                    pointBorderColor: "#51CACF",
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            legend: {
                display: false,
                position: "top"
            }
        }
    };

    return dashboardNASDAQChart;
}