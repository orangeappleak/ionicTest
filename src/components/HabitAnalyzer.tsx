import React from "react";

const HabitAnalyzer = ({ habit }) => {
  // Calculate the number of times the habit was completed in the last week
  const completedCount = habit.history.filter((date) => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return date >= oneWeekAgo;
  }).length;

  return (
    <div className="habit-analyzer">
      <h3>Analytics for {habit.name}</h3>
      <p>
        Completed {completedCount} times in the last week ({habit.frequency} day
        intervals).
      </p>
    </div>
  );
};

export default HabitAnalyzer;
