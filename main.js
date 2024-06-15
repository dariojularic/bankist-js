import './style.css'
import accounts from './data';

const greeting = document.querySelector(".greeting");
const balanceDate = document.querySelector(".balance-date");
const balanceValue = document.querySelector(".balance-value");
const movementsList = document.querySelector(".movements-list");


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
}

class AccountManager{
  // ocu ostavit ili izbrisat donju liniju?
  accountsArray;
  constructor() {
    this.accountsArray = [];
  }

  // sta ako je ime get funkcije isto kao i ime statea?
  get accountsArr() {
    // console.log("gaga")
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

const accountManager = new AccountManager();
accounts.forEach(acc => {
  const account = new Account(acc.owner, acc.movements, acc.interestRate, acc.pin)
  accountManager.addAccount(account)
})
accountManager.createUserNames()