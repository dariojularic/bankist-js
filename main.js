import './style.css'
import accounts from './data';

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

  // provjerit
  makeMovement(amount, receiver) {
    this.movements.push(-amount);
    receiver.movements.push(amount)
  }

  requestLoan(amount) {
    setTimeout(3000, () => this.movements.push(amount))
    // this.movements.push(amount)
    // ubacit interestRate
  }

  // ovo vjv treba prepravit
  addUserName(array) {
    array.forEach(acc => {
      let initials = ""
      for (let i = 0; i < acc.fullName.split(" ").length; i++) {
        initials += acc.fullName.split(" ")[i][0]
      }
      acc.userName = initials.toLocaleLowerCase()
    })
  }



  // addTransaction() {

  // }
}

class AccountManager{
  // const accountsArray;
  constructor() {
    this.accountsArray = [];
  }

  addAccount(account) {
    this.accountsArray.push(account);
  }

  reciveDeposit(userId, amount) {
    const user = this.accountsArray.find(user => user.id === userId);
    user.movements.push(amount);
  }
}

const accountManager = new AccountManager();
accounts.forEach(acc => {
  // console.log(acc.owner)
  // ocu ovdje ubacit for loop i dodat username???
  const account = new Account(acc.owner, acc.movements, acc.interestRate, acc.pin)
  accountManager.addAccount(account)
  account.addUserName(accountManager.accountsArray)
})