// Lista de seções semânticas a serem carregadas dinamicamente
[
  'header',
  'main',
  'footer'
].forEach(async sem => {
  // Seleciona a tag correspondente no DOM (ex: <header>, <main>, <footer>)
  const tag = document.querySelector(`${sem}`);
  
  // Busca o conteúdo HTML da seção correspondente
  fetch(`/components/${sem}/index.html`)
    .then(response => response.text()) // Converte a resposta para texto (HTML)
    .then(data => {
      // Insere o HTML carregado dentro da tag
      tag.innerHTML = data;
      
      // Cria um elemento <link> para importar o CSS da seção
      const link = document.createElement('link');
      link.rel = 'stylesheet'; 
      link.href = `/components/${sem}/style.css`;
      document.head.appendChild(link); // Adiciona o CSS ao <head>

      // Cria um elemento <script> para importar o JavaScript da seção
      const script = document.createElement('script');
      script.src = `/components/${sem}/script.js`;
      document.head.appendChild(script); // Adiciona o script ao <head>
    })
    .catch(error => {
      // Captura e exibe erros no carregamento da seção
      console.error(`Error loading ${sem}:`, error);
    });
});
