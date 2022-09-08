let s = ['//pl17086594.highperformancegate.com/b0/e0/f7/b0e0f7aef3540e5e4e5fbe40b4d9e002.js'];
s.forEach((a) => {
    let sc = document.createElement('script');
    sc.setAttribute('type', 'text/javascript');
    sc.setAttribute('src', a);
    document.querySelector('head').appendChild(sc);
})
