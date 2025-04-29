const directory = './components/main/';

const components = ['posts']

const data = {}

fetch(`${directory}data.json`)
    .then(response => response.json())
    .then( result => {
        
        data.posts = result.posts;
        
    }).catch((err) => { 
        reject(err);
    });

const loadPages = () => new Promise((resolve, reject) => {
    components.forEach((html) => {
        const tag = document.getElementById(`content-box-${html}`);
        console.log('rtda');
        
        fetch(`${directory}components/${html}.html`)
            .then(response => response.text())
            .then(data => {
                tag.innerHTML = data;

                resolve()
            }).catch((err) => { 
                reject(err);
            });
    })
})


const loadPosts = () => new Promise((resolve, reject) => {
    console.log('Loading posts...')
    const tag = document.getElementById('posts');

    data.posts.forEach((post) => {
        const postTag = document.createElement('div');
        postTag.className = 'post-cards';
        postTag.innerHTML = `
            <div class="post-cards__img">
                <img src="${post.img}" alt="${post.title}">
            </div>
            <div class="post-cards__content">    
                <h5 class="post-cards__content-title">${post.title}</h5>
                <div class="post-cards__content-date">${post.date}</div>
            </div>
        `;
        tag.appendChild(postTag);
    })
    
    resolve();
})


const load = async () => {
    await loadPages()
    await loadPosts()
}

load()