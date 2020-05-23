class UI{
  constructor(){
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount= document.getElementById("budget-amount");
    this.expenseAmount=document.getElementById("expense-amount");
    this.balance=document.getElementById("balance");
    this.balanceAmount=document.getElementById("balance-amount");
    this.expenseForm=document.getElementById("expense-form");
    this.expenseInput=document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList=document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  //submit budget method
  submitBudgetForm(){
    const value=this.budgetInput.value;
    if(value==='' || value<0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p>value cannot be empty or negative</p>`;
      const self =this;
      //console.log(this);
      setTimeout(function(){
        self.budgetFeedback.classList.remove('showItem');
        //notice that self is used in place of this because this will not be read as a property so we have to first assign some variable to this before starting function
      },4000);
      //in the setTimeout the alert box that value cannot be negative will be removed
    }
    else {
      this.budgetAmount.textContent = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }

  //showBalance method
  showBalance(){
    const expense = this.totalExpense();
    const total = parseInt(this.budgetAmount.textContent)- expense;
    //note that we are not calling out the constructor we are just calling another method inside a method
    this.balanceAmount.textContent = total;
    if(total<0)
    {
      this.balance.classList.remove('showGreen','showBlack');
      this.balance.classList.add('showRed');
    }
    else if(total > 0)
    {
      this.balance.classList.remove('showRed','showBlack');
      this.balance.classList.add('showGreen');
    }
    else if(total === 0)
    {
      this.balance.classList.remove('showGreen','showRed');
      this.balance.classList.add('showBlack');
    }
  }
//submit expense form
submitExpenseForm(){
  const expenseValue = this.expenseInput.value;
  const amountValue = this.amountInput.value;
  if(expenseValue ===''|| amountValue==='' || amountValue<=0){
    this.expenseFeedback.classList.add('showItem');
    this.expenseFeedback.innerHTML = `<p>values cannot be empty, zero or negative</p>`;
    const self=this;
    setTimeout(function(){
      self.expenseFeedback.classList.remove('showItem');
    }, 4000);
    //notice that self is used in place of this because this will not be read as a property so we have to first assign some variable to this before starting function
    //we are now not inside a method , we are inside a function of method
  }
  else
  {
    let amount=parseInt(amountValue);
    this.expenseInput.value="";
    this.amountInput.value="";

//creating expense object
    let expense={
      id:this.itemID,
      title:expenseValue,
      amount:amount,
    }
    this.itemID++;
    this.itemList.push(expense);
    this.addExpense(expense);
    this.showBalance();
    //show balance
  }
}
addExpense(expense)
{
  const div = document.createElement('div');
  div.classList.add('expense');
  div.innerHTML=`
  <div class="expense-item d-flex justify-content-between align-items-baseline">
    <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
    <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
    <div class="expense-icons list-item">
      <a href="#" class="edit-icon mx-2" data-id="${expense.id}"><i class="fas fa-edit"></i></a>
      <a href="#" class="delete-icon" data-id="${expense.id}"><i class="fas fa-trash"></i></a>
    </div>
  </div>
  `;
  this.expenseList.appendChild(div);
}

//total Expense
totalExpense(){
  let total =0;
  if(this.itemList.length>0){
    total=this.itemList.reduce(function(acc,curr){
      //console.log("total is ${acc} and the current value is ${curr.amount}")
      acc+=curr.amount;
      return acc;
    },0);
  }
  this.expenseAmount.textContent=total;
  return total;
}

//edit expense
editExpense(element){
  let id = parseInt(element.dataset.id);
  let parent = element.parentElement.parentElement.parentElement;
  //here we use 3 parentElement and one was use in calling so total 4
  //by first parentelement it comes to a tag and then 3 div then finally reaches to class="expense"
  //remove from DOM
  this.expenseList.removeChild(parent);
  //this only removes from the expense list we have to remove from listItem[] array also
  //we have to edit the expense list item from the array also

  //remove from the list
  //filter is gonna return the array
  let expense = this.itemList.filter(function(item){
    return item.id===id;
  });
  this.expenseInput.value = expense[0].title;
  this.amountInput.value = expense[0].amount;
  //the above both lines makes the item comes in a input box and then we can just edit there only and then we will basically call the add expense-submit
  let tempList = this.itemList.filter(function(item){
    return item.id !==id;
  });
  //this just the array of remaining items
  this.itemList = tempList;
  this.showBalance();//this just display the balance after the just clicking the edit icon basicl=ally removes the expenses of the editing item
}

//delete expense
deleteExpense(element){
  let id = parseInt(element.dataset.id);
  let parent = element.parentElement.parentElement.parentElement;
  //here we use 3 parentElement and one was use in calling so total 4
  //by first parentelement it comes to a tag and then 3 div then finally reaches to class="expense"
  //remove from DOM
  this.expenseList.removeChild(parent);
  let tempList = this.itemList.filter(function(item){
    return item.id!== id;
  });
  //this just the array of remaining items
  this.itemList = tempList;
  this.showBalance();
}
}

function eventListenters() {
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //new instance of UI class
  const ui=new UI();

  //budget form submit
  budgetForm.addEventListener('submit' , function(event) {
    event.preventDefault();
    ui.submitBudgetForm();
    //for not resubmitting the data basically hold the last data
  });
  //expense form submit
  expenseForm.addEventListener('submit' ,function(event){
    event.preventDefault();
    ui.submitExpenseForm();
  });
  //expense click
  expenseList.addEventListener('click' , function(event) {
     if(event.target.parentElement.classList.contains('edit-icon')){
       ui.editExpense(event.target.parentElement);
     }
     else if(event.target.parentElement.classList.contains('delete-icon')){
       ui.deleteExpense(event.target.parentElement);
     }
  });
}



document.addEventListener('DOMContentLoaded',function(){
  eventListenters();
});
