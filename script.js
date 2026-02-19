const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

function init() {
    transactionList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    applyFilter();
}

function addTransactionDOM(transaction) {
    const sign = transaction.type === 'income' ? '+' : '-';
    const item = document.createElement('li');
    item.classList.add('transaction-item', transaction.type);
    item.dataset.type = transaction.type;
    
    item.innerHTML = `
        <div class="transaction-details">
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-amount ${transaction.type}">${sign}₹${Math.abs(transaction.amount).toFixed(2)}</div>
        </div>
        <button class="btn-delete" onclick="removeTransaction(${transaction.id})">Delete</button>
    `;
    
    transactionList.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0);
    const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0);
    const expense = amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0);

    balanceEl.textContent = `₹${total.toFixed(2)}`;
    incomeEl.textContent = `₹${income.toFixed(2)}`;
    expenseEl.textContent = `₹${Math.abs(expense).toFixed(2)}`;
    
    balanceEl.classList.add('update');
    setTimeout(() => balanceEl.classList.remove('update'), 500);
}

function addTransaction(e) {
    e.preventDefault();
    
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;
    
    if (!description || !amount) return;
    
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };
    
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    
    form.reset();
}

function removeTransaction(id) {
    const item = event.target.closest('.transaction-item');
    item.style.animation = 'slideOut 0.4s ease-out forwards';
    
    setTimeout(() => {
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    }, 400);
}

function filterTransactions(type) {
    currentFilter = type;
    applyFilter();
    
    document.querySelectorAll('.btn-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function applyFilter() {
    const items = transactionList.querySelectorAll('.transaction-item');
    items.forEach(item => {
        if (currentFilter === 'all' || item.dataset.type === currentFilter) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

form.addEventListener('submit', addTransaction);

init();
