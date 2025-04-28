import { useEffect, useState } from 'react';

function VoiceActivityChart() {
  const [voiceData, setVoiceData] = useState([]);

  useEffect(() => {
    // Function to fetch the latest voice activity
    const fetchVoiceActivity = async () => {
      try {
        const response = await fetch('/api/voice-logs'); // adjust your endpoint!
        const data = await response.json();
        setVoiceData(data);
      } catch (error) {
        console.error('Error fetching voice activity:', error);
      }
    };

    fetchVoiceActivity(); // Fetch immediately when component mounts

    const interval = setInterval(fetchVoiceActivity, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="voice-activity">
      <h2>Voice Activity (Minutes)</h2>
      {/* Render your chart here */}
      <pre>{JSON.stringify(voiceData, null, 2)}</pre> {/* For testing purposes */}
    </div>
  );
}

export default VoiceActivityChart;
