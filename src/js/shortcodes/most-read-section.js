//-------------------------------------------------------
// Most Read Articles Section:
// Expand/collapse content with 5+ articles for mobile - Show more/less
//-------------------------------------------------------

const mostRead = {
  init() {
    if (window.screen.width < 768) {
      const mostReadArticlesList = document.querySelectorAll('.articles-list-wrapper');

      mostReadArticlesList.forEach((list) => {
        const mostReadArticles = list.querySelectorAll('.article-item');

        if (mostReadArticles.length > 5) {
          const toggleBtn = list.querySelector('.btn-more-articles');

          toggleBtn.style.display = 'block';

          toggleBtn.addEventListener('click', (e) => {
            list.classList.toggle('list-show-more');

            e.currentTarget.classList.toggle('btn-clicked');
          });
        }
      });
    }
  },
};

mostRead.init();
