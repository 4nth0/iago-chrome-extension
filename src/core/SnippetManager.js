class SnippetManager {
  constructor() {
    this.utils          = new Utils();
    this.snippets       = {};
    this.SNIPPETS_PATH  = 'https://19v49q9wg3.execute-api.eu-central-1.amazonaws.com/dev/snippets';
  }

  load(callback) {
    this.utils.HttpGet(this.SNIPPETS_PATH, (error, response) => {
      this.snippets = JSON.parse(response);
      callback(this.snippets);
    });
  }

  getById(snippetIndex) {
    const searchResult = this.snippets.filter((snippet) => snippet.id == snippetIndex);

    return searchResult.length ? searchResult[0] : null;
  }
}
