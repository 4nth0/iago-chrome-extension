class Iago {
  constructor() {
    this.utils   = new Utils();
    this.Snippet = new SnippetManager();
    this.Tag     = new TagManager();

    this.loadPageObject();
  }

  loadPageObject() {
    switch(document.location.hostname) {
      case 'www.hopwork.fr':
        this.Interface = new HopworkPageObject();
        break;
      case 'www.linkedin.fr':
        this.Interface = new LinkedinPageObject();
        break;
      default:
        throw 'Unknow hostname.';

    }


    this.Interface.onUpdateSelectedSnippet((snippetIndex) => {
      const snippet = this.Snippet.getById(snippetIndex);

      if(snippet) {
        const formatedSnippet = this.Tag.formateSnippet(snippet, this.Interface);
        this.Interface.setMessage(formatedSnippet.content);
      }
    });
  }

  run() {
    const successHandler = (snippets) => {
      this.Interface.setSnippets(snippets);
      this.Interface.displaySnippets();
    };

    const errorhandler = () => {};

    this.clean();
    this.Snippet.load(successHandler, errorhandler);
  }

  clean() {
    this.Interface.clean();
  }
}
