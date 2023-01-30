let loginIdValidator = new FieldValidator('txtLoginId', async function(val) {
  if(!val) {
    return '请填写账号'
  }
  const resp = await API.exists(val)
  if(resp.data) {
    return '该账号已经被占用'
  }
})

let nicknameValidator = new FieldValidator('txtNickname', function(val) {
  if(!val) {
    return '请填写昵称'
  }
})

let loginPwdValidator = new FieldValidator('txtLoginPwd', function(val) {
  if(!val) {
    return '请输入密码'
  }
})

let loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function(val) {
  if(!val) {
    return '请输入确认密码'
  }
  if(val !== loginPwdValidator.input.value) {
    return '两次密码不一致'
  }
})

const form = $('.user-form')
form.onsubmit = async function(e) {
  e.preventDefault()
  const results = await FieldValidator.validate(loginIdValidator, nicknameValidator, loginPwdValidator, loginPwdConfirmValidator)
  if(results) {
    const resp = await API.reg({
      loginId: loginIdValidator.input.value,
      loginPwd: loginPwdValidator.input.value,
      nickname: nicknameValidator.input.value
    })
    if(resp.code === 0) {
      alert('注册成功！')
      location.href = './login.html'
    }
  }else {
    return
  }
}