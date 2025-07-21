document.addEventListener('DOMContentLoaded', () => {
    // Параметры URL
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || '01-intro';
    
    // Загрузка контента
    fetch(`content/${page}.md`)
        .then(response => response.text())
        .then(md => {
            document.getElementById('content').innerHTML = marked.parse(md);
            highlightActiveLink(page);
        });
    
    // Генерация оглавления
    fetch('content/')
        .then(response => response.text())
        .then(text => {
            const files = text.match(/href="(.*?\.md)"/g)
                .map(f => f.replace('href="', '').replace('.md"', ''))
                .filter(f => !f.startsWith('.'));
            
            const toc = document.getElementById('toc');
            const ul = document.createElement('ul');
            
            files.forEach(file => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `?page=${file}`;
                a.textContent = formatTitle(file);
                li.appendChild(a);
                ul.appendChild(li);
            });
            
            toc.appendChild(ul);
        });
});

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