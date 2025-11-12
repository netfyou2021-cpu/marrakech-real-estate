// Copy of root `script.js` to allow `dist/` to be served independently.
// This is a lightweight wrapper that loads the main script if present.
(function(){
  try{
    // If original script exists at /script.js, load it dynamically
    var s = document.createElement('script');
    s.src = '/script.js';
    s.defer = true;
    document.head.appendChild(s);
  }catch(e){ console.error(e); }
})();
