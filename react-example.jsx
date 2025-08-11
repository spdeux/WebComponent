import React, { useEffect, useRef, useState } from 'react';

const DirectDepositReactExample = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState('initial-react-token-123');
  const elementRef = useRef(null);

  const addEvent = (eventType, eventData) => {
    const newEvent = {
      id: Date.now(),
      type: eventType,
      data: eventData,
      timestamp: new Date().toLocaleTimeString()
    };
    setEvents(prev => [...prev, newEvent]);
  };

  useEffect(() => {
    // Event listeners for Direct Deposit component
    const handleStateChanged = (event) => {
      addEvent('State Changed', event.detail);
    };

    const handleTokenRefreshRequired = (event) => {
      addEvent('Token Refresh Required', event.detail);
      
      // Automatically refresh token
      setTimeout(() => {
        const newToken = 'react-refreshed-token-' + Date.now();
        setToken(newToken);
        if (elementRef.current) {
          elementRef.current.updateToken(newToken);
        }
        addEvent('Token Updated', { newToken });
      }, 2000);
    };

    const handleAccountAdded = (event) => {
      addEvent('Account Added', event.detail);
    };

    const handleAccountRemoved = (event) => {
      addEvent('Account Removed', event.detail);
    };

    const handleSettingsUpdated = (event) => {
      addEvent('Settings Updated', event.detail);
    };

    const handleVerificationCompleted = (event) => {
      addEvent('Verification Completed', event.detail);
    };

    const handleErrorOccurred = (event) => {
      addEvent('Error Occurred', event.detail);
    };

    // Add event listeners
    document.addEventListener('depositStateChanged', handleStateChanged);
    document.addEventListener('tokenRefreshRequired', handleTokenRefreshRequired);
    document.addEventListener('accountAdded', handleAccountAdded);
    document.addEventListener('accountRemoved', handleAccountRemoved);
    document.addEventListener('settingsUpdated', handleSettingsUpdated);
    document.addEventListener('verificationCompleted', handleVerificationCompleted);
    document.addEventListener('errorOccurred', handleErrorOccurred);

    // Cleanup
    return () => {
      document.removeEventListener('depositStateChanged', handleStateChanged);
      document.removeEventListener('tokenRefreshRequired', handleTokenRefreshRequired);
      document.removeEventListener('accountAdded', handleAccountAdded);
      document.removeEventListener('accountRemoved', handleAccountRemoved);
      document.removeEventListener('settingsUpdated', handleSettingsUpdated);
      document.removeEventListener('verificationCompleted', handleVerificationCompleted);
      document.removeEventListener('errorOccurred', handleErrorOccurred);
    };
  }, []);

  const handleManualTokenUpdate = () => {
    const newToken = 'react-manual-token-' + Date.now();
    setToken(newToken);
    if (elementRef.current) {
      elementRef.current.updateToken(newToken);
    }
    addEvent('Manual Token Update', { newToken });
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ 
        marginBottom: '30px', 
        paddingBottom: '20px', 
        borderBottom: '1px solid #eee' 
      }}>
        <h1>Direct Deposit Web Component</h1>
        <p><strong>Framework:</strong> React</p>
        <p>This example demonstrates how to use the Direct Deposit web component in a React application.</p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px', 
        flexWrap: 'wrap' 
      }}>
        <button 
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={handleManualTokenUpdate}
        >
          Refresh Token
        </button>
        <button 
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#6c757d',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={clearEvents}
        >
          Clear Events
        </button>
      </div>

      {/* Direct Deposit Web Component */}
      <direct-deposit-element 
        ref={elementRef}
        employee-id="emp-react-12345"
        api-base-url="/api/direct-deposit"
        auth-token={token}
      />

      {/* Event Log */}
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '15px',
        marginTop: '20px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <h4 style={{ marginTop: 0 }}>Event Log ({events.length})</h4>
        {events.length === 0 ? (
          <p>Listening for events...</p>
        ) : (
          events.map(event => (
            <div 
              key={event.id}
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                margin: '5px 0',
                padding: '5px',
                background: 'white',
                borderRadius: '3px',
                borderLeft: '3px solid #007bff'
              }}
            >
              <strong>{event.type}</strong> - {event.timestamp}<br />
              {JSON.stringify(event.data, null, 2)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DirectDepositReactExample; 