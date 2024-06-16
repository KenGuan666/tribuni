import React from 'react';

export const TimelineDisplay = ({ startTime, endTime }) => {
  startTime *= 1000
  endTime *= 1000
  const totalDuration = new Date(endTime) - new Date(startTime);
  const currentTime = new Date()
  const currentDuration = currentTime - new Date(startTime);
  let percentage = (currentDuration / totalDuration) * 100;

  if (percentage > 98.5) { percentage = 98.5 }

  const dateOptions = { month: 'numeric', day: 'numeric' };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: 'auto', fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#666' }}>
      <div
        style={{
          position: 'relative',
          height: '2px',
          width: '100%',
          // backgroundColor: '#ccc',
          borderRadius: '4px',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '2px',
            width: `${percentage}%`,
            borderTop: '2px solid #124de4',
            borderRadius: '4px 0 0 4px',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: `0px`,
            height: '2px',
            width: `${100 - percentage}%`,
            borderTop: '2px dashed #ccc',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            height: '12px',
            width: '12px',
            borderRadius: '50%',
            backgroundColor: '#FFF',
            border: '2px solid #124de4',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            height: '12px',
            width: '12px',
            borderRadius: '50%',
            backgroundColor: '#F29100',
            border: '2px solid #F29100',
          }}
        >
        </div>
        {
          percentage < 98 && 
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              right: '0px',
              height: '12px',
              width: '2px',
              backgroundColor: '#ccc',
            }}
          ></div>
        }
      </div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'left' }}>
          {/* <span>Start, </span> */}
          <span style={{ letterSpacing: '0.05em' }}>{new Date(startTime).toLocaleDateString(undefined, dateOptions)}</span>
        </div>
        {
          15 < percentage && percentage < 85 && 
          <div style={{ position: 'absolute', left: `${percentage}%`, transform: 'translateX(-50%)' }}>
            <span style={{ letterSpacing: '0.05em' }}>Today</span>
          </div>
        }
        <div style={{ textAlign: 'right' }}>
          {/* <span>End, </span> */}
          <span style={{ letterSpacing: '0.05em' }}>{new Date(endTime).toLocaleDateString(undefined, dateOptions)}</span>
        </div>
      </div>
    </div>
  );
};