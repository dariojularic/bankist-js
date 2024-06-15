import './style.css'
import accounts from './data';

const greeting = document.querySelector(".greeting");
const balanceDate = document.querySelector(".balance-date");
const balanceValue = document.querySelector(".balance-value");
const movementsList = document.querySelector(".movements-list");
const inValue = document.querySelector(".summary-in-value");
const outValue = document.querySelector(".summary-out-value");
const interestValue = document.querySelector(".interest-value");
const timer = document.querySelector(".logout-timer");

class Account{
  constructor(fullName, movements, interestRate, pin) {
    this.fullName = fullName;
    this.movements = movements;
    this.interestRate = interestRate;
    this.id = self.crypto.randomUUID();
    this.pin = pin;
  }

  getCurrentBalance() {
    let result;
    this.movements.forEach(movement => {
      result += movement
    })
    return result;
  }
  
  addPositiveMovement(amount) {
    this.movements.push(amount)
  }

  addNegativeMovement(amount) {
    this.movements.push(-amount)
  }

  requestLoan(amount) {
    let result;
    const positiveMovements = this.movements.filter(movement => movement > 0)
    positiveMovements.forEach(movement => {
      result += movement
    })
    if (amount < result) setTimeout(3000, () => this.movements.push(amount))
    // else tostify

    // loan ne moze biti veci od in sekcije
    // setTimeout(3000, () => this.movements.push(amount))
    // ubacit interestRaten
  }

  renderMovements() {
    this.movements.forEach(movement => {
      const html = `<li>${this.movements.indexOf(movement) + 1} ${movement}</li>`
      movementsList.insertAdjacentHTML("afterbegin", html)
    })
  }
}

class AccountManager{
  // ocu ostavit ili izbrisat donju liniju?
  accountsArray;
  constructor() {
    this.accountsArray = [];
  }

  // sta ako je ime get funkcije isto kao i ime statea?
  get accountsArr() {
    return this.accountsArray;
  }

  createUserNames() {
    this.accountsArray.forEach(acc => {
      acc.userName = acc.fullName.toLocaleLowerCase().split(" ").map(name => name[0]).join("")
    })
  }

  addAccount(account) {
    this.accountsArray.push(account);
  }

  // micem iz class i prebacujem u eventListener
  // reciveDeposit(userId, amount) {
  //   const user = this.accountsArray.find(user => user.id === userId);
  //   user.movements.push(amount);
  // }
}

function displayGreeting(account) {
  greeting.textContent = `Good morning ${account.fullName.split(" ")[0]}`
}

function displayCurrentBalance(account) {
  balanceValue.textContent = `${account.getCurrentBalance()}`
}

function displaySummaryIn(movements) {
  let result;
  movements.forEach(movement => {
    if (movement > 0) result += movement
  })
  inValue.textContent = `${result} €`
}

function displaySummaryOut(movements) {
  let result;
  movements.forEach(movement => {
    if (movement < 0) result += movement
  })
  outValue.textContent = `${result} €`
}

const accountManager = new AccountManager();
accounts.forEach(acc => {
  const account = new Account(acc.owner, acc.movements, acc.interestRate, acc.pin)
  accountManager.addAccount(account)
  // console.log(account.renderMovements())
})

accountManager.createUserNames()