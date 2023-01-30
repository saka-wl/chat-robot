;(async function () {
  const userInfo = {
    loginId: null,
    nickname: null,
    curText: ''
  }

  const dom = {
    loginOut: $('.close'),
    textMessage: $('#txtMsg'),
    sendBtn: $('.msg-container button'),
    chat: $('.chat-container'),
    nickname: $('#nickname'),
    loginId: $('#loginId')
  }

  await API.profile().then(res => {
    if (res.code === 0) {
      userInfo.loginId = res.data.loginId
      userInfo.nickname = res.data.nickname
      dom.nickname.innerText = userInfo.nickname
      dom.loginId.innerText = userInfo.loginId
    } else if (res.code === 401) {
      alert('请重新登录')
      location.href = './login.html'
    }
  })

  await API.getHistory().then(resp => {
    if (resp.code === 401) {
      alert('请重新登录')
      location.href = './login.html'
    } else if (resp.code === 0) {
      for (let item of resp.data) {
        chatAdd(item)
      }
      scrollToBottom()
    }
  })

  function formatDate(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  function chatAdd(chatInfo) {
    const div = $$$('div')
    div.classList.add('chat-item')
    if (chatInfo.from) {
      div.classList.add('me')
    }
    const img = $$$('img')
    img.className = 'chat-avatar'
    img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg'

    const content = $$$('div')
    content.className = 'chat-content'
    content.innerText = chatInfo.content

    const date = $$$('div')
    date.className = 'chat-date'
    date.innerText = formatDate(chatInfo.createdAt)

    div.appendChild(img)
    div.appendChild(content)
    div.appendChild(date)

    dom.chat.appendChild(div)
  }

  function scrollToBottom() {
    dom.chat.scrollTop = dom.chat.scrollHeight
  }

  dom.loginOut.onclick = function () {
    API.loginOut()
    location.href = './login.html'
  }

  dom.sendBtn.onclick = async function (e) {
    e.preventDefault()
    if (!dom.textMessage.value.trim()) {
      return
    }
    userInfo.curText = dom.textMessage.value.trim()
    dom.textMessage.value = ''
    chatAdd({
      content: userInfo.curText,
      createdAt: Date.now(),
      from: userInfo.nickname,
      to: null
    })
    scrollToBottom()
    await API.sendChat(userInfo.curText).then(res => {
      if (res.code === 401) {
        alert('请重新登录')
        location.href = './login.html'
      } else if (res.code === 0) {
        chatAdd({
          from: null,
          to: userInfo.loginId,
          ...res.data
        })
      }
    })
    scrollToBottom()
  }
})()
