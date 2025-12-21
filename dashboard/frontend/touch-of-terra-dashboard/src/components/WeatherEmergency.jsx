import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function WeatherEmergency() {
    const [data, setData] = useState(null);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        fetchWeatherStatus();

        // Check every 10 minutes
        const interval = setInterval(fetchWeatherStatus, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchWeatherStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/api/external/weather/emergency`);
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (err) {
            console.error('Error fetching weather status:', err);
        }
    };

    if (!data || data.status === 'normal' || !visible) {
        return null;
    }

    const isCold = data.status === 'code_blue';

    return (
        <div className={`mb-6 rounded-3xl overflow-hidden shadow-tot-large border-4 ${isCold ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'
            }`}>
            {/* Header Banner */}
            <div className={`p-4 flex items-center justify-between text-white ${isCold ? 'bg-blue-600' : 'bg-red-600'
                }`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-full animate-pulse">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-wide">
                            {data.message || 'Weather Emergency Active'}
                        </h2>
                        <p className="text-sm opacity-90">
                            Current Temp: {data.temperature}°F (Feels like {data.apparentTemperature}°F)
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-4">
                    <h3 className={`text-lg font-bold mb-2 ${isCold ? 'text-blue-800' : 'text-red-800'
                        }`}>
                        Emergency Shelter Plan Active
                    </h3>
                    <p className="text-tot-text-dark text-sm">
                        Due to extreme conditions, local shelters have activated {isCold ? 'White Flag' : 'Heat Relief'} protocols.
                        Additional beds are available, and amnesty rules may apply (pets/partners allowed at some locations).
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.shelters && data.shelters.map((shelter, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col shadow-sm">
                            <h4 className="font-bold text-tot-text-dark">{shelter.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{shelter.address}</p>
                            <div className="mt-auto space-y-1">
                                <div className={`text-xs font-semibold px-2 py-1 rounded w-fit ${isCold ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {shelter.hours}
                                </div>
                                <a
                                    href={`tel:${shelter.phone.replace(/\D/g, '')}`}
                                    className="flex items-center text-sm font-medium text-gray-600 hover:text-tot-teal"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {shelter.phone}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-between text-xs text-gray-400 border-t pt-2">
                    <span>Source: Open-Meteo & Coalition for the Homeless</span>
                    <span>Last Updated: {new Date(data.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
    );
}

export default WeatherEmergency;
