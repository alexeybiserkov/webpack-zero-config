const { includeScriptTag } = require('../lib/helpers');

function heroSection() {
  const heroQuizButton = document.getElementById('hero-quiz-button');
  const quizModal = document.getElementById('hp-quiz-modal');
  const quizPlaceholder = quizModal.getElementsByClassName('hp-quiz-placeholder')[0];
  const closeButton = quizModal.getElementsByClassName('close-button')[0];
  let initialised = false;

  function init() {
    // Add interact script on the fly
    const interactScript = includeScriptTag('https://i.tryinteract.com/embed/app.js');

    interactScript.onload = () => {
      const ref = quizPlaceholder.id.replace('interact-', '');

      const params = {
        ref,
        appId: ref,
        width: 800,
        height: 800,
        async: true,
        host: 'quiz.tryinteract.com',
        auto_resize: true,
        mobile: true,
        no_cover: false,
      };

      if (heroQuizButton.redirect === 'host') {
        params.redirect_host = true;
      }

      const quiz = new window.InteractApp();
      quiz.initialize(params);
      quiz.display();
    };
  }

  heroQuizButton.addEventListener('click', () => {
    // Show the modal
    quizModal.style.display = 'block';

    if (!initialised) {
      init();
      initialised = true;
    }
  });

  closeButton.addEventListener('click', () => {
    // Hide
    quizModal.style.display = 'none';
  });
}

heroSection();
