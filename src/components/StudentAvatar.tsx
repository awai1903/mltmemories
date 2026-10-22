import React, { useState } from 'react';
import { Student } from '../data/students';

interface StudentAvatarProps {
  student: Student;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  student,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg',
    xl: 'w-32 h-32 md:w-40 md:h-40 text-2xl',
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[#C8A45D]/40 bg-[#0B1530] text-[#E7D39B] transition-transform duration-300 ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '0 0 15px rgba(200, 164, 93, 0.15)',
      }}
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-[#13234d] via-[#0B1530] to-[#070D1C] opacity-90 pointer-events-none" />

      {/* Attempt to load custom photo if available */}
      {!imageError && (
        <img
          src={student.photoUrl}
          alt={student.name}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100 z-10' : 'opacity-0'
          }`}
        />
      )}

      {/* Elegant Fallback Silhouette & Monogram Badge */}
      <div className="relative z-0 flex flex-col items-center justify-center text-center p-1 select-none">
        {/* Stylized MLT insignia / silhouette icon */}
        <svg
          className="w-1/2 h-1/2 mb-0.5 opacity-60 text-[#C8A45D]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className="font-semibold tracking-wider font-cinzel leading-none text-[#F5F0E5]">
          {student.initials}
        </span>
      </div>

      {/* Delicate inner rim glow */}
      <div className="absolute inset-0 rounded-full border border-[#C8A45D]/20 pointer-events-none" />
    </div>
  );
};
