document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Загружаем список глав
        const response = await fetch('chapters.json');
        if (!response.ok) throw new Error('Не удалось загрузить список глав');
        const chapters = await response.json();
        
        const params = new URLSearchParams(window.location.search);
        const pageId = params.get('page') || chapters[0].id;
        
        // Инициализация навигации
        await initNavigation(chapters);
        
        // Загрузка контента
        await loadContent(chapters, pageId);
        
    } catch (err) {
        console.error('Ошибка инициализации:', err);
        showError(err.message);
    }
});

async function loadContent(chapters, pageId) {
    try {
        const chapter = chapters.find(ch => ch.id === pageId);
        if (!chapter) throw new Error('Глава не найдена');
        
        const contentResponse = await fetch(chapter.file);
        if (!contentResponse.ok) throw new Error('Файл не найден');
        const md = await contentResponse.text();
        
        document.getElementById('content').innerHTML = marked.parse(md);
        highlightActiveLink(pageId);
        initMermaid();
        updatePageTitle(chapter.title);
        updateNavButtons(chapters, pageId);
        
    } catch (err) {
        console.error('Ошибка загрузки контента:', err);
        showError(err.message);
    }
}

function initNavigation(chapters) {
    const toc = document.getElementById('toc');
    if (!toc) return;
    
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

function updateNavButtons(chapters, currentPageId) {
    const currentIndex = chapters.findIndex(ch => ch.id === currentPageId);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= chapters.length - 1;
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentIndex > 0) {
                window.location.href = `?page=${chapters[currentIndex - 1].id}`;
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentIndex < chapters.length - 1) {
                window.location.href = `?page=${chapters[currentIndex + 1].id}`;
            }
        };
    }
}

function highlightActiveLink(pageId) {
    const links = document.querySelectorAll('#toc a');
    if (!links) return;
    
    links.forEach(link => {
        link.classList.toggle('active', link.href.includes(pageId));
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

function showError(message) {
    const content = document.getElementById('content');
    if (content) {
        content.innerHTML = `
            <div class="error">
                <h2>Ошибка загрузки</h2>
                <p>${message}</p>
                <a href="?page=01-intro">Вернуться на главную</a>
            </div>
        `;
    }
}
