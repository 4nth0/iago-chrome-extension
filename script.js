(function(){

  const SNIPPETS_PATH              = 'https://19v49q9wg3.execute-api.eu-central-1.amazonaws.com/dev/snippets';
  const MESSAGING_PATH             = '/messaging/thread';
  const LOCATION_LISTENER_INTERVAL = 750;
  const SNIPPET_TAG_REGEX          = /\{\{(\w*)\}\}/ig;
	const markup                     = `<div id="iago-container">
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
  const disabledMessage = `<div id="iago-container">
    <p style="margin-bottom: 20px;font-size:12px;text-align:center;">Le fil de discussion est fermée.</p>
  </div>`;

  var snippets = [];
  var locationInterval;

	const UI = {
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

  function HttpGet(path, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', path);

    xhr.onload = () => {
      if (xhr.status === 200) {
        callback(null, xhr.responseText);
      }
      else {
        callback(xhr.status);
      }
    };

    xhr.send();
  }

	function init() {
    loadSnippets(() => {
      startApplication();
    });
	}

  function startApplication() {
    clean();
    if(isMessagingPage()) {
      if( isDisabled() ) {
        insertDisabledMessage();
      } else {
        insertSnippet();
        insertCommands();
      }
    }
    startListeners();
  }

  function loadSnippets(callback) {
    HttpGet(SNIPPETS_PATH, (error, response) => {
      snippets = JSON.parse(response);
      callback();
    });
  }

  function insertSnippet() {
		const target    = document.querySelector(UI.message.container);
		const child     = document.createElement('div');

		child.innerHTML = markup;

		target.prepend(child);

    const selector = document.querySelector(UI.message.selector);

    for(let i = 0; i < snippets.length; i++) {
      const option = document.createElement('option');

      option.value     = snippets[i].id;
      option.innerHTML = snippets[i].title;

      selector.appendChild(option);
    }
  }

  function insertDisabledMessage() {
    const target    = document.querySelector(UI.message.container);
		const child     = document.createElement('div');

		child.innerHTML = disabledMessage;

		target.prepend(child);
  }

  function insertCommands() {
    const commands = document.querySelector(UI.message.actions);
    const saveContainer = document.createElement('form');

    saveContainer.className = 'msg-upload-attachment-form inline-block ember-view';

    saveContainer.innerHTML = `
      <label for="image-attachment" class="msg-upload-attachment-form__label msg-compose-form__attachment-button button-tertiary-medium-round-muted mt1">
        <span class="svg-icon-wrap"><span class="visually-hidden">Ajouter une image</span></span>
      </label>
    `;

    commands.appendChild(saveContainer);
  }

	function clean() {
    const target = document.querySelector(UI.iago);

    setMessage('');

		if(target) {
			target.remove();
		}

    if(locationInterval) {
      clearInterval(locationInterval);
    }
	}

  function isDisabled() {
    return document.querySelector(UI.message.message).getAttribute('disabled') == "";
  }

	function startListeners() {
    if( isMessagingPage() && !isDisabled() ) {
      const node = document.querySelector(UI.message.selector);

      node.addEventListener('change', () => {
        updateMessageContent(node.value);
      });
    }

    listenLocation((newLocation) => {
      startApplication();
    });
	}

  function setMessage(message) {
    const textarea = document.querySelector(UI.message.message);
		const preview = document.querySelector(UI.message.preview);

    if(!textarea || !preview) return;

		textarea.value 		= message;
		preview.innerHTML = message;
  }

  function isMessagingPage() {
    return window.location.pathname.indexOf(MESSAGING_PATH) == 0;
  }

  function listenLocation(callback) {
    var currentLocation = window.location.pathname;

    locationInterval = setInterval(() => {
      let location = window.location.pathname;

      if(location != currentLocation) {
        currentLocation = location;
        callback(currentLocation);
      }

    }, LOCATION_LISTENER_INTERVAL);
  }

	function getSnippet(snippetIndex) {
    const searchResult = snippets.filter((snippet) => snippet.id == snippetIndex);

		if(searchResult.length) {
      return formateSnippet(searchResult[0]);
    } else {
      return false;
    }
	}

  function snippetContainTags(snippet) {
    return SNIPPET_TAG_REGEX.test(snippet.content);
  }

  function getFirstname() {
    return document.querySelector(UI.contact.identity).innerText.trim().split(' ')[0];
  }

  function applyTag(tag, snippetContent) {
    switch(tag) {
      case '{{firstname}}':
        const firstname = getFirstname();
        return snippetContent.replace(tag, firstname);
        break;
      default:
        return snippetContent;
        break;
    }
  }

  function formateSnippet(snippet) {
    const snippetCopy = JSON.parse(JSON.stringify(snippet))
    const isTagsInsideSnippet = snippetContainTags(snippetCopy);

    if(isTagsInsideSnippet) {

      const matches = snippetCopy.content.match(SNIPPET_TAG_REGEX);

      for (let i = 0; i < matches.length; i++) {
        snippetCopy.content = applyTag(matches[i], snippetCopy.content);
      }

      return snippetCopy;

    } else {
      return snippetCopy;
    }
  }

	function updateMessageContent(snippetIndex) {
    const snippet = getSnippet(snippetIndex);

		if(!snippet && snippet.content) {
			return;
		}

    setMessage(snippet.content);
	}

  function courtesy(message) {
    return true;
  }

  function detectLanguage(message) {}

  setTimeout(init, 3000);

})();
