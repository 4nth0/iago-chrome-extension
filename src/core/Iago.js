class Iago {
  constructor() {
    this.Tag     = new TagManager();
    this.utils   = new Utils();
    this.Snippet = new SnippetManager();

    this.loadPageObject();
  }

  loadPageObject() {
    // @TODO Add proxy to load right Page Object ( Linkedin, Hopwork, .. )
    this.UI = new LinkedinPageObject();

    this.UI.onUpdateSelectedSnippet((snippetIndex) => {
      const snippet = this.Snippet.getById(snippetIndex);

      if(snippet) {
        const formatedSnippet = this.Tag.formateSnippet(snippet);
        this.UI.setMessage(formatedSnippet.content);
      }
    });
  }

  run() {
    const successHandler = (snippets) => {
      this.UI.setSnippets(snippets);
      this.UI.displaySnippets();
    };

    const errorhandler = () => {};

    this.clean();
    this.Snippet.load(successHandler, errorhandler);
  }

  clean() {
    this.UI.clean();
  }
}
