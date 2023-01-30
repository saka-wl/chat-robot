class FieldValidator {
  /**
   * @param {String} txtId 文本框Id
   * @param {Function} validatorFunc 验证规则函数
   */
  constructor(txtId, validatorFunc) {
    this.input = $('#' + txtId)
    this.p = this.input.nextElementSibling
    this.validatorFunc = validatorFunc
    this.input.onblur = () => {
      this.validate()
    }
  }
  /**
   * 验证成功返回true，失败返回false
   */
  async validate() {
    const err = await this.validatorFunc(this.input.value)
    if(err) {
      this.p.innerHTML = err
      return false
    }else {
      this.p.innerHTML = ''
      return true
    }
  }

  /**
   * 对所有的验证器进行统一的验证,全通过为true
   * @param {FieldValidator[]} validators 
   */
  static async validate(...validators) {
    const proms = validators.map(item => item.validate())
    const results = await Promise.all(proms)
    return results.every(item => item)
  }
}


