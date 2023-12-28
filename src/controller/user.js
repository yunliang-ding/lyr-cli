module.exports = class extends think.Controller {
  async infoAction(){
    this.json({
      name: 100121
    })
  }
}