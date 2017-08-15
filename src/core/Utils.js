class Utils {
  copyObject(object) {
    return JSON.parse(JSON.stringify(object))
  }

  HttpGet(path, callback) {
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
}
