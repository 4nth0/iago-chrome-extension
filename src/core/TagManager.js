class TagManager {
  constructor() {
    this.utils  = new Utils();
    this.ui     = new LinkedinPageObject();
    this.SNIPPET_TAG_REGEX = /\{\{(\w*)\}\}/ig;
  }

  snippetContainTags(snippet) {
    return this.SNIPPET_TAG_REGEX.test(snippet.content);
  }

  applyTag(tag, snippetContent) {
    switch(tag) {
      case '{{firstname}}':
        const firstname = this.ui.getFirstname();
        return snippetContent.replace(tag, firstname);
        break;
      default:
        return snippetContent;
        break;
    }
  }

  formateSnippet(snippet) {
    const snippetCopy = this.utils.copyObject(snippet);
    const isTagsInsideSnippet = this.snippetContainTags(snippetCopy);

    if(isTagsInsideSnippet) {

      const matches = snippetCopy.content.match(this.SNIPPET_TAG_REGEX);

      for (let i = 0; i < matches.length; i++) {
        snippetCopy.content = this.applyTag(matches[i], snippetCopy.content);
      }

      return snippetCopy;

    } else {
      return snippetCopy;
    }
  }

}
