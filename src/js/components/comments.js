const { includeScriptTag } = require('../lib/helpers');

const comments = {
  nextPage: 1,
  perPage: 10,
  endpoint: 'comments',
  commentsSection: document.querySelector('#comments'),
  loadMore: document.querySelector('#load-more-comments-button-wrapper .btn'),
  isLoading: document.querySelector('#load-more-comments-button-wrapper .loading-animation'),

  /**
     * Init
     */
  init() {
    if (!this.commentsSection || typeof window.FlexiComments === 'undefined') { return; }

    // Register Events
    this.listener();

    // Load the WordPress Comments Reply Script when needed
    this.loadCommentsReplyScript();
  },

  /**
     * Register all events
     */
  listener() {
    this.loadMore.addEventListener('click', () => {
      this.getMore();
    });

    const self = this;

    window.addEventListener('scroll', function loadCommentsOnScroll() {
      const scrollLimit = self.getElementOffsetTop(self.commentsSection) - window.innerHeight - 200;

      if (window.pageYOffset > scrollLimit) {
        // Load 1st comments page
        self.getMore();
        window.removeEventListener('scroll', loadCommentsOnScroll);
      }
    });
  },

  /**
     * Total comments of current post
     */
  getTotalCommentsCount() {
    return parseInt(window.FlexiComments.commentsTotal, 10);
  },

  /**
     * Current comments displayed
     */
  getCurrentCommentsCount() {
    const commentItems = document.querySelectorAll('#comments li');

    return commentItems.length;
  },

  getElementOffsetTop(element) {
    let result = element.offsetTop;
    while (element.offsetParent !== document.body) {
      element = element.offsetParent;
      result += element.offsetTop;
    }
    return result;
  },

  buildQuery(params) {
    return Object.keys(params)
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
      .join('&');
  },

  handleGetMoreResponse(response) {
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10);

    this.isLoading.classList.add('hidden');
    if (this.nextPage <= totalPages) {
      this.loadMore.classList.remove('hidden');
    }
  },

  /**
     * Make the ajax request
     *
     * @return void
     */
  getMore() {
    this.loadMore.classList.add('hidden');

    if (this.getCurrentCommentsCount() >= this.getTotalCommentsCount()) {
      return;
    }

    this.isLoading.classList.remove('hidden');

    const formData = {
      post: window.FlexiComments.post_id,
      page: this.nextPage,
      per_page: this.perPage,
    };

    fetch(`${window.FlexiComments.api_url + this.endpoint}?${this.buildQuery(formData)}`, {
      headers: {
        // Backend part relies on this header
        'x-requested-with': 'XMLHttpRequest',
      },
    }).then((response) => {
      response.json().then((newComments) => {
        this.nextPage += 1;
        this.render(newComments);
        this.handleGetMoreResponse(response);
      });
    }).catch((response) => {
      this.handleGetMoreResponse(response);
    });
  },

  /**
     * Get HTML template of children comments
     *
     * @param {object} comment
     * @return {string} Html
     */
  getChildrenPart(comment) {
    let children = '';
    if (comment.children) {
      children = comment.children.map((childComment) => this.template(childComment)).join('');
      return `<ul class="children-comments-list">${children}</ul>`;
    }
    return '';
  },

  /**
     * Get HTML template of reply container
     *
     * @param {object} comment
     * @return {string} Html
     */
  getReplyTextPart(comment) {
    let reply = '';
    if (comment.children) {
      reply = `
                <div class="replies-counter">
                    <svg class="icon-comment" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 101 75">
                        <path d="M101 75c-9-24-46-27-60-27v13c0 3-3 4-5 2L1 34a3 3 0 01 0-4L35 1c2-2 5 0 5 2v13c16 0 61 6 61 59"/>
                    </svg>
                    ${comment.children.length} ${window.FlexiComments.text.reply}
                </div>`;
    }
    return reply;
  },

  /* eslint-disable max-len */
  /**
     * Get HTML template of single comment
     *
     * @param {object} comment
     * @return {string} Html
     */
  template(comment) {
    /* <img src="..." .../> line is splitted to prevent it from being optimized by lazy-loading stuff - it turns src to data-src, that just breaks displaying here */
    return `<li class="comment" id="comment-${comment.id}">
            <div class="comment-header">
                <div class="avatar-container">
                    <img` + ` src="${comment.author_avatar}"` + ` width="33" height="33" alt="${comment.author_name}" class="avatar avatar-33 wp-user-avatar wp-user-avatar-33 alignnone photo">
                </div>
                <div class="comment-info">
                    <cite class="comment-author">
                        ${comment.author_name}
                    </cite>
                    <time datetime="${comment.date}" class="time">
                        ${comment.humanTimeAgo}
                    </time>
                </div>
            </div>
            <div class="comment-content">
                ${comment.content}
            </div>
            <div class="comment-footer" id="comment-footer-${comment.id}">
                <div class="reply-link-container">
                    <svg  class="icon-comment" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 237 240">
                        <path d="M119 0C53 0 0 41 0 91c0 38 30 72 76 85-1 14-5 28-12 40-6 10-7 16-4 20 2 3 4 4 8 4s16 0 90-63c48-13 80-47 80-86-1-50-54-91-119-91"/>
                    </svg>
                    <a rel="nofollow" class="comment-reply-link" href="#comment-${comment.id}" onclick="return addComment.moveForm('comment-footer-${comment.id}', ${comment.id}, 'respond', ${window.FlexiComments.post_id})" aria-label="${window.FlexiComments.text.reply_to} ${comment.author_name}">
                        ${window.FlexiComments.text.reply}
                    </a>
                </div>
            </div>
            ${this.getReplyTextPart(comment)}
            ${this.getChildrenPart(comment)}
        </li>`;
  },
  /* eslint-enable */

  /**
     * Render more comments
     *
     * @param object comments
     */
  render(newComments) {
    const html = newComments.map((comment) => this.template(comment)).join('');

    document.querySelector('.comment-list').insertAdjacentHTML('beforeend', html);
  },

  /**
     * Load WordPress comments-reply.js only when the comments section intersects with the viewport
     */
  loadCommentsReplyScript() {
    const observer = new IntersectionObserver((entries, thisObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          includeScriptTag('/wp/wp-includes/js/comment-reply.min.js');
          thisObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });

    observer.observe(this.commentsSection);
  },

};

module.exports = comments;
