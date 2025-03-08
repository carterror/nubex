import { Cloud } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export default function Logo({ size = 'md', variant = 'default' }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Cloud
        className={`${
          variant === 'default' ? 'text-blue-600' : 'text-white'
        } h-6 w-6`}
        strokeWidth={2.5}
      />
      <span
        className={`font-bold tracking-wider ${sizes[size]} ${
          variant === 'default' ? 'text-gray-900' : 'text-white'
        }`}
      >
        NUBEX
      </span>
    </div>
  );
}