const onboardingForm = document.querySelector('#onboardingForm');
const suggestionList = document.querySelector('#suggestionList');
const heroCalorieGoal = document.querySelector('#heroCalorieGoal');
const addFoodForm = document.querySelector('#addFoodForm');
const foodLog = document.querySelector('#foodLog');
const searchInput = document.querySelector('#searchInput');
const logTemplate = document.querySelector('#logItemTemplate');

const ACTIVITY_FACTOR = {
  sedentary: 1.15,
  light: 1.3,
  moderate: 1.5,
  intense: 1.75,
};

const GOAL_BASE = {
  lose: 1800,
  maintain: 2100,
  gain: 2500,
  fuel: 2350,
};

const FOOD_LEVERS = {
  lose: ['Boost fiber intake', 'Dial back sugary drinks', 'Prioritize protein-rich snacks'],
  maintain: ['Keep protein steady', 'Hydrate consistently', 'Move every 90 minutes'],
  gain: ['Stack an extra mini-meal', 'Pair carbs with protein', 'Track weekly weight trends'],
  fuel: ['Front-load complex carbs', 'Add electrolytes', 'Refuel within 45 minutes post-workout'],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function computeTarget(goal, activity, meals) {
  const base = GOAL_BASE[goal] ?? 2000;
  const factor = ACTIVITY_FACTOR[activity] ?? 1.3;
  const target = Math.round(base * factor);
  const perMeal = Math.round(target / Number(meals || 1));
  return { target, perMeal };
}

function buildSuggestions(goal, activity, meals) {
  const { target, perMeal } = computeTarget(goal, activity, meals);
  heroCalorieGoal.textContent = `${target.toLocaleString()} kcal`;

  const nudges = [
    `Aim for about ${perMeal} kcal per meal across ${meals} meals.`,
    `With a ${activity} day, keep hydration at 35ml/kg—set a timer if needed.`,
    ...FOOD_LEVERS[goal],
  ];

  suggestionList.innerHTML = '';
  nudges.forEach((tip) => {
    const row = document.createElement('p');
    row.textContent = `• ${tip}`;
    suggestionList.appendChild(row);
  });
}

function renderLog() {
  foodLog.innerHTML = '';
  if (!foodEntries.length) {
    foodLog.innerHTML = `<li class="muted">Nothing logged yet, add your first item.</li>`;
    return;
  }

  foodEntries.forEach((entry) => {
    const clone = logTemplate.content.cloneNode(true);
    clone.querySelector('.log-title').textContent = entry.name;
    clone.querySelector('.log-meta').textContent = `${entry.meal} • ${entry.time}`;
    clone.querySelector('.log-cal').textContent = `${entry.calories} kcal`;
    foodLog.appendChild(clone);
  });
}

onboardingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(onboardingForm);
  const goal = formData.get('goal');
  const activity = formData.get('activity');
  const meals = formData.get('meals');

  buildSuggestions(goal, activity, meals);

  onboardingForm.querySelector('button').textContent = 'Updated ✓';
  delay(2000).then(() => {
    onboardingForm.querySelector('button').textContent = 'Generate nudges';
  });
});

addFoodForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(addFoodForm);
  foodEntries.unshift({
    name: data.get('name'),
    calories: Number(data.get('calories')),
    meal: data.get('meal'),
    time: data.get('time'),
  });

  addFoodForm.reset();
  renderLog();
});

searchInput?.addEventListener('input', (event) => {
  filterSearch(event.target.value);
});

renderLog();
filterSearch('');
init();
