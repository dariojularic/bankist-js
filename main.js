import './style.css'

class Account{
  constructor(fullName, movements, interestRate, pin) {
    this.fullName = fullName;
    this.movements = movements;
    this.interestRate = interestRate;
    this.id = self.crypto.randomUUID();
    this.pin = pin;
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
    this.accountsArray.push(account)
  }


}