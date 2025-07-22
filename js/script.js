document.addEventListener('DOMContentLoaded', function() {
    fetchMarkdownFiles();
});

function fetchMarkdownFiles() {
    fetch('data/')
        .then(response => response.text())
        .then(text => {
            // Парсим список файлов из ответа сервера
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, 'text/html');
            const links = htmlDoc.querySelectorAll('a');
            
            const mdFiles = Array.from(links)
                .map(link => link.getAttribute('href'))
                .filter(href => href.endsWith('.md') && !href.startsWith('/'));
            
            generateTOC(mdFiles);
        })
        .catch(err => {
            console.error('Error fetching markdown files:', err);
            document.getElementById('toc').innerHTML = '<p>Ошибка загрузки списка файлов.</p>';
        });
}

function generateTOC(files) {
    const toc = document.getElementById('toc');
    if (files.length === 0) {
        toc.innerHTML = '<p>В папке md нет Markdown файлов.</p>';
        return;
    }
    
    const list = document.createElement('ul');
    files.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `viewer.html?file=${encodeURIComponent(file)}`;
        link.textContent = file.replace('.md', '');
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
    
    toc.appendChild(list);
}
