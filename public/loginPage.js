'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = data => {
   let { login, password } = data;
   ApiConnector.login({ login, password }, data => {
      if (data.success) {
         location.reload();
      } else {
         userForm.setLoginErrorMessage(data.error);
      }
   })
}

userForm.registerFormCallback = data => {
   let { login, password } = data;
   ApiConnector.register({ login, password }, data => {
      if (data.success) {
         location.reload();
      } else {
         userForm.setRegisterErrorMessage(data.error);
      }
   })
}


