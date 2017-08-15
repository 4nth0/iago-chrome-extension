class LinkedinPageObject extends PageObject{

  constructor() {
    this.MESSAGING_PATH             = '/messaging/thread';
    this.LOCATION_LISTENER_INTERVAL = 750;

    this.container;
    this.locationInterval;
    this.listeners = {};
    this.intervals = {};
    this.hooks     = {};
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

    this.markup                     = `<div id="iago-container">
  		<p style="margin-bottom: 5px;">
  	        <label>Snippet</label>
  	        <select class="iago-snippet-selector">
              <option>-- Choose snippet --</option>
  	        </select>
  	    </p>
        <p style="margin-bottom: 20px;font-size:12px;text-align:center;">
        -- <a href="#">advanced</a> --
        </p>
  	</div>`;

    this.disabledMessage = `<div id="iago-container">
      <p style="margin-bottom: 20px;font-size:12px;text-align:center;">Le fil de discussion est fermée.</p>
    </div>`;
  }

  getContainer() {
    return this.container;
  }

  clean() {
    const target = this.getContainer();

    this.setMessage('');

		if(target) {
			target.remove();
		}

    if(this.intervals.location) {
      clearInterval(this.intervals.location);
    }
  }

  setSnippets(snippets) {
    this.snippets = snippets;
  }

  displaySnippets() {
    if(this._isMessagingPage()) {
      if( this._isDisabled() ) {
        this._insertDisabledMessage();
      } else {
        this._insertSnippet(this.snippets);
      }
    }
    this._startListeners();
  }

  _insertSnippet(snippets) {
    this.container = document.createElement('div');
    this.target = document.querySelector(this.UI.message.container);

		this.container.innerHTML = this.markup;

		this.target.prepend(this.container);

    const selector = document.querySelector(this.UI.message.selector);

    for(let i = 0; i < snippets.length; i++) {
      const option = document.createElement('option');

      option.value     = snippets[i].id;
      option.innerHTML = snippets[i].title;

      selector.appendChild(option);
    }
  }

  _isMessagingPage() {
    return window.location.pathname.indexOf(this.MESSAGING_PATH) == 0;
  }

  _isDisabled() {
    return document.querySelector(this.UI.message.message).getAttribute('disabled') == "";
  }

  _insertDisabledMessage() {
    this.container = document.createElement('div');
    this.target = document.querySelector(this.UI.message.container);

		this.container.innerHTML = this.disabledMessage;

		this.target.prepend(this.container);
  }

  onUpdateSelectedSnippet(handler) {
    this.hooks.updateSelected = handler;
  }

  _startListeners() {
    if( this._isMessagingPage() && !this._isDisabled() ) {
      const node = document.querySelector(this.UI.message.selector);

      this.listeners.selector = node.addEventListener('change', () => {
        if(this.hooks.updateSelected) {
          this.hooks.updateSelected(node.value);
        }
      });
    }

    this._listenLocation(() => {
      this.clean();
      this.displaySnippets();
    });
  }

  setMessage(message) {
    const textarea  = document.querySelector(this.UI.message.message);
		const preview   = document.querySelector(this.UI.message.preview);

    if(!textarea || !preview) return;

		textarea.value 		= message;
		preview.innerHTML = message;
  }

  _listenLocation(callback) {
    var currentLocation = window.location.pathname;

    this.intervals.location = setInterval(() => {
      let location = window.location.pathname;

      if(location != currentLocation) {
        currentLocation = location;
        callback(currentLocation);
      }

    }, this.LOCATION_LISTENER_INTERVAL);
  }

  getFirstname() {
    return document.querySelector(this.UI.contact.identity).innerText.trim().split(' ')[0];
  }
}
