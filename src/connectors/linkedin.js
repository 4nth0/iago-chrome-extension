class LinkedinPageObject extends PageObject{

  constructor() {
    console.log('LinkedinPageObject');
    super();
    this.MESSAGING_PATH = '/messaging/thread';
    this.UI = {
      message: {
        container: '.msg-thread .msg-compose-form',
        message: '.msg-thread .msg-compose-form textarea[name="message"]',
        preview: '.msg-thread .msg-compose-form pre',
        selector: '#iago-container .iago-snippet-selector',
        actions: '.msg-compose-form__left-actions'
      },
      contact: {
        identity: '.msg-entity-lockup h2'
      },
      iago : '#iago-container'
    };
  }

  setMessage(message) {
    const textarea  = document.querySelector(this.UI.message.message);
		const preview   = document.querySelector(this.UI.message.preview);

    if(!textarea || !preview) return;

		textarea.value 		= message;
		preview.innerHTML = message;
  }

  getFirstname() {
    return document.querySelector(this.UI.contact.identity).innerText.trim().split(' ')[0];
  }
}
