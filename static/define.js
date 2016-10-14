(function() {
  const loadingMap = new Map();

  function cleanPath(path) {
    let elems = path.split('/');
    elems = elems.filter(p => p !== '.');
    let idx;
    while((idx = elems.indexOf('..')) !== -1) {
      elems = elems.splice(idx-1, 2);
    }
    return elems.join('/');
  }

  function load(path) {
    path = cleanPath(path);
    console.log(`Loading ${path}`);
    if (loadingMap.has(path)) {
      return loadingMap.get(path).promise;
    }

    const entry = {
      path,
      exports: {}
    }
    entry.promise = new Promise((resolve, reject) => {
      entry.resolve = resolve;

      const node = document.createElement('script');
      node.dataset.path = path;
      node.src = path;
      node.onerror = reject;
      document.head.appendChild(node);
    });
    loadingMap.set(path, entry);
    return entry.promise;
  }

  self.define = (dependencies, cb) => {
    console.log(`Called define from ${document.currentScript.dataset.path}`);
    const entry = loadingMap.get(document.currentScript.dataset.path);
    const basepath = (entry && entry.path.replace(/\/[^\/]+$/, '/')) || '';
    Promise.all(
      dependencies.map(dep => {
        if (dep === 'exports')
          return entry.exports;
        if (dep[0] === '/')
          return load(dep);
        return load(basepath + dep);
      })
    ).then(deps => {
        console.log(`Building ${entry.path}`);
        cb(deps);
        entry.resolve(entry.exports);
    });
  };
  self.define.amd = true;
})();