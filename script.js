let totalAmount = document.getElementById("total-amount");
let userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
let tempAmount = 0;

// Set budget Part
totalAmountButton.addEventListener("click", () => {
  tempAmount = totalAmount.value;
  // empty or negative input
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    // Set Budget
    amount.innerHTML = tempAmount;
    // Set Balance
    balanceValue.innerText = tempAmount - expenditureValue.innerText;
    // Clear Input Box
    totalAmount.value = "";
    // Update pie chart
    updatePieChart();
  }
});

// Function to disable edit and delete button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

// Function to modify list elements
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;
  let currentBalance = balanceValue.innerText;
  let currentExpense = expenditureValue.innerText;
  let parentAmount = parentDiv.querySelector(".amount").innerText;
  if (edit) {
    let parentText = parentDiv.querySelector(".product").innerText;
    productTitle.value = parentText;
    userAmount.value = parentAmount;
    disableButtons(true);
  }
  balanceValue.innerText = parseInt(currentBalance) + parseInt(parentAmount);
  expenditureValue.innerText =
    parseInt(currentExpense) - parseInt(parentAmount);
  parentDiv.remove();
  updatePieChart();
};

// Function to create list
const listCreator = (expenseName, expenseValue) => {
  let subListContent = document.createElement("div");
  subListContent.classList.add("sublist-content", "flex-space");
  list.appendChild(subListContent);
  subListContent.innerHTML = `<p class="product">${expenseName}</p><p class="amount">${expenseValue}</p>`;
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.style.fontSize = "24px";
  editButton.addEventListener("click", () => {
    modifyElement(editButton, true);
  });
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.style.fontSize = "24px";
  deleteButton.addEventListener("click", () => {
    modifyElement(deleteButton);
  });
  subListContent.appendChild(editButton);
  subListContent.appendChild(deleteButton);
  document.getElementById("list").appendChild(subListContent);
  // Update pie chart
  updatePieChart();
};

//
// Function to add expenses
checkAmountButton.addEventListener("click", () => {
  // Empty checks
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return false;
  }

  // Enabled Buttons
  disableButtons(false);
  // Expense
  let expenditure = parseInt(userAmount.value);
  // Total expense (existing + new)
  let sum = parseInt(expenditureValue.innerText) + expenditure;
  expenditureValue.innerText = sum;
  // Total balance (budget - total expense)
  const totalBalance = tempAmount - sum;
  balanceValue.innerText = totalBalance;
  // Create list
  listCreator(productTitle.value, userAmount.value);
  // Empty inputs
  productTitle.value = "";
  userAmount.value = "";
  updatePieChart();
});

const updatePieChart = () => {
  const expenseItems = document.querySelectorAll(".sublist-content .product");
  const expenseAmounts = document.querySelectorAll(".sublist-content .amount");
  const remainingBalance = balanceValue.innerText;

  const labels = [];
  const data = [];

  // Extract expense items and amounts
  expenseItems.forEach((item) => {
    labels.push(item.textContent);
  });
  expenseAmounts.forEach((amount) => {
    data.push(amount.textContent);
  });

  // Add remaining balance as an additional label
  labels.push("Remaining Balance");
  data.push(remainingBalance);

  // Update the pie chart with new data
  const ctx = document.getElementById("pie-chart").getContext("2d");
  if (window.myPieChart) {
    window.myPieChart.destroy();
  }
  window.myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#FF9800",
            "#EF9595",
            "#FF6868",
            "#87A922",
            "#FCDC2A",
            "#FF0060",
            "#F7418F",
            "#A0153E",
            "#5F0F40", //Remaining balance color
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "var(--button-color)", // Set the color of the labels
          },
        },
      },
    },
  });
};
