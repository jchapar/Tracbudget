// Budget Tracker Class ====================================
class BudgetTracker {
  constructor() {
    this._budgetLimit = Storage.getBudgetLimit()
    this._totalSpent = Storage.getTotalSpent(0)
    this._purchases = Storage.getPurchases()
    this._deposits = []

    this._displayBudgetLimit()
    this._displayTotalSpent()
    this._displayPurchasesMade()
    this._displayDepositsMade()
    this._displayBudgetRemaining()
    this._displayBudgetProgress()
  }

  //Public Methods
  addPurchase(purchase) {
    this._purchases.push(purchase)
    this._totalSpent += purchase.amount
    Storage.updateTotalSpent(this._totalSpent)
    Storage.savePurchase(purchase)
    this._displayNewPurchase(purchase)
    this._render()
  }

  addDeposit(deposit) {
    this._deposits.push(deposit)
    this._totalSpent -= deposit.amount
    Storage.updateTotalSpent(this._totalSpent)
    this._displayNewDeposit(deposit)
    this._render()
  }

  removePurchase(id) {
    const index = this._purchases.findIndex((purchase) => purchase.id === id)

    if (index !== -1) {
      const purchase = this._purchases[index]
      this._totalSpent -= purchase.amount
      Storage.updateTotalSpent(this._totalSpent)
      this._purchases.splice(index, 1)
      this._render()
    }
  }

  removeDeposit(id) {
    const index = this._deposits.findIndex((deposit) => deposit.id === id)

    if (index !== -1) {
      const deposit = this._deposits[index]
      this._totalSpent += deposit.amount
      Storage.updateTotalSpent(this._totalSpent)
      this._deposits.splice(index, 1)
      this._render()
    }
  }

  reset() {
    this._totalSpent = 0
    this._purchases = []
    this._deposits = []
    this._render()
  }

  setLimit(budgetLimit) {
    this._budgetLimit = budgetLimit
    Storage.setBudgetLimit(budgetLimit)
    this._displayBudgetLimit()
    this._render()
  }

  //Private Methods
  _displayTotalSpent() {
    const totalSpentEl = document.querySelector('#total-spent')
    totalSpentEl.innerHTML = this._totalSpent
  }

  _displayBudgetLimit() {
    const budgetLimitEl = document.querySelector('#budget-limit')
    budgetLimitEl.innerHTML = this._budgetLimit
  }

  _displayPurchasesMade() {
    const purchasesMadeEl = document.getElementById('purchases')

    const madePurchases = this._purchases.reduce((total, purchase) => total + purchase.amount, 0)

    purchasesMadeEl.innerHTML = madePurchases
  }

  _displayDepositsMade() {
    const depositsMadeEl = document.getElementById('deposits')

    const madeDeposits = this._deposits.reduce((total, deposit) => total + deposit.amount, 0)

    depositsMadeEl.innerHTML = madeDeposits
  }

  _displayBudgetRemaining() {
    const budgetRemainingEl = document.getElementById('remaining')
    const progressEl = document.getElementById('progress')

    const remaining = this._budgetLimit - this._totalSpent

    budgetRemainingEl.innerHTML = remaining

    if (remaining <= 0) {
      budgetRemainingEl.parentElement.parentElement.classList.remove('bg-slate-300')
      budgetRemainingEl.parentElement.parentElement.classList.add('bg-red-600')
      progressEl.classList.remove('bg-blue-700')
      progressEl.classList.add('bg-red-600')
    } else {
      budgetRemainingEl.parentElement.parentElement.classList.remove('bg-red-600')
      budgetRemainingEl.parentElement.parentElement.classList.add('bg-slate-300')
      progressEl.classList.remove('bg-red-600')
      progressEl.classList.add('bg-blue-700')
    }
  }

  _displayBudgetProgress() {
    const progressEl = document.getElementById('progress')
    const percentage = (this._totalSpent / this._budgetLimit) * 100
    const width = Math.min(percentage, 100)
    progressEl.style.width = `${width}%`
  }

  _displayNewPurchase(purchase) {
    const purchasesEl = document.getElementById('purchase-items')
    const purchaseEl = document.createElement('div')
    purchaseEl.classList.add('list-item')
    purchaseEl.setAttribute('data-id', purchase.id)

    purchaseEl.innerHTML = `
    <h3 class="text-2xl">${purchase.name}</h3>
    <div
      class="flex items-center justify-center bg-blue-700 p-3 text-2xl rounded-lg text-white"
    >
      $
      <p class="price">${purchase.amount}</p>
    </div>
    <div class="bg-red-600 px-3 py-2 rounded-lg flex items-center just">
      <i class="fa-solid fa-x text-white"></i>
    </div>
    `

    purchasesEl.appendChild(purchaseEl)
  }

  _displayNewDeposit(deposit) {
    const depositsEl = document.getElementById('deposit-items')
    const depositEl = document.createElement('div')
    depositEl.classList.add('list-item')
    depositEl.setAttribute('data-id', deposit.id)

    depositEl.innerHTML = `
    <h3 class="text-2xl">${deposit.name}</h3>
    <div
      class="flex items-center justify-center bg-orange-500 p-3 text-2xl rounded-lg text-white"
    >
      $
      <p class="price">${deposit.amount}</p>
    </div>
    <div class="bg-red-600 px-3 py-2 rounded-lg flex items-center delete">
      <i class="fa-solid fa-x text-white"></i>
    </div>
    `

    depositsEl.appendChild(depositEl)
  }

  _render() {
    this._displayTotalSpent()
    this._displayPurchasesMade()
    this._displayDepositsMade()
    this._displayBudgetRemaining()
    this._displayBudgetProgress()
  }
}

// Purchases Class ====================================
class Purchase {
  constructor(name, amount) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.amount = amount
  }
}

// Deposits Class ====================================

class Deposit {
  constructor(name, amount) {
    this.id = Math.random().toString(16).slice(2)
    this.name = name
    this.amount = amount
  }
}

// Storage Class ====================================
class Storage {
  static getBudgetLimit(defaultLimit = 2000) {
    let budgetLimit
    if (localStorage.getItem('budgetLimit') === null) {
      budgetLimit = defaultLimit
    } else {
      budgetLimit = +localStorage.getItem('budgetLimit')
    }
    return budgetLimit
  }

  static setBudgetLimit(budgetLimit) {
    localStorage.setItem('budgetLimit', budgetLimit)
  }

  static getTotalSpent(defaultSpent = 0) {
    let totalSpent
    if (localStorage.getItem('totalSpent') === null) {
      totalSpent = defaultSpent
    } else {
      totalSpent = +localStorage.getItem('totalSpent')
    }
    return totalSpent
  }

  static updateTotalSpent(spent) {
    localStorage.setItem('totalSpent', spent)
  }

  static getPurchases() {
    let purchases
    if (localStorage.getItem('purchases') === null) {
      purchases = []
    } else {
      purchases = JSON.parse(localStorage.getItem('purchases'))
    }
    return purchases
  }

  static savePurchase(purchase) {
    let purchases = Storage.getPurchases()

    purchases.push(purchase)

    localStorage.setItem('purchases', JSON.stringify(purchases))
  }
}

// App Class ====================================
class App {
  constructor() {
    this._tracker = new BudgetTracker()

    // Submit Purchase
    document
      .getElementById('purchases-form')
      .addEventListener('submit', this._newItem.bind(this, 'purchase'))

    // Submit Deposit
    document
      .getElementById('deposits-form')
      .addEventListener('submit', this._newItem.bind(this, 'deposit'))

    // Delete Item
    document
      .getElementById('purchase-items')
      .addEventListener('click', this._removeItem.bind(this, 'purchase'))

    // Delete Item
    document
      .getElementById('deposit-items')
      .addEventListener('click', this._removeItem.bind(this, 'deposit'))

    // Filter Purchases
    document
      .getElementById('filter-purchases')
      .addEventListener('keyup', this._filterItems.bind(this, 'purchase'))

    // Filter Deposits
    document
      .getElementById('filter-deposits')
      .addEventListener('keyup', this._filterItems.bind(this, 'deposit'))

    // Open/Close Budget limit
    document.getElementById('set-budget').addEventListener('click', this._budgetModal.bind(this))

    // Update limit
    document
      .getElementById('budget-limit-form')
      .addEventListener('submit', this._setLimit.bind(this))

    // Reset
    document.getElementById('reset').addEventListener('click', this._reset.bind(this))
  }

  // New Purchase
  _newItem(type, e) {
    e.preventDefault()

    const name = document.getElementById(`${type}-name`)
    const amount = document.getElementById(`${type}-amount`)

    // Validate Input
    if (name.value === '' || amount.value === '') {
      alert('Please fill in all fields')
      return
    }

    if (type === 'purchase') {
      const purchase = new Purchase(name.value, +amount.value)
      this._tracker.addPurchase(purchase)
    } else {
      const deposit = new Deposit(name.value, +amount.value)
      this._tracker.addDeposit(deposit)
    }

    name.value = ''
    amount.value = ''
  }

  _removeItem(type, e) {
    if (e.target.classList.contains('delete') || e.target.classList.contains('fa-x')) {
      if (confirm('Are you sure?')) {
        const id = e.target.closest('.list-item').getAttribute('data-id')

        type === 'purchase' ? this._tracker.removePurchase(id) : this._tracker.removeDeposit(id)

        e.target.closest('.list-item').remove()
      }
    }
  }

  _filterItems(type, e) {
    const text = e.target.value.toLowerCase()
    document.querySelectorAll(`#${type}-items .list-item`).forEach((item) => {
      const name = item.firstElementChild.textContent

      if (name.toLocaleLowerCase().indexOf(text) !== -1) {
        item.style.display = 'flex'
      } else {
        item.style.display = 'none'
      }
    })
  }

  _budgetModal() {
    const modal = document.getElementById('budget-limit-modal')

    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden')
      modal.classList.add('fixed')
    } else if (modal.classList.contains('fixed')) {
      modal.classList.remove('fixed')
      modal.classList.add('hidden')
    }
  }

  _setLimit(e) {
    e.preventDefault()

    const limit = document.getElementById('limit')

    if (limit.value === '') {
      alert('Please add a limit')
      return
    }

    this._tracker.setLimit(+limit.value)

    limit.value = ''

    document.getElementById('budget-limit-modal').classList.remove('fixed')
    document.getElementById('budget-limit-modal').classList.add('hidden')
  }

  _reset() {
    this._tracker.reset()

    document.getElementById('purchase-items').innerHTML = ''
    document.getElementById('deposit-items').innerHTML = ''

    document.getElementById('filter-purchases').value = ''
    document.getElementById('filter-deposits').value = ''
  }
}

const app = new App()
