import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthCheck } from '../hooks/useAuthCheck';

const Dashboard = () => {
  const { user, accessToken } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const cameras = useSelector(state => state.cameras.cameras);

  console.log("cameras",cameras)

  // This will check auth on mount and refresh
  useAuthCheck();
  
  const [newCamera, setNewCamera] = useState({
    name: '',
    rtspUrl: '',
    location: ''
  });

  const handleAddCamera = async (e) => {
    e.preventDefault();
    if (!newCamera.name || !newCamera.rtspUrl) return;
    
    try {
      const response = await fetch('http://localhost:3000/api/camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({camera: newCamera, user}),
      });

      if (!response.ok) {
        throw new Error('Failed to add camera');
      }

      const addedCamera = await response.json();

      // Dispatch to Redux
      dispatch({
        type: 'ADD_CAMERA',
        payload: { ...addedCamera, status: 'stopped' }
      });
      
      setNewCamera({ name: '', rtspUrl: '', location: '' });
    } catch (error) {
      console.error('Error adding camera:', error);
      alert('Failed to add camera. Please try again.');
    }
  };

  const handleDeleteCamera = (id) => {
    // setCameras(prev => prev.filter(cam => cam.id !== id));
  };

  const toggleCameraStream = (id) => {
    // setCameras(prev => prev.map(cam => {
    //   if (cam.id === id) {
    //     return {
    //       ...cam,
    //       status: cam.status === 'streaming' ? 'stopped' : 'streaming'
    //     };
    //   }
    //   return cam;
    // }));
  };

  const styles = {
    container: {
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px',
      boxSizing: 'border-box',
      margin: 0
    },
    header: {
      marginBottom: '30px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '15px',
      textAlign: 'center'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      marginBottom: '20px'
    },
    userName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2563eb'
    },
    userEmail: {
      fontSize: '14px',
      color: '#6b7280'
    },
    addCameraSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px',
      maxWidth: '600px',
      margin: '0 auto 40px auto'
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '20px',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      border: '2px solid #d1d5db',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#2563eb'
    },
    addButton: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s'
    },
    addButtonHover: {
      backgroundColor: '#1d4ed8'
    },
    camerasGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '30px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    cameraCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    videoContainer: {
      position: 'relative',
      backgroundColor: '#000',
      aspectRatio: '16/9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    videoFeed: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    videoPlaceholder: {
      textAlign: 'center',
      color: 'white',
      fontSize: '18px'
    },
    liveIndicator: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      backgroundColor: '#dc2626',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    cardContent: {
      padding: '20px'
    },
    cameraName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px'
    },
    cameraLocation: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '8px'
    },
    rtspUrl: {
      fontSize: '14px',
      color: '#9ca3af',
      marginBottom: '20px',
      wordBreak: 'break-all'
    },
    controls: {
      display: 'flex',
      gap: '12px'
    },
    controlButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s'
    },
    startButton: {
      backgroundColor: '#059669',
      color: 'white'
    },
    stopButton: {
      backgroundColor: '#dc2626',
      color: 'white'
    },
    deleteButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Camera Dashboard</h1>
        {user && (
          <div style={styles.userInfo}>
            <span style={styles.userName}>Hello, {user.username}!</span>
            <span style={styles.userEmail}>{user.email}</span>
          </div>
        )}
      </div>
      
      {/* Add Camera Form */}
      <div style={styles.addCameraSection}>
        <h2 style={styles.formTitle}>Add New Camera</h2>
        <form onSubmit={handleAddCamera} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Camera Name *</label>
            <input
              type="text"
              value={newCamera.name}
              onChange={(e) => setNewCamera(prev => ({ ...prev, name: e.target.value }))}
              style={styles.input}
              placeholder="Enter camera name (e.g., Front Door Camera)"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>RTSP URL *</label>
            <input
              type="text"
              value={newCamera.rtspUrl}
              onChange={(e) => setNewCamera(prev => ({ ...prev, rtspUrl: e.target.value }))}
              style={styles.input}
              placeholder="rtsp://username:password@camera-ip:554/stream"
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              value={newCamera.location}
              onChange={(e) => setNewCamera(prev => ({ ...prev, location: e.target.value }))}
              style={styles.input}
              placeholder="Enter camera location (e.g., Front Entrance)"
            />
          </div>
          
          <button type="submit" style={styles.addButton}>
            Add Camera
          </button>
        </form>
      </div>

      {/* Camera Feeds */}
      <div style={styles.camerasGrid}>
        {cameras.map(camera => (
          <div key={camera.id} style={styles.cameraCard}>
            {/* Video Feed */}
            <div style={styles.videoContainer}>
              {camera.status === 'streaming' ? (
                <>
                  {/* For demo purposes, showing placeholder. In real app, this would be WebRTC video element */}
                  <div style={styles.videoPlaceholder}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>📹</div>
                    <div>Live Camera Feed</div>
                    <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
                      {camera.rtspUrl}
                    </div>
                  </div>
                  <div style={styles.liveIndicator}>LIVE</div>
                </>
              ) : (
                <div style={styles.videoPlaceholder}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📵</div>
                  <div>Camera Stopped</div>
                </div>
              )}
            </div>

            {/* Camera Info */}
            <div style={styles.cardContent}>
              <h3 style={styles.cameraName}>{camera.name}</h3>
              {camera.location && <p style={styles.cameraLocation}>📍 {camera.location}</p>}
              <p style={styles.rtspUrl}>🔗 {camera.rtspUrl}</p>
              
              <div style={styles.controls}>
                <button
                  onClick={() => toggleCameraStream(camera.id)}
                  style={{
                    ...styles.controlButton,
                    ...(camera.status === 'streaming' ? styles.stopButton : styles.startButton)
                  }}
                >
                  {camera.status === 'streaming' ? '⏹️ Stop' : '▶️ Start'} Stream
                </button>
                <button
                  onClick={() => handleDeleteCamera(camera.id)}
                  style={{ ...styles.controlButton, ...styles.deleteButton }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {cameras.length === 0 && (
        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '18px', marginTop: '40px' }}>
          No cameras added yet. Add your first camera above! 📹
        </div>
      )}
    </div>
  );
};

export default Dashboard;