let loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
  if (!val) {
    return '请填写账号'
  }
})

let loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
  if (!val) {
    return '请输入密码'
  }
})

const form = $('.user-form')
form.onsubmit = async function (e) {
  e.preventDefault()
  const results = await FieldValidator.validate(loginIdValidator, loginPwdValidator)
  if (results) {
    const resp = await API.login({
      loginId: loginIdValidator.input.value,
      loginPwd: loginPwdValidator.input.value
    })
    if (resp.code === 0) {
      alert('登录成功！')
      location.href = './index.html'
    } else if (resp.code === 400) {
      alert('登录失败，检查账号密码')
      loginPwdValidator.input.value = ''
      loginIdValidator.p.innerHTML = '账号或者密码错误'
    }
  }
}
