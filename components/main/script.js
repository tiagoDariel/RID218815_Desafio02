// Define o diretório onde estão os arquivos dos componentes
const directory = './components/main/';

// Lista dos nomes dos componentes HTML que serão carregados dinamicamente
const components = ['CardPopularPosts', 'CardRecentPosts', 'Categories']

// Objeto para armazenar os dados carregados do arquivo JSON
let data = {}

// Carrega o arquivo JSON com os dados dos posts e categorias
fetch(`${directory}data.json`)
    .then(response => response.json()) // Converte a resposta para JSON
    .then(result => {
        data = { ...result } // Armazena os dados no objeto 'data'
    }).catch((err) => { 
        console.log(err); // Loga erro no console caso falhe
    });

// Função que converte nomes camelCase para kebab-case
const camelToKebab = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') 
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') 
        .toLowerCase(); // Transforma tudo em minúsculo
}

// Função para carregar os arquivos HTML dos componentes e injetá-los no DOM
const loadPages = () => {
    return Promise.all(
        components.map((html) => {
            const tagName = camelToKebab(html); // Converte para kebab-case
            const tag = document.getElementById(`content-box-${tagName}`); // Seleciona a div onde o HTML será inserido

            return fetch(`${directory}components/${html}.html`)
                .then(response => response.text()) // Lê o conteúdo HTML como texto
                .then(data => {
                    if(!data) return;
                    tag.innerHTML = data; // Insere o HTML no elemento
                });
        })
    );
}

// Função que carrega os posts populares e os renderiza no DOM
const loadPopularPosts = () => new Promise((resolve, reject) => {
    console.log('Loading posts...')
    const tagPopular = document.getElementById('card-popular-posts'); // Seleciona a seção de posts populares

    // Cria elementos de post para cada item em 'data.popular'
    data.popular.forEach((post) => {
        const postTag = document.createElement('a');
        postTag.href = '#'; // Define o link para a página do post
        postTag.className = 'post-cards';
        postTag.innerHTML = `
            <div class="post-cards__img">
                <img class="border-radius" src="${post.img}" alt="${post.title}">
            </div>
            <div class="post-cards__content">    
                <h5 class="post-cards__content-title">${post.title}</h5>
                <div class="post-cards__content-date">${post.created_at}</div>
            </div>
        `;
        tagPopular.appendChild(postTag); // Adiciona o post ao DOM
    })
    
    resolve();
})

// Função que carrega os posts recentes e os renderiza no DOM
const loadRecentPosts = () => new Promise((resolve, reject) => {
    console.log('Loading posts...')
    const tagRecent = document.getElementById('card-recent-posts'); // Seleciona a seção de posts recentes

    data.recent.forEach((post) => {
        const postTag = document.createElement('a');
        postTag.href = '#'; // Define o link para a página do post
        postTag.className = 'recent-cards border-radius';
        postTag.innerHTML = `
            <div class="recent-cards__image">
                <img src="${post.img}" alt="Tiago Dariel" class="recent-cards__image-img">
            </div>
            <div class="recent-cards__content">
                <div class="recent-cards__content-categories">${post.categories}</div>
                <div class="recent-cards__content-title">${post.title}</div>
                <div class="recent-cards__content-author"><strong>By</strong> ${post.author}</div>
                <div class="recent-cards__content-description">${post.description}</div>
                <div class="recent-cards__content-date">${post.created_at}</div>
            </div>
        `;
        tagRecent.appendChild(postTag); // Adiciona o post ao DOM
    })
    
    resolve();
})

// Função que carrega as categorias a partir dos posts e renderiza os filtros
const loadCategories = () => new Promise((resolve, reject) => {
    console.log('Loading categories...')
    const tagCategories = document.getElementById('categories'); // Seleciona o contêiner de categorias

    // Conta a ocorrência de cada categoria nos posts recentes
    const countCategories = data.recent.reduce((acc, post) => {
        const categories = post.categories;
        acc['Todos'] = (acc['Todos'] || 0) + 1; // Sempre incrementa "Todos"
        acc[categories] = (acc[categories] || 0) + 1;
        return acc;
    }, {});
    
    // Cria os elementos de categoria no DOM
    Object.entries(countCategories).forEach(([category, total]) => {
        const categoryTag = document.createElement('a');
        categoryTag.className = 'categories__item';
        categoryTag.innerHTML = `
            <div class="category" style="cursor: pointer;" onClick="filter('${category}')"> <span> > ${category}</span><span>(${total})</span></div>
        `;
        tagCategories.appendChild(categoryTag);
    })
    
    resolve();
})

// Função que filtra os posts recentes com base na categoria selecionada
const filter = (category) => {
    const tagRecent = document.getElementById('card-recent-posts');
    tagRecent.innerHTML = ''; // Limpa a lista de posts

    // Reinsere somente os posts da categoria escolhida (ou todos)
    data.recent.forEach((post) => {
        if(post.categories === category || category === 'Todos') {
            const postTag = document.createElement('a');
            postTag.href = '#'; // Define o link para a página do post
            postTag.className = 'recent-cards';
            postTag.innerHTML = `
                <div class="recent-cards__image">
                    <img src="${post.img}" alt="Tiago Dariel" class="recent-cards__image-img">
                </div>
                <div class="recent-cards__content">
                    <div class="recent-cards__content-categories">${post.categories}</div>
                    <div class="recent-cards__content-title">${post.title}</div>
                    <div class="recent-cards__content-author"><strong>By</strong> ${post.author}</div>
                    <div class="recent-cards__content-description">${post.description}</div>
                    <div class="recent-cards__content-date">${post.created_at}</div>
                </div>
            `;
            tagRecent.appendChild(postTag);
        }
    })
}

// Função principal que orquestra o carregamento de tudo
const load = async () => {
    try {
        await loadPages();         // Carrega os arquivos HTML dos componentes
        await loadPopularPosts();  // Carrega os posts populares
        await loadRecentPosts();   // Carrega os posts recentes
        await loadCategories();    // Carrega as categorias
    } catch (error) {
        console.error("Erro ao carregar:", error); // Captura erros
    }
}

// Chama a função de carregamento quando o script for executado
load()
