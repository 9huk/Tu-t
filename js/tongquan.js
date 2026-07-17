const ctx = document.getElementById("salesChart");

new Chart(ctx, {
    type: "line",
    data: {
        labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6"
        ],
        datasets: [{
            label: "Doanh thu (Triệu đồng)",
            data: [15, 18, 22, 20, 25, 28],

            borderColor: "#8B5E3C",
            backgroundColor: "rgba(139,94,60,0.15)",

            borderWidth: 3,

            fill: true,

            tension: 0.4,

            pointRadius: 5,

            pointHoverRadius: 8,

            pointBackgroundColor: "#8B5E3C"
        }]
    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: true
            }

        },

        scales: {

            y: {

                beginAtZero: true,

                ticks: {

                    callback: function(value){
                        return value + "tr";
                    }

                }

            }

        }

    }

});