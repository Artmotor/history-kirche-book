document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || '01-intro';
    
    // Загрузка контента
    fetch(`content/${page}.md`)
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(md => {
            document.getElementById('content').innerHTML = marked.parse(md);
            highlightActiveLink(page);
            initMermaid();
        })
        .catch(err => {
            console.error('Error loading content:', err);
            document.getElementById('content').innerHTML = `
                <div class="error">
                    <h2>Ошибка загрузки</h2>
                    <p>Не удалось загрузить страницу: ${page}.md</p>
                    <a href="index.html">Вернуться на главную</a>
                </div>
            `;
        });
    
    // Генерация оглавления из статического списка
    generateTOC();
});

function generateTOC() {
    // Статический список файлов
    const files = [
        '01-intro',
        '02-kreschenie',
        // Добавьте другие файлы здесь
    ];
    
    const toc = document.getElementById('toc');
    const ul = document.createElement('ul');
    
    files.forEach(file => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `index.html?page=${file}`;
        a.textContent = formatTitle(file);
        li.appendChild(a);
        ul.appendChild(li);
    });
    
    toc.appendChild(ul);
}

function formatTitle(filename) {
    return filename.split('-').slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/\d+/g, '');
}

function highlightActiveLink(page) {
    document.querySelectorAll('#toc a').forEach(link => {
        if (link.href.includes(page)) {
            link.style.fontWeight = 'bold';
            link.style.background = 'rgba(255,255,255,0.2)';
        }
    });
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
