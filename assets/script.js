document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем список глав
        const response = await fetch('chapters.json');
        if (!response.ok) throw new Error('Failed to load chapters list');
        const chapters = await response.json();
        
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') || chapters[0].id;
        const currentIndex = chapters.findIndex(ch => ch.id === page);
        
        // Инициализация навигации
        await initNavigation(chapters, currentIndex);
        
        // Загрузка контента
        await loadContent(chapters, page);
        
    } catch (err) {
        console.error('Initialization error:', err);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h2>Ошибка загрузки</h2>
                <p>${err.message}</p>
                <a href="?page=01-intro">Вернуться на главную</a>
            </div>
        `;
    }
});

async function loadContent(chapters, page) {
    try {
        const chapter = chapters.find(ch => ch.id === page);
        if (!chapter) throw new Error('Chapter not found');
        
        const contentResponse = await fetch(chapter.file);
        if (!contentResponse.ok) throw new Error('File not found');
        const md = await contentResponse.text();
        
        document.getElementById('content').innerHTML = marked.parse(md);
        highlightActiveLink(page);
        initMermaid();
        updatePageTitle(chapter.title);
        
        // Обновляем кнопки навигации
        updateNavButtons(chapters, page);
        
    } catch (err) {
        console.error('Error loading content:', err);
        document.getElementById('content').innerHTML = `
            <div class="error">
                <h2>Ошибка загрузки</h2>
                <p>${err.message}</p>
                <a href="?page=01-intro">Вернуться на главную</a>
            </div>
        `;
    }
}

async function initNavigation(chapters) {
    const toc = document.getElementById('toc');
    toc.innerHTML = ''; // Очищаем существующее оглавление
    
    const ul = document.createElement('ul');
    
    chapters.forEach(chapter => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `?page=${chapter.id}`;
        a.textContent = chapter.title;
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    toc.appendChild(ul);
}

function updateNavButtons(chapters, currentPage) {
    const currentIndex = chapters.findIndex(ch => ch.id === currentPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= chapters.length - 1;
    
    prevBtn.onclick = () => {
        if (currentIndex > 0) {
            window.location.href = `?page=${chapters[currentIndex - 1].id}`;
        }
    };
    
    nextBtn.onclick = () => {
        if (currentIndex < chapters.length - 1) {
            window.location.href = `?page=${chapters[currentIndex + 1].id}`;
        }
    };
}

function highlightActiveLink(page) {
    document.querySelectorAll('#toc a').forEach(link => {
        link.classList.toggle('active', link.href.includes(page));
    });
}

function updatePageTitle(title) {
    document.title = `История РПЦ - ${title}`;
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
