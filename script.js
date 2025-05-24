// Sample front-end investment simulation (in-memory/localStorage)
document.addEventListener("DOMContentLoaded", function () {
    const investForm = document.getElementById("investForm");
    const dashboard = document.getElementById("dashboard");
    const balanceDisplay = document.getElementById("balance");
    const activeList = document.getElementById("activeInvestments");

    function getInvestments() {
        return JSON.parse(localStorage.getItem("investments") || "[]");
    }

    function saveInvestments(data) {
        localStorage.setItem("investments", JSON.stringify(data));
    }

    function updateDashboard() {
        const now = Date.now();
        let total = 0;
        const investments = getInvestments();
        activeList.innerHTML = "";

        investments.forEach(inv => {
            const elapsed = (now - inv.timestamp) / (1000 * 60 * 60 * 24); // in days
            let profit = 0;
            if (inv.period === 7 && elapsed >= 7) {
                profit = inv.amount * (inv.crypto === "BTC" ? 0.9 : 0.6);
            } else if (inv.period === 30 && elapsed >= 30) {
                profit = inv.amount * (inv.crypto === "BTC" ? 1.8 : 1.6);
            }
            const totalInv = inv.amount + profit;
            total += elapsed >= inv.period ? totalInv : inv.amount;

            const item = document.createElement("li");
            item.textContent = `${inv.crypto} - $${inv.amount} | ${elapsed.toFixed(1)} days | Total: $${elapsed >= inv.period ? totalInv.toFixed(2) : inv.amount}`;
            activeList.appendChild(item);
        });

        balanceDisplay.textContent = "$" + total.toFixed(2);
    }

    if (dashboard) {
        updateDashboard();
        setInterval(updateDashboard, 10000); // update every 10s
    }

    if (investForm) {
        investForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const crypto = document.querySelector('input[name="crypto"]:checked').value;
            const amount = parseFloat(document.getElementById("amount").value);
            const period = parseInt(document.getElementById("period").value);

            const investments = getInvestments();
            investments.push({
                crypto, amount, period, timestamp: Date.now()
            });
            saveInvestments(investments);
            alert("Investment added!");
            investForm.reset();
        });
    }
});