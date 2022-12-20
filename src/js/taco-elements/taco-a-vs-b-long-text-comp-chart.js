document.querySelectorAll('.a-b-sect').forEach((section) => {
  const expandArea = section.querySelector('.taco-expand-area');

  section.querySelector('.taco-expand-button').addEventListener('click', (e) => {
    e.preventDefault();
    e.currentTarget.ariaExpanded = e.currentTarget.ariaExpanded === 'false' ? 'true' : 'false';
    expandArea.classList.toggle('closed');
  });

  section.querySelector('.a-b-mobile-show-all').addEventListener('click', (e) => {
    e.preventDefault();
    expandArea.classList.add('full-height');
  });
});
