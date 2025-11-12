const periodLabels = {
    daily: 'Yesterday', weekly: 'Last Week', monthly: 'Last Month'
};

const onTimeframeClick = (activities) => (event) => {
    const selectedTimeframe = event.target.dataset.value;

    const options = document.querySelectorAll('.timeframe-selector__option');
    options.forEach(card => {
        card.classList.remove('timeframe-selector__option--selected');
    });

    event.target.classList.add('timeframe-selector__option--selected');

    activities.forEach(activity => {
        const data = activity.timeframes[selectedTimeframe];
        const {current, previous} = data;
        const card = document.querySelector(`[data-activity="${activity.title}"]`);
        card.querySelector('.activity-card__current-stats').textContent = `${current}hrs`;
        card.querySelector('.activity-card__previous-stats').textContent = `${periodLabels[selectedTimeframe]} - ${previous}hrs`;
    });
};

const renderActivities = (activity) => {
    const container = document.querySelector('.dashboard');
    const timeframe = 'daily';
    const card = document.createElement('article');
    const activitySlug = activity.title.toLowerCase().replace(/\s+/g, '-');
    card.className = `activity-card activity-card--${activitySlug}`;
    card.dataset.activity = activity.title;

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
          <span class="activity-card__current-stats">${data?.current}hrs</span>
          <span class="activity-card__previous-stats">${periodLabel} - ${data?.previous}hrs</span>
        </div>
      </div>
        `;

    container.appendChild(card);
}


fetch('/data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(activities => {
        activities.forEach(renderActivities);

        const timeframeOptions = document.querySelectorAll('.timeframe-selector__option');
        timeframeOptions.forEach(timeframeOption => timeframeOption.addEventListener('click', onTimeframeClick(activities)));
    })
    .catch(error => {
        console.error('Error loading activity data:', error);
        const container = document.querySelector('.dashboard');
        if (container) {
            container.innerHTML = '<p style="color: white; text-align: center; padding: 2rem;">Failed to load activity data. Please try again later.</p>';
        }
    });