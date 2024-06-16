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



class Account{
  constructor(fullName, movements, interestRate, pin) {
    this.fullName = fullName;
    this.movements = movements;
    this.interestRate = interestRate;
    // ocu ovdje dodat interestAmount da bi ga mogao displayat
    this.id = self.crypto.randomUUID();
    this.pin = pin;
  }

  get allMovements() {
    return this.movements
  }

  getCurrentBalance() {
    let result = 0;
    // zasto ne radi ako napisem samo let result??
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
    if (amount < result) {
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
  greeting.textContent = `Good morning ${account.fullName.split(" ")[0]}`
}

function displayCurrentBalance(account) {
  // console.log(account.getCurrentBalance())
  balanceValue.textContent = `${account.getCurrentBalance()}`
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
  accountManager.accountsArr.forEach(acc => {
    // console.log(acc.userName, acc.pin)
    if (acc.userName === userInput.value && acc.pin === parseInt(pinInput.value)) {
      accountManager.currentAccount = acc
      console.log(accountManager.currentAccount)
      acc.renderMovements()
      displayGreeting(acc)
      displayCurrentBalance(acc)
      displaySummaryIn(acc.allMovements)
      displaySummaryOut(acc.allMovements)
      userInput.value = ""
      pinInput.value = ""
    }
  })
})

transferForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const reciever = accountManager.accountsArr.find(acc => acc.userName === transferToInput.value)

  if (accountManager.currentAccount.getCurrentBalance() > transferAmount.value && reciever) {
    accountManager.currentAccount.addNegativeMovement(transferAmount.value);
    reciever.addPositiveMovement(transferAmount.value);
    transferAmount.value = "";
    transferToInput.value = "";
    accountManager.currentAccount.renderMovements();
  }
})

loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (parseInt(loanAmountInput.value) > 0 && parseInt(loanAmountInput.value) <= accountManager.currentAccount.getCurrentBalance()) {
    setTimeout(3000, () => {
      accountManager.currentAccount.addPositiveMovement(loanAmountInput.value)  
    })
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