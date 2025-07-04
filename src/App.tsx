import { useState, useEffect, useRef } from 'react';

// Main App component
const App = () => {
  // State to store the current UTC time
  const [currentUtcTime, setCurrentUtcTime] = useState('');
  // State to store the current time in 24-hour format
  const [currentTime, setCurrentTime] = useState('');
  // State to store the list of locations where it's 5 PM
  const [fivePmLocations, setFivePmLocations] = useState<string[]>([]);
  // State to store the 24/12 hour format preference
  const [is24Hour, setIs24Hour] = useState(true);
  // State to store the light/dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(false);
  // State to store the key for forcing re-render with fade
  const [timeKey, setTimeKey] = useState(0);
  // State to store the cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  // State to store whether the cursor is hovering over the element
  const [isHovering, setIsHovering] = useState(false);
  // State to store whether the cursor is hovering over a button
  const [isHalo, setIsHalo] = useState(false);
  // State to store whether the popup is shown
  const [showPopup, setShowPopup] = useState(true);
  // Ref for the cursor element
  const cursorRef = useRef<HTMLDivElement>(null);

  // List of common time zones (can be expanded)
  // This list is a representative sample. A comprehensive list would be much larger.
  const timeZones = [
    { id: 'America/New_York', name: 'New York' },
    { id: 'America/Los_Angeles', name: 'Los Angeles' },
    { id: 'Europe/London', name: 'London' },
    { id: 'Europe/Paris', name: 'Paris' },
    { id: 'Asia/Tokyo', name: 'Tokyo' },
    { id: 'Asia/Dubai', name: 'Dubai' },
    { id: 'Australia/Sydney', name: 'Sydney' },
    { id: 'Asia/Kolkata', name: 'Kolkata' },
    { id: 'America/Chicago', name: 'Chicago' },
    { id: 'America/Denver', name: 'Denver' },
    { id: 'America/Anchorage', name: 'Anchorage' },
    { id: 'Pacific/Honolulu', name: 'Honolulu' },
    { id: 'America/Sao_Paulo', name: 'Sao Paulo' },
    { id: 'Africa/Cairo', name: 'Cairo' },
    { id: 'Africa/Johannesburg', name: 'Johannesburg' },
    { id: 'Asia/Shanghai', name: 'Shanghai' },
    { id: 'Asia/Singapore', name: 'Singapore' },
    { id: 'Asia/Seoul', name: 'Seoul' },
    { id: 'Pacific/Auckland', name: 'Auckland' },
    { id: 'Europe/Berlin', name: 'Berlin' },
    { id: 'Europe/Rome', name: 'Rome' },
    { id: 'Europe/Moscow', name: 'Moscow' },
    { id: 'Asia/Jakarta', name: 'Jakarta' },
    { id: 'Asia/Riyadh', name: 'Riyadh' },
    { id: 'America/Mexico_City', name: 'Mexico City' },
    { id: 'America/Buenos_Aires', name: 'Buenos Aires' },
    { id: 'Europe/Madrid', name: 'Madrid' },
    { id: 'Europe/Dublin', name: 'Dublin' },
    { id: 'Asia/Bangkok', name: 'Bangkok' },
    { id: 'Asia/Tehran', name: 'Tehran' },
    { id: 'Africa/Lagos', name: 'Lagos' },
    { id: 'Pacific/Fiji', name: 'Fiji' },
    { id: 'America/Caracas', name: 'Caracas' },
    { id: 'America/Bogota', name: 'Bogota' },
    { id: 'America/Santiago', name: 'Santiago' },
    { id: 'Europe/Istanbul', name: 'Istanbul' },
    { id: 'Asia/Manila', name: 'Manila' },
    { id: 'Asia/Karachi', name: 'Karachi' },
    { id: 'Asia/Dhaka', name: 'Dhaka' },
    { id: 'Asia/Ho_Chi_Minh', name: 'Ho Chi Minh City' },
    { id: 'Europe/Athens', name: 'Athens' },
    { id: 'Europe/Warsaw', name: 'Warsaw' },
    { id: 'America/Vancouver', name: 'Vancouver' },
    { id: 'America/Toronto', name: 'Toronto' },
  ];

  // Custom cursor functionality
  useEffect(() => {
    let animationFrameId: number;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const updateCursor = () => {
      // Sluggish movement - interpolate between current and target position
      currentX += (targetX - currentX) * 0.1; // Adjust this value for more/less sluggishness
      currentY += (targetY - currentY) * 0.1;
      
      setCursorPosition({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX - 10; // Center the cursor
      targetY = e.clientY - 10;
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Halo logic for buttons
    const handleButtonOver = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('button')) {
        setIsHalo(true);
      }
    };
    const handleButtonOut = (e: Event) => {
      if (e.target instanceof Element && e.target.closest('button')) {
        setIsHalo(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleButtonOver);
    document.addEventListener('mouseout', handleButtonOut);

    // Start animation loop
    updateCursor();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleButtonOver);
      document.removeEventListener('mouseout', handleButtonOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Effect hook to update time and locations every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date(); // Get current date and time

      // Format current UTC time for display
      setCurrentUtcTime(now.toUTCString());

      // Format current time based on user preference
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
      });
      setCurrentTime(timeString);

      const locationsAtFivePm: string[] = [];
      // Iterate through each time zone
      timeZones.forEach(zone => {
        // Get the hour in the current time zone
        const hourInZone = parseInt(now.toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: zone.id }), 10);
 
        // Check if the hour is 17 (5 PM) and minutes are 0 (exactly on the hour)
        // We check for minutes to be 0 for exact 5:00 PM. If you want to show it for the whole 5 PM hour (e.g., 5:01 PM, 5:30 PM), remove `&& minuteInZone === 0`.
        if (hourInZone === 17) {
          locationsAtFivePm.push(zone.name); // Add location name if it's 5 PM
        }
      });
      setFivePmLocations(locationsAtFivePm); // Update the state with 5 PM locations
    };

    // Call updateTime immediately on component mount
    updateTime();
    // Set up an interval to call updateTime every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [is24Hour]); // Dependency array includes is24Hour to re-run effect when it changes

  const handleTimeFormatToggle = () => {
    setIs24Hour(!is24Hour);
    setTimeKey(prev => prev + 1); // Force re-render with new key
  };

  return (
    <div className={`min-h-screen w-full font-sans relative transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isHovering ? 'hover' : ''} ${isHalo ? `halo ${isDarkMode ? 'dark-mode' : 'light-mode'}` : ''}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      />

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
               style={{backdropFilter: 'blur(8px)'}}>
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="mb-6 text-base">Jimmy Buffet often said that "It's 5 o'clock somewhere." In his spirit, this site shows you where in the world it is currently around 5:00 PM.<br/></p>
            <button
              onClick={() => setShowPopup(false)}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <h1 className={`text-lg sm:text-xl font-light ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Where is it 5:00 PM?
          </h1>
        </div>

        {/* Settings Toggles */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex space-x-2">
          {/* 24/12 Hour Toggle */}
          <button
            onClick={handleTimeFormatToggle}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {is24Hour ? '24H' : '12H'}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Large Time Display */}
        <div className="text-center mb-8 sm:mb-12 pt-16 sm:pt-20">
          <div className={`text-lg sm:text-xl mb-2 sm:mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div 
            key={timeKey}
            className={`text-6xl sm:text-8xl md:text-9xl font-light mb-2 font-mono leading-none fade-in ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {currentTime}
          </div>
          <div className={`text-sm sm:text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            UTC: {currentUtcTime}
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Locations section */}
          <div className={`rounded-lg p-4 sm:p-6 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <h2 className={`text-lg sm:text-xl font-medium mb-3 sm:mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Cities at 5:00 PM ({fivePmLocations.length})
            </h2>
            {fivePmLocations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {fivePmLocations.map((location, index) => (
                  <div
                    key={index}
                    className={`rounded border px-3 sm:px-4 py-2 sm:py-3 font-medium text-sm sm:text-base transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    {location}
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-sm sm:text-base ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No major cities are at 5:00 PM right now.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-8 sm:mt-12 text-center text-xs sm:text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Made by{' '}
          <a
            href="https://vedantmodi.com"
            target="_blank"
            rel="noopener noreferrer"
            className={isDarkMode ? 'underline text-blue-400 hover:text-blue-300' : 'underline text-blue-600 hover:text-blue-800'}
          >
            Vedant Modi
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
