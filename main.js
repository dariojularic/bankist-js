import './style.css'
import accounts from './data';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import numeral from 'numeral';

const greeting = document.querySelector(".greeting");
const balanceValue = document.querySelector(".balance-value");
const movementsList = document.querySelector(".movements-list");
const inValue = document.querySelector(".summary-in-value");
const outValue = document.querySelector(".summary-out-value");
const interestValue = document.querySelector(".interest-value");
const signInForm = document.querySelector(".sign-in");
const signUsernameInput = document.querySelector(".user-input");
const signPinInput = document.querySelector(".pin-input");
const transferForm = document.querySelector(".transfer-form");
const transferToInput = document.querySelector(".transfer-to-input");
const transferAmountInput = document.querySelector(".transfer-amount-input");
const closeAccountForm = document.querySelector(".close-account-form");
const closeUserInput = document.querySelector(".close-account-user");
const closePinInput = document.querySelector(".close-account-pin");
const loanForm = document.querySelector(".loan-form");
const loanAmountInput = document.querySelector(".loan-amount-input");
const container = document.querySelector(".container");
const sortBtn = document.querySelector(".sort-btn");

let transferTo = "";
let transferAmount = "";
let loanAmount = "";
let closeUser = "";
let closePin = "";
let signUsername = "";
let signPin = "";
let errorMessage = "";

transferToInput.addEventListener("input", () => transferTo = transferToInput.value)
transferAmountInput.addEventListener("input", () => transferAmount = parseInt(transferAmountInput.value))
loanAmountInput.addEventListener("input", () => loanAmount = parseInt(loanAmountInput.value))
closeUserInput.addEventListener("input", () => closeUser = closeUserInput.value)
closePinInput.addEventListener("input", () => closePin = parseInt(closePinInput.value))
signUsernameInput.addEventListener("input", () => signUsername = signUsernameInput.value)
signPinInput.addEventListener("input", () => signPin = parseInt(signPinInput.value))

class Account{
  constructor(fullName, movements, interestRate, pin) {
    this.id = self.crypto.randomUUID();
    this.fullName = fullName;
    this.movements = movements;
    this.interestRate = interestRate;
    this.pin = pin;
    this.isSorted = false;
  }

  get allMovements() {
    return this.movements;
  }

  set allMovements(newMovements) {
    return this.movements = newMovements;
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

  getNegativeMovements() {
    let result = 0;
    this.movements.filter(movement => movement < 0).forEach(movement => result += movement)
    return result;
  }  

  get interestAmount() {
    return this.getPositiveMovements() * this.interestRate - this.getPositiveMovements()
  }
  
  addPositiveMovement(amount) {
    this.movements.push(amount)
  }

  addNegativeMovement(amount) {
    this.movements.push(-amount)
  }

  renderMovements() {
    const copyMovements = [...this.movements]
    const sortedMovements = copyMovements.sort((a, b) => a - b);
    const currentMovements = this.isSorted ? sortedMovements : this.movements;
    movementsList.innerHTML = ""
    currentMovements.forEach(movement => {
      const html = `<li><span class="${movement > 0 ? "green-background" : "red-background"}"> ${this.movements.indexOf(movement) + 1} ${movement > 0 ? "DEPOSIT" : "WITHDRAWAL"}</span> ${numeral(movement).format("0,0")} €</li>`
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

  get accountsArr() {
    return this.accountsArray;
  }

  set currentAccount(account) {
    this.acctiveAccount = account;
  }

  get currentAccount() {
    return this.acctiveAccount;
  }

  sortArray() {

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
}

function displayGreeting(account) {
  greeting.textContent = `Good morning, ${account.fullName.split(" ")[0]}`
}
 
function displayCurrentBalance(account) {
  balanceValue.textContent = `${numeral(account.currentBalance).format("0,0.00")} €`
}

function displaySummaryIn(positiveMovements) {
  inValue.textContent = `${numeral(positiveMovements).format("0,0")} €`
}

function displaySummaryOut(negativeMovements) {
  outValue.textContent = `${numeral(Math.abs(negativeMovements)).format("0,0")} €`
}

function displayInterestAmount(amount) {
  interestValue.textContent = `${numeral(amount).format("0,0")} €`
}

function toastify() {
  Toastify({
    text: errorMessage,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      fontSize: "24px"
    }
  }).showToast();
}

const accountManager = new AccountManager();
accounts.forEach(acc => {
  const account = new Account(acc.owner, acc.movements, acc.interestRate, acc.pin)
  accountManager.addAccount(account)
})

accountManager.createUserNames()

signInForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const currentAccount = accountManager.accountsArr.find(acc => (acc.userName === signUsername) && (acc.pin === signPin))
  if (!currentAccount) {
    errorMessage = "Username or PIN was incorrect"
    toastify()
    return
  }
  accountManager.currentAccount = currentAccount;
  accountManager.currentAccount.renderMovements();
  displayGreeting(accountManager.currentAccount);
  displayCurrentBalance(accountManager.currentAccount);
  displaySummaryIn(accountManager.currentAccount.getPositiveMovements());
  displaySummaryOut(accountManager.currentAccount.getNegativeMovements());
  displayInterestAmount(accountManager.currentAccount.interestAmount);
  container.style.transition = "1s";
  container.style.opacity = 1;
  signUsernameInput.value = "";
  signPinInput.value = "";
})

transferForm.addEventListener("submit", (event) => {
  event.preventDefault()
  const reciever = accountManager.accountsArr.find(acc => (acc.userName === transferTo) && (acc.userName !== accountManager.currentAccount.userName))
  if (accountManager.currentAccount.currentBalance < transferAmount || !reciever || transferAmount < 0)  {
    errorMessage = "You can't do that!";
    toastify()
    return
  }
  accountManager.currentAccount.addNegativeMovement(transferAmount);
  reciever.addPositiveMovement(transferAmount);
  transferAmountInput.value = "";
  transferToInput.value = "";
  accountManager.currentAccount.renderMovements();
  displayCurrentBalance(accountManager.currentAccount);
  displaySummaryOut(accountManager.currentAccount.getNegativeMovements());
})

loanForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loanAmountInput.value = ""
  if (loanAmount < 0 || loanAmount > accountManager.currentAccount.currentBalance) {
    errorMessage = "The bank doesn't allow that loan!"
    toastify()
    return
  }
  setTimeout(() => {
    accountManager.currentAccount.addPositiveMovement(loanAmount);  
    accountManager.currentAccount.renderMovements();
    displayCurrentBalance(accountManager.currentAccount);
    displayInterestAmount(accountManager.currentAccount.interestAmount);
    displaySummaryIn(accountManager.currentAccount.getPositiveMovements());
  }, 2000)
})

closeAccountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (closeUser !== accountManager.currentAccount.userName || closePin !== accountManager.currentAccount.pin) {
    errorMessage  = "Username or PIN was incorrect!";
    toastify()
    return
  } 
  accountManager.deleteAccount();
  accountManager.currentAccount = "";
  closePinInput.value = "";
  closeUserInput.value = "";
  container.style.opacity = 0;
})

sortBtn.addEventListener("click", () => {
  accountManager.currentAccount.isSorted = !accountManager.currentAccount.isSorted
  accountManager.currentAccount.renderMovements()
})