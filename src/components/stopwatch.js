import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import '../App.css';

const Stopwatch = () => {
  const [currentState, setCurrentState] = useState('Start');
  const [time, setTime] = useState(0);
  const [time2, setTime2] = useState(0);
  const [showDurations, setShowDurations] = useState(false);
  const [durations, setDurations] = useState({
    Cross: 0,
    F2L: 0,
    OLL: 0,
    PLL: 0,
  });
  const [recordedPLL, setRecordedPLL] = useState(false);
  const intervalRef = useRef(null);
  const lapCount = useRef(0);
  const stopwatch2IntervalRef = useRef(null);
  const shouldReset2ndStopwatch = useRef(false);

  const handleSpacebar = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      if (currentState === 'Start') {
        startNewTimer();
        startSecondStopwatch();
      } else if (currentState === 'Start Again') {
        stopSecondStopwatch();
        shouldReset2ndStopwatch.current = true;
        setTime2(0);
        setRecordedPLL(false); // Reset recorded PLL
        startNewTimer();
        startSecondStopwatch();
      } else if (currentState === 'PLL') {
        stopTimer();
        stopSecondStopwatch();
        recordLapTime('PLL');
        setRecordedPLL(true);
        setShowDurations(true); // Show durations after PLL
        setCurrentState('Start Again');
      } else if (currentState !== 'Stop') {
        stopSecondStopwatch();
        recordLapTime(currentState);
        changeState();
        startSecondStopwatch();
      }

      // Reset 2nd stopwatch on the 5th press
      if (lapCount.current === 4) {
        shouldReset2ndStopwatch.current = true;
        setTime2(0);
      }
    }
  };

  const startNewTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    lapCount.current = 0;
    setShowDurations(false); // Reset duration display
    setCurrentState('Cross');
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const startSecondStopwatch = () => {
    clearInterval(stopwatch2IntervalRef.current);
    setTime2(0);
    shouldReset2ndStopwatch.current = false;
    stopwatch2IntervalRef.current = setInterval(() => {
      setTime2((prevTime2) => prevTime2 + 10);
    }, 10);
  };

  const stopSecondStopwatch = () => {
    clearInterval(stopwatch2IntervalRef.current);
    if (shouldReset2ndStopwatch.current) {
      setTime2(0);
      shouldReset2ndStopwatch.current = false;
    }
  };

  const recordLapTime = (phase) => {
    lapCount.current++;
    setDurations((prevDurations) => ({
      ...prevDurations,
      [phase]: time2,
    }));
  };

  const changeState = () => {
    if (currentState === 'Start') {
      setCurrentState('Cross');
    } else if (currentState === 'Cross') {
      setCurrentState('F2L');
    } else if (currentState === 'F2L') {
      setCurrentState('OLL');
    } else if (currentState === 'OLL') {
      setCurrentState('PLL');
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      <Typography variant="h3" gutterBottom style={{ textAlign: 'center' }}>
        CFOP Timer
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4">{formatTime(time)}</Typography>
        <Typography variant="h4" style={{ marginLeft: '20px' }}>
          {formatTime(time2)}
        </Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        <Button
          onKeyDown={handleSpacebar}
          tabIndex={0}
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontSize: '1.5rem' }}
          className={`button-${currentState.toLowerCase().replace(' ', '-')}`}
        >
          {currentState}
        </Button>
      </div>
      {showDurations && (
        <Box mt={2} style={{ textAlign: 'center' }}>
          <Typography variant="h6">Durations:</Typography>
          <ul className="durations">
            <li>Cross: {formatTime(durations.Cross)}</li>
            {currentState !== 'Cross' && <li>F2L: {formatTime(durations.F2L)}</li>}
            {currentState !== 'Cross' && currentState !== 'F2L' && <li>OLL: {formatTime(durations.OLL)}</li>}
            {recordedPLL && <li>PLL: {formatTime(durations.PLL)}</li>}
          </ul>
        </Box>
      )}
    </div>
  );
}

export default Stopwatch;
