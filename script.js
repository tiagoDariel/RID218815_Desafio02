[
  'header',
  'main',
  'footer'
].forEach(async sem => {
  const tag = document.querySelector(`${sem}`);
  
  fetch(`/components/${sem}/index.html`)
    .then(response => response.text())
    .then(data => {
      tag.innerHTML = data;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet'; 
      link.href = `/components/${sem}/style.css`;
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = `/components/${sem}/script.js`;
      document.head.appendChild(script);
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
})


