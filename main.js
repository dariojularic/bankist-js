import './style.css'
import accounts from './data';
import Toastify from 'toastify-js'

const greeting = document.querySelector(".greeting");
const balanceDate = document.querySelector(".balance-date");
const balanceValue = document.querySelector(".balance-value");
const movementsList = document.querySelector(".movements-list");
const inValue = document.querySelector(".summary-in-value");
const outValue = document.querySelector(".summary-out-value");
const interestValue = document.querySelector(".interest-value");
const timer = document.querySelector(".logout-timer");
const signInForm = document.querySelector(".sign-in");
const userInput = document.querySelector(".user-input");
const pinInput = document.querySelector(".pin-input");
const transferForm = document.querySelector(".transfer-form");
const transferToInput = document.querySelector(".transfer-to-input");
const transferAmount = document.querySelector(".transfer-amount-input");
const closeAccountForm = document.querySelector(".close-account-form");
const closeUserInput = document.querySelector(".close-account-user");
const closePinInput = document.querySelector(".close-account-pin");
const loanForm = document.querySelector(".loan-form");
const loanAmountInput = document.querySelector(".loan-amount-input");
const container = document.querySelector(".container");
// tu idu varijable za input eventListener


class Account{
  constructor(fullName, movements, interestRate, pin) {
    this.id = self.crypto.randomUUID();
    this.fullName = fullName;
    this.movements = movements;
    this.interestRate = interestRate;
    this.pin = pin;
  }

  get allMovements() {
    return this.movements
  }

  get currentBalance() {
    let result = 0;
    this.movements.forEach(movement => {
      result += movement
    })
    return result;
  }

  getPositiveMovements() {
    let result = 0;
    this.movements.filter(movement => movement > 0).forEach(movement => result += movement)
    return result;
  }
  // get funkcia koja uzima sve pozitivne movementse i zbraja ih i vraca

  get interestAmount() {
    // let result = 0;
    // this.movements.filter(movement => movement > 0).forEach(movement => result += movement)
    // return result * this.interestRate
    return this.getPositiveMovements() * this.interestRate
  }
  
  addPositiveMovement(amount) {
    this.movements.push(amount)
  }

  addNegativeMovement(amount) {
    this.movements.push(-amount)
  }

  requestLoan(amount) {
    if (amount < this.getPositiveMovements()) {
      const interest = (amount * this.interestRate) - amount
      setTimeout(3000, () => {
        this.movements.push(amount)
        // ovdje treba ubacit interestValue ako cu ga koristit
      }) 
    } else {
      Toastify({
        text: "The bank doesn't allow that loan!",
        duration: 3000
      }).showToast();
    }

    // loan ne moze biti veci od in sekcije
    // setTimeout(3000, () => this.movements.push(amount))
    // ubacit interestRaten
  }

  renderMovements() {
    movementsList.innerHTML = ""
    this.movements.forEach(movement => {
      const html = `<li><span class="${movement > 0 ? "green-background" : "red-background"}"> ${this.movements.indexOf(movement) + 1} ${movement > 0 ? "DEPOSIT" : "WITHDRAWAL"}</span> ${movement.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</li>`
      movementsList.insertAdjacentHTML("afterbegin", html)
    })
  }
}

class AccountManager{
  accountsArray;
  constructor() {
    this.accountsArray = [];
    this.acctiveAccount = ""
  }

  // sta ako je ime get funkcije isto kao i ime statea?
  get accountsArr() {
    return this.accountsArray;
  }

  set currentAccount(account) {
    this.acctiveAccount = account;
  }

  get currentAccount() {
    return this.acctiveAccount;
  }

  createUserNames() {
    this.accountsArray.forEach(acc => {
      acc.userName = acc.fullName.toLocaleLowerCase().split(" ").map(name => name[0]).join("")
    })
  }

  addAccount(account) {
    this.accountsArray.push(account);
  }

  deleteAccount() {
    this.accountsArray = this.accountsArray.filter(account => account !== this.currentAccount)
  }

  // micem iz class i prebacujem u eventListener
  // reciveDeposit(userId, amount) {
  //   const user = this.accountsArray.find(user => user.id === userId);
  //   user.movements.push(amount);
  // }
}

function displayGreeting(account) {
  greeting.textContent = `Good morning, ${account.fullName.split(" ")[0]}`
}


// 
function displayCurrentBalance(account) {
  // console.log(account.getCurrentBalance())
  balanceValue.textContent = `${account.currentBalance.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} €`
}

function displaySummaryIn(movements) {
  let result = 0;
  movements.forEach(movement => {
    if (movement > 0) result += movement
  })
  inValue.textContent = `${result} €`
}

function displaySummaryOut(movements) {
  let result = 0;
  movements.forEach(movement => {
    if (movement < 0) result += movement
  })
  outValue.textContent = `${result} €`
}

function displayInterestAmount(amount) {
  interestValue.textContent = amount
}

const accountManager = new AccountManager();
accounts.forEach(acc => {
  const account = new Account(acc.owner, acc.movements, acc.interestRate, acc.pin)
  accountManager.addAccount(account)
})

accountManager.createUserNames()

signInForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // ocu dolje stavit find metodu?
  // console.log(userInput.value, pinInput.value)

  // const currentAccount = accoutsArray.find(acc => userName i PIN)
  // if (!currentAccount)
  //  return
  accountManager.accountsArr.forEach(acc => {
    // console.log(acc.userName, acc.pin)
    if (acc.userName === userInput.value && acc.pin === parseInt(pinInput.value)) {
      accountManager.currentAccount = acc

      accountManager.currentAccount.renderMovements()
      displayGreeting(accountManager.currentAccount)
      displayCurrentBalance(accountManager.currentAccount)
      displaySummaryIn(accountManager.currentAccount.allMovements)
      displaySummaryOut(accountManager.currentAccount.allMovements)
      displayInterestAmount(accountManager.currentAccount.interestAmount)
      container.style.transition = "1s"
      container.style.opacity = 1
      userInput.value = ""
      pinInput.value = ""
    }
  })
})

transferForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const reciever = accountManager.accountsArr.find(acc => acc.userName === transferToInput.value)
// posebna metoda isValidBalance
  // if (nesto)
    // return
  // fafmaoegfa
  if (accountManager.currentAccount.currentBalance < transferAmount.value || !reciever)  {
    Toastify({
      text: "The bank doesn't allow that loan!",
      duration: 3000
    }).showToast();
    return
  }
  accountManager.currentAccount.addNegativeMovement(transferAmount.value);
  reciever.addPositiveMovement(transferAmount.value);
  transferAmount.value = "";
  transferToInput.value = "";
  accountManager.currentAccount.renderMovements();
  displayCurrentBalance(accountManager.currentAccount)

  // if (accountManager.currentAccount.currentBalance > transferAmount.value && reciever) {
  //   accountManager.currentAccount.addNegativeMovement(transferAmount.value);
  //   reciever.addPositiveMovement(transferAmount.value);
  //   transferAmount.value = "";
  //   transferToInput.value = "";
  //   accountManager.currentAccount.renderMovements();
  //   displayCurrentBalance(accountManager.currentAccount)
  // }
})


// eventListener za svaki input
loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(accountManager.currentAccount.currentBalance)
  if (parseInt(loanAmountInput.value) > 0 && parseInt(loanAmountInput.value) <= accountManager.currentAccount.currentBalance) {
    setTimeout(() => {
      accountManager.currentAccount.addPositiveMovement(parseInt(loanAmountInput.value))  
      displayCurrentBalance(accountManager.currentAccount)
      accountManager.currentAccount.renderMovements()
      loanAmountInput.value = ""
      console.log(accountManager.currentAccount.allMovements)
    }, 3000)
  } else {
    Toastify({
      text: "The bank doesn't allow that loan!",
      duration: 3000
    }).showToast();
  }
})

closeAccountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // jel mi trebaju tu dole get metode za userName i Pin?
  if (closeUserInput.value === accountManager.currentAccount.userName && parseInt(closePinInput.value) === accountManager.currentAccount.pin) {
    accountManager.deleteAccount();
    accountManager.currentAccount = "";
    closePinInput.value = "";
    closeUserInput.value = "";
  }
})