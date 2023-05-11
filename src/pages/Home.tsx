import React, { useState, useEffect } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTextarea,
  IonDatetime,
} from '@ionic/react';
import { IonToast } from '@ionic/react';

const App = () => {
  const [showToast, setShowToast] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitFrequency, setHabitFrequency] = useState('');
  const [habitBlocks, setHabitBlocks] = useState(() => {
    const storedHabitBlocks = localStorage.getItem('habitBlocks');
    return storedHabitBlocks ? JSON.parse(storedHabitBlocks) : [];
  });

  useEffect(() => {
    localStorage.setItem('habitBlocks', JSON.stringify(habitBlocks));
  }, [habitBlocks]);

  const [selectedDates, setSelectedDates] = useState([]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (habitBlocks.some((habitBlock) => habitBlock.name === habitName)) {
      alert('Habit block with the same name already exists!');
      return;
    }
    setHabitBlocks([
      ...habitBlocks,
      {
        name: habitName,
        description: habitDescription,
        frequency: habitFrequency,
        startDate: selectedDates[0],
        endDate: selectedDates[selectedDates.length - 1],
        completedDates: [],
        streak: 0,
      },
    ]);
    setHabitName('');
    setHabitDescription('');
    setHabitFrequency('');
    setSelectedDates([]);
  };


  const handleDateSelection = (event) => {
    const selectedDate = event.detail.value;
    setSelectedDates([...selectedDates, selectedDate]);
  };

  const handleCompleteHabit = (habitIndex) => {
    const habitBlock = habitBlocks[habitIndex];
    const completedDates = [...habitBlock.completedDates];
    const currentDate = new Date().toISOString().split('T')[0];

    if (completedDates.includes(currentDate)) {
      return;
    }

    completedDates.push(currentDate);
    habitBlock.completedDates = completedDates;

    const streak = calculateStreak(habitBlock.frequency, completedDates);
    habitBlock.streak = streak;

    const updatedHabitBlocks = [
      ...habitBlocks.slice(0, habitIndex),
      habitBlock,
      ...habitBlocks.slice(habitIndex + 1),
    ];

    setHabitBlocks(updatedHabitBlocks);
    setShowToast(true);

    localStorage.setItem('habitBlocks', JSON.stringify(updatedHabitBlocks));
  };

  const handleToastClose = () => {
    setShowToast(false);
  };



  const calculateStreak = (frequency, completedDates) => {
    const daysOfWeek = Object.values(frequency);

    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    let streak = 0;
    let streakComplete = false;

    for (let i = completedDates.length - 1; i >= 0; i--) {
      const completedDate = new Date(completedDates[i]);
      const completedDay = completedDate.getDay();

      if (daysOfWeek.includes(completedDay)) {
        if (!streakComplete && completedDay === currentDay) {
          streak++;
          streakComplete = true;
        } else if (streakComplete) {
          if ((currentDay - completedDay + 7) % 7 === 1) {
            streak++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }

    return streak;
  };


  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Habit Buddy</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleFormSubmit}>
          <IonItem>
            <IonLabel position="floating">Habit Name</IonLabel>
            <IonInput
              type="text"
              value={habitName}
              onIonChange={(event) => setHabitName(event.detail.value)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonTextarea
              value={habitDescription}
              onIonChange={(event) => setHabitDescription(event.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Frequency</IonLabel>
            <IonInput
              type="text"
              value={habitFrequency}
              onIonChange={(event) => setHabitFrequency(event.detail.value)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel>Start Date</IonLabel>
            <IonDatetime
              displayFormat="MMM DD, YYYY"
              value={selectedDates[selectedDates.length - 1]}
              onIonChange={handleDateSelection}
            />
          </IonItem>
          <IonButton type="submit">Add Habit Block</IonButton>
        </form>
        {habitBlocks.length > 0 && (
          <IonList>
            {habitBlocks.map((habitBlock, index) => (
              <IonItem key={index}>
                <IonButton onClick={() => handleCompleteHabit(index)}>
                  Mark as Completed
                </IonButton>
                <IonLabel>
                  <h2>{habitBlock.name}</h2>
                  <p>{habitBlock.description}</p>
                  <p>
                    Frequency: {habitBlock.frequency} | Streak:{' '}
                    {habitBlock.streak}
                  </p>
                  <p>
                    Start Date:{' '}
                    {new Date(habitBlock.startDate).toLocaleDateString()} | End
                    Date:{' '}
                    {new Date(habitBlock.endDate).toLocaleDateString()}
                  </p>
                </IonLabel>
                <IonButton onClick={() => handleCompleteHabit(index)}>Complete</IonButton>
              </IonItem>
            ))}
          </IonList>   
        )}
         <IonToast
          isOpen={showToast}
          onDidDismiss={handleToastClose}
          message="Habit completed!"
          duration={3000}
        />
      </IonContent>
    </IonApp>
  );
};

export default App;
