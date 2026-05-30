import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  Wind, 
  CloudSun 
} from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function WeatherIcon({ 
  condition, 
  size = 48, 
  strokeWidth = 2.5, 
  className = "" 
}: WeatherIconProps) {
  const normCondition = condition.toLowerCase().trim();

  switch (normCondition) {
    case 'sunny':
    case 'clear':
      return <Sun size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
    
    case 'cloudy':
    case 'overcast':
    case 'misty':
    case 'foggy':
      return <Cloud size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    case 'sunny-intervals':
    case 'partly-cloudy':
    case 'partlycloudy':
      return <CloudSun size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    case 'rainy':
    case 'drizzle':
    case 'showers':
      return <CloudRain size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    case 'stormy':
    case 'thunderstorm':
      return <CloudLightning size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    case 'snowy':
    case 'sleet':
      return <Snowflake size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    case 'windy':
    case 'breezy':
      return <Wind size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
      
    default:
      // Fallback to sun/cloud mix or general cloud
      return <CloudSun size={size} strokeWidth={strokeWidth} className={`text-current ${className}`} />;
  }
}
