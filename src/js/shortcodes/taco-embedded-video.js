const embeddedVideo = {
  init() {
    const embeddedContainers = document.querySelectorAll('.taco-embedded-video');
    embeddedContainers.forEach((element) => {
      this.keepAspectRatio(element);
      this.playVideoOnClick(element);
    });
  },

  keepAspectRatio(container) {
    // Keep the aspect ratio to 16/9
    // TODO: remove this when browser support for css aspect-ratio is adequate
    const height = Math.floor(container.offsetWidth / 16 * 9);
    container.style.height = `${height}px`;

    // Limit the height to the poster height
    const poster = container.getElementsByClassName('poster')[0];
    if (poster) {
      const posterHeight = poster.offsetHeight;
      container.style.maxHeight = `${posterHeight}px`;
    }
  },

  playVideoOnClick(container) {
    const videoUrl = container.dataset.sourceVideo;
    container.addEventListener('click', (e) => {
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl;
      iframe.width = '480';
      iframe.height = '270';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowFullscreen = true;
      container.innerHTML = '';
      container.append(iframe);
    });
  },
};

embeddedVideo.init();
