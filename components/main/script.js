const directory = './components/main/';

const components = ['CardPopularPosts', 'CardRecentPosts', 'Categories']

let data = {}

fetch(`${directory}data.json`)
    .then(response => response.json())
    .then( result => {
        
        data = {...result }
        
    }).catch((err) => { 
        console.log(err);
    });

const camelToKebab = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') 
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') 
        .toLowerCase();
}

const loadPages = () => {
    return Promise.all(
        components.map((html) => {
            const tagName = camelToKebab(html);
            const tag = document.getElementById(`content-box-${tagName}`);

            return fetch(`${directory}components/${html}.html`)
                .then(response => response.text())
                .then(data => {
                    if(!data) return;

                    tag.innerHTML = data;
                });
        })
    );
}


const loadPopularPosts = () => new Promise((resolve, reject) => {
    console.log('Loading posts...')
    const tagPopular = document.getElementById('card-popular-posts');

    data.popular.forEach((post) => {
        const postTag = document.createElement('div');
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
        tagPopular.appendChild(postTag);
    })
    
    resolve();
})

const loadRecentPosts = () => new Promise((resolve, reject) => {
    console.log('Loading posts...')
    const tagRecent = document.getElementById('card-recent-posts');

    data.recent.forEach((post) => {
        const postTag = document.createElement('div');
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
        tagRecent.appendChild(postTag);
    })
    
    resolve();
})

const loadCategories = () => new Promise((resolve, reject) => {
    console.log('Loading categories...')
    const tagCategories = document.getElementById('categories');

    const countCategories = data.recent.reduce((acc, post) => {
        const categories = post.categories;
        acc['Todos'] = (acc['Todos'] || 0) + 1;
        acc[categories] = (acc[categories] || 0) + 1;
        return acc;
    }, {});
    
    Object.entries(countCategories).forEach(([category, total]) => {
        const categoryTag = document.createElement('div');
        categoryTag.className = 'categories__item';
        categoryTag.innerHTML = `
            <div class="category" style="cursor: pointer;" onClick="filter('${category}')"> <span> > ${category}</span><span>(${total})</span></div>
        `;
        tagCategories.appendChild(categoryTag);
    })
    
    resolve();
})

const filter = (category) => {
    const tagRecent = document.getElementById('card-recent-posts');

    tagRecent.innerHTML = '';

    data.recent.forEach((post) => {
        if(post.categories === category || category === 'Todos') {
            const postTag = document.createElement('div');
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


const load = async () => {
    try {
        await loadPages();
        await loadPopularPosts();
        await loadRecentPosts();
        await loadCategories();
    } catch (error) {
        console.error("Erro ao carregar:", error);
    }
}

load()