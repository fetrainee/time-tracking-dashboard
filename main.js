const periodLabels = {
    daily: 'Yesterday', weekly: 'Last Week', monthly: 'Last Month'
};

fetch('/data.json')
    .then(response => response.json())
    .then(activities => {
        const container = document.querySelector('.dashboard');

        activities.forEach(activity => {
            const timeframe = 'daily';
            const card = document.createElement('article');
            const activitySlug = activity.title.toLowerCase().replace(/\s+/g, '-');
            card.className = `activity-card activity-card--${activitySlug}`;
            card.dataset.activity = activitySlug;

            const data = activity?.timeframes[timeframe];
            const periodLabel = periodLabels[timeframe];

            card.innerHTML = `
      <div class="activity-card__content">
        <div class="activity-card__header">
          <h2 class="activity-card__title">${activity.title}</h2>
          <button class="activity-card__menu-button" aria-label="Open menu">
            <img class="activity-card__menu-button-image" src="./images/icon-ellipsis.svg" alt="">
          </button>
        </div>
        <div class="activity-card__stats">
          <span class="activity-card__current-stats">${data.current}hrs</span>
          <span class="activity-card__previous-stats">${periodLabel} - ${data.previous}hrs</span>
        </div>
      </div>
    `;

            container.appendChild(card);
        });
    });