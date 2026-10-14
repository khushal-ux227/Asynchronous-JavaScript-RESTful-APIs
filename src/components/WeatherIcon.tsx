import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Snowflake,
  CloudLightning,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  weatherCode: number;
  isDay?: number | boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  weatherCode,
  isDay = 1,
  className = 'w-6 h-6',
  ...props
}) => {
  const isDaytime = Boolean(isDay);

  // WMO Code mapping
  switch (weatherCode) {
    case 0:
      return isDaytime ? (
        <Sun className={`text-amber-400 ${className}`} {...props} />
      ) : (
        <Moon className={`text-indigo-200 ${className}`} {...props} />
      );

    case 1:
      return isDaytime ? (
        <SunMedium className={`text-amber-400 ${className}`} {...props} />
      ) : (
        <Moon className={`text-indigo-200 ${className}`} {...props} />
      );

    case 2:
      return isDaytime ? (
        <CloudSun className={`text-sky-400 ${className}`} {...props} />
      ) : (
        <CloudMoon className={`text-indigo-300 ${className}`} {...props} />
      );

    case 3:
      return <Cloud className={`text-slate-400 ${className}`} {...props} />;

    case 45:
    case 48:
      return <CloudFog className={`text-slate-300 ${className}`} {...props} />;

    case 51:
    case 53:
    case 55:
      return <CloudDrizzle className={`text-sky-400 ${className}`} {...props} />;

    case 61:
    case 63:
    case 80:
    case 81:
      return <CloudRain className={`text-blue-400 ${className}`} {...props} />;

    case 65:
    case 82:
      return <CloudRainWind className={`text-blue-500 ${className}`} {...props} />;

    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return <Snowflake className={`text-sky-200 ${className}`} {...props} />;

    case 95:
    case 96:
    case 99:
      return <CloudLightning className={`text-purple-400 ${className}`} {...props} />;

    default:
      return isDaytime ? (
        <CloudSun className={`text-sky-400 ${className}`} {...props} />
      ) : (
        <CloudMoon className={`text-indigo-300 ${className}`} {...props} />
      );
  }
};
