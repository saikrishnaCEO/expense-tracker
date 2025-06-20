const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
let editingId = null;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const expense = {
    title: document.getElementById("title").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    date: document.getElementById("date").value,
  };

  if (editingId === null) {
    // Create new expense
    fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expense)
    })
    .then(res => res.json())
    .then(() => {
      alert("Expense Added!");
      form.reset();
      loadExpenses();
    });
  } else {
    // Update existing expense
    fetch(`http://localhost:8080/api/expenses/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expense)
    })
    .then(() => {
      alert("Expense Updated!");
      editingId = null;
      form.reset();
      form.querySelector("button").innerText = "Add Expense";
      loadExpenses();
    });
  }
});

function loadExpenses() {
  fetch("http://localhost:8080/api/expenses")
    .then(res => res.json())
    .then(data => {
      list.innerHTML = "<h2>All Expenses:</h2>";
      data.forEach(exp => {
        list.innerHTML += `
          <div>
            <strong>${exp.title}</strong> — ₹${exp.amount} (${exp.category}) on ${exp.date}
            <button onclick="editExpense(${exp.id}, '${exp.title}', ${exp.amount}, '${exp.category}', '${exp.date}')">Edit</button>
            <button onclick="deleteExpense(${exp.id})">Delete</button>
          </div>
        `;
      });
    });
}

function deleteExpense(id) {
  fetch(`http://localhost:8080/api/expenses/${id}`, {
    method: "DELETE"
  })
  .then(() => {
    alert("Expense Deleted!");
    loadExpenses();
  });
}

function editExpense(id, title, amount, category, date) {
  editingId = id;
  document.getElementById("title").value = title;
  document.getElementById("amount").value = amount;
  document.getElementById("category").value = category;
  document.getElementById("date").value = date;
  form.querySelector("button").innerText = "Update Expense";
}

loadExpenses();
