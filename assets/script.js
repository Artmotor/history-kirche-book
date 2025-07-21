// Конфигурация
const config = {
    contentPath: 'content/',
    files: [
        { id: '01-intro', title: 'Введение' },
        { id: '02-kreschenie', title: 'Крещение Руси' }
        // Добавьте другие главы здесь
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || config.files[0].id;
    const currentIndex = config.files.findIndex(f => f.id === page);
    
    // Инициализация навигации
    initNavigation(currentIndex);
    
    // Загрузка контента
    loadContent(page);
});

function loadContent(page) {
    fetch(`${config.contentPath}${page}.md`)
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(md => {
            document.getElementById('content').innerHTML = marked.parse(md);
            highlightActiveLink(page);
            initMermaid();
            updatePageTitle(page);
        })
        .catch(err => {
            console.error('Error loading content:', err);
            document.getElementById('content').innerHTML = `
                <div class="error">
                    <h2>Ошибка загрузки</h2>
                    <p>Не удалось загрузить страницу: ${page}.md</p>
                    <a href="?page=${config.files[0].id}">Вернуться на главную</a>
                </div>
            `;
        });
}

function initNavigation(currentIndex) {
    const toc = document.getElementById('toc');
    const ul = document.createElement('ul');
    
    config.files.forEach((file, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `?page=${file.id}`;
        a.textContent = file.title;
        if (index === currentIndex) {
            a.classList.add('active');
        }
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    toc.appendChild(ul);
    
    // Кнопки навигации
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (currentIndex <= 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.onclick = () => {
            window.location.href = `?page=${config.files[currentIndex - 1].id}`;
        };
    }
    
    if (currentIndex >= config.files.length - 1) {
        nextBtn.disabled = true;
    } else {
        nextBtn.onclick = () => {
            window.location.href = `?page=${config.files[currentIndex + 1].id}`;
        };
    }
}

function highlightActiveLink(page) {
    document.querySelectorAll('#toc a').forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(page)) {
            link.classList.add('active');
        }
    });
}

function updatePageTitle(page) {
    const file = config.files.find(f => f.id === page);
    if (file) {
        document.title = `История РПЦ - ${file.title}`;
    }
}

function initMermaid() {
    if (window.mermaid) {
        mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
        });
        mermaid.init(undefined, '.mermaid');
    }
}
