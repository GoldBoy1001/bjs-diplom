
const logoutButton = new LogoutButton();

logoutButton.action = () => {
   ApiConnector.logout(response => {
      if (response.success) {
         location.reload();
      }
   })
};

ApiConnector.current(current => {
   if (current.success) {
      ProfileWidget.showProfile(current.data);
   }
});


const ratesBoard = new RatesBoard();
function exchangeRates() {
   ApiConnector.getStocks(response => {
      if (response.success) {
         ratesBoard.clearTable();
         ratesBoard.fillTable(response.data);
      }
   });
}

setInterval(exchangeRates(), 60000);



const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = money => ApiConnector.addMoney(money, response => {
   if (response.success) {
      moneyManager.addMoneyAction();
      ProfileWidget.showProfile(response.data);
      return moneyManager.setMessage(true, 'Успешное пополнение счета' + money.currency + money.amount);
   }
   return moneyManager.setMessage('Ошибка: ' + response.error);
})



moneyManager.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
   if (response.success) {
      moneyManager.conversionMoneyAction();
      ProfileWidget.showProfile(response.data);
      return moneyManager.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
   }
   return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

moneyManager.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
   if (response.success) {
      moneyManager.sendMoneyAction();
      ProfileWidget.showProfile(response.data);
      return moneyManager.setMessage(true, 'Успешный перевод ' + debit.currency + debit.amount + ' получателю ' + debit.to);
   }
   return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

const favorite = new FavoritesWidget();
ApiConnector.getFavorites(response => {
   if (response.success) {
      favorite.clearTable();
      favorite.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      return;
   }
});

favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
   if (response.success) {
      favorite.clearTable();
      favorite.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      return moneyManager.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
   }
   return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});

favorite.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
   if (response.success) {
      favorite.clearTable();
      favorite.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      return moneyManager.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
   }
   return moneyManager.setMessage(false, 'Ошибка: ' + response.error);
});