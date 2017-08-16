class HopworkPageObject extends PageObject{

  constructor() {
    console.log('HopworkPageObject');
    super();
    this.MESSAGING_PATH = '/conversation/';
    this.UI = {
      message: {
        container: '.conversation__new-message',
        message: 'textarea#response',
        selector: '#iago-container .iago-snippet-selector'
      },
      contact: {
        identity: '.conversation__message__infos > span'
      },
      iago : '#iago-container'
    };
  }

  setMessage(message) {
    const textarea  = document.querySelector(this.UI.message.message);

    if(!textarea) return;

		textarea.value 		= message;
  }

  getFirstname() {
    return document.querySelector(this.UI.contact.identity).innerText.trim();
  }
}
