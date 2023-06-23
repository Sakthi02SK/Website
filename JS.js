var registrations = [];
if (localStorage.getItem("details")) {
  registrations = JSON.parse(localStorage.getItem("details"));
}
function registerpage() {
  window.location.href = "register.html";
}
function register() { 
    var nm = document.getElementById("rgname").value;
    var name = document.getElementById("rgusername").value;
    var phone = document.getElementById("rgphno").value;
    var password = document.getElementById("rgpass").value;
    var confirmPass = document.getElementById("rgcnpass").value;
    if (name.trim() === "" || phone.trim() === "" || password.trim() === "" || confirmPass.trim() === "") {
        alert("Please fill all the fields.");
        return;
    }
    if (phone.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }
    if (password !== confirmPass){
        alert("Passwords do not match.");
        return;
    }
    for (var i = 0; i < registrations.length; i++) {
        if (name === registrations[i].name) {
          alert("User name already exists.");
          return;
        }
    }
    var registration = {
        nm: nm,
        name: name,
        phone: phone,
        password: password,
        expenses: []
    };
    registrations.push(registration);
    localStorage.setItem("details", JSON.stringify(registrations));
    alert("Registration successful");
    window.location.href = "index.html";
}
function login() {
    var name = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (name.trim() === "" || password.trim() === "") {
        alert("Please enter your user name and password.");
        return;
    }
    for (i=0 ; i < registrations.length; i++) {
        if (name === registrations[i].name && password === registrations[i].password) {
          alert("Login successful.");
          localStorage.setItem("num", JSON.stringify(i));
          window.location.href = "new.html";
          return;
        }
    }
    alert("Invalid user name or password.");
}
function resetPassword() {
    var name = document.getElementById("rtusername").value;
    var phone = document.getElementById("rtphno").value;
    var password = document.getElementById("rtpass").value;
    var confirmPass = document.getElementById("rtcnpass").value;
    if (name.trim() === "" || phone.trim() === "" || password.trim() === "" || confirmPass.trim() === "") {
        alert("Please fill all the fields");
        return;
    }
    for (var i = 0; i < registrations.length; i++) {
        if (name === registrations[i].name) {
            if(phone === registrations[i].phone.slice(-4) && password===confirmPass){
                registrations[i].password = password;
                localStorage.setItem("details", JSON.stringify(registrations));
                window.location.href = "index.html";             
                return;
            }
            alert("Invalid PhoneNumber");
            return;
        }
        alert("Invalid Username");
    }
}
function addExpense() {
    var j = JSON.parse(localStorage.getItem("num"));
    const expenseName = document.getElementById("expense").value;
    const expenseAmount = document.getElementById("amount").value;
    if (expenseName && expenseAmount) {
        registrations[j].expenses.push({ name: expenseName, amount: expenseAmount });
        console.log(registrations);
        updateExpensesTable();
        updatePieChart();
        document.getElementById("expense").value = "";
        document.getElementById("amount").value = "";
        localStorage.setItem("details", JSON.stringify(registrations));
    }
}
function deleteExpense(index) {
    var j = JSON.parse(localStorage.getItem("num"));
    registrations[j].expenses.splice(index, 1);
    updateExpensesTable();
    updatePieChart();
    localStorage.setItem("details", JSON.stringify(registrations));
}
function updateExpensesTable() {
    var j = JSON.parse(localStorage.getItem("num"));
    const tableBody = document.getElementById("expenses-table");
    tableBody.innerHTML = "";
    for (let i = 0; i < registrations[j].expenses.length; i++) {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.textContent = registrations[j].expenses[i].name;
      const amountCell = document.createElement("td");
      amountCell.textContent = registrations[j].expenses[i].amount;
      const deleteButtonCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click",() => {
        deleteExpense(i);
      });
      deleteButtonCell.appendChild(deleteButton);
      row.appendChild(nameCell);
      row.appendChild(amountCell);
      row.appendChild(deleteButtonCell);
      tableBody.appendChild(row);
    }
}
function updatePieChart() {
    var j = JSON.parse(localStorage.getItem("num"));
    const pieChart = document.getElementById("pie-chart");
    const data = registrations[j].expenses.map((expense) => expense.amount);
    const labels = registrations[j].expenses.map((expense) => expense.name);
    const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71","#6534AF","#1FCDB","#BB1FCD","#32DB07","#DB9407","#2C5F79"];
    const borderColor = "#fff"; 
    if (window.myPieChart) {
      window.myPieChart.destroy();
    }
    window.myPieChart = new Chart(pieChart, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
}