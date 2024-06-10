import './style.css'
import accounts
 from './data';

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

  makeMovement(amount) {
    this.movements.push(amount);
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