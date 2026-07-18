(function(){
  try {
    var k = location.pathname.indexOf('/admin') === 0 ? 'admin-theme' : 'user-theme';
    var t = localStorage.getItem(k);
    if (t !== 'light') {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})()
