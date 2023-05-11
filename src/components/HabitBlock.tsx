
const getDaysInRange = (startDate, endDate, frequency) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysOfWeek = Object.values(frequency);
  let daysInRange = 0;

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    if (daysOfWeek.includes(date.getDay())) {
      daysInRange++;
    }
  }

  return daysInRange;
};

const HabitBlock = ({ habit, index, onComplete }) => {
  const { title, description, frequency, completedDates, streak, startDate, endDate } = habit;

  const progress = completedDates.length / getDaysInRange(startDate, endDate, frequency) * 100;

  return (
    <div className="habit-block">
      <h2>{title}</h2>
      <p>{description}</p>
      <p>Start Date: {startDate}</p>
      <p>End Date: {endDate}</p>
      <p>Streak: {streak}</p>
      <p>Progress: {isNaN(progress) ? 'N/A' : `${progress.toFixed(1)}%`}</p>
      <button onClick={() => onComplete(index)}>Complete</button>
    </div>
  );
};
