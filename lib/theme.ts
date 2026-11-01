// Runs before first paint: applies the saved theme (or the OS preference) so there's no flash.
// Shared by the root layout and the global 404 page, which renders outside that layout.
export const themeScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);var t=m?m[1]:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;
