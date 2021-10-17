import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { fontSizes, spacingSizes } from './src/utils/size';
import { colors } from './src/utils/color';
import { Timer } from './src/features/timer/Timer';
import {FocusHistory} from './src/features/focus/FocusHistory';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS = {
  COMPLETE: 1,
  CANCELLED: 2,
};

export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory([
      ...focusHistory,
      {
        key: String(FocusHistory.length +1),
        subject,
        status,
      },
    ]);
  };



  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHitory');
      if (!!history && JSON.parse(history).length>0) {
        setFocusHistory(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFocusHistory();
  }, []);

  useEffect(() => {
    async function storeFocusHistory() {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focusHistory));
    } catch (e) {
      console.log(e);
    }
  }},[focusHistory]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUS.COMPLETE);
            setFocusSubject(null);
          }}
          clearSubject={() => {
            addFocusHistorySubjectWithState(focusSubject, STATUS.CANCELLED);
            setFocusSubject(null);
          }}
        />
      ) : (
        <View style={{flex: 1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory
            focusHistory={focusHistory}
            onClear={() => {
              setFocusHistory([]);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBlue,
    padding: Platform.OS === 'ios' ? spacingSizes.md : spacingSizes.lg,
  },
});
