// Budget Tracker Class ====================================
class BudgetTracker {
  constructor() {
    this._budgetLimit = 2200
    this._totalSpent = 0
    this._purchases = []
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
    this._render()
  }

  addDeposit(deposit) {
    this._deposits.push(deposit)
    this._totalSpent -= deposit.amount
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

    const remaining = this._budgetLimit - this._totalSpent

    budgetRemainingEl.innerHTML = remaining
  }

  _displayBudgetProgress() {
    const progressEl = document.getElementById('progress')
    const percentage = (this._totalSpent / this._budgetLimit) * 100
    const width = Math.min(percentage, 100)
    progressEl.style.width = `${width}%`
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

const tracker = new BudgetTracker()

const coffee = new Purchase('coffee', 20)
const rent = new Purchase('rent', 1200)
const car = new Purchase('car', 800)
tracker.addPurchase(coffee)
tracker.addPurchase(rent)
tracker.addPurchase(car)

const paycheck = new Deposit('Paycheck', 1200)
tracker.addDeposit(paycheck)

console.log(tracker._purchases)
console.log(tracker._deposits)
console.log(tracker._totalSpent)
