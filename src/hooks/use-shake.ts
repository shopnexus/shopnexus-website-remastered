import { useCallback, useRef } from 'react';

interface UseShakeOptions {
  duration?: number; // Thời gian rung lắc (ms)
  intensity?: number; // Cường độ rung lắc (px)
  frequency?: number; // Tần số rung lắc
  easing?: string; // Easing function
}

interface UseShakeReturn {
  shake: (element?: HTMLElement | null) => void;
  shakeRef: React.RefObject<HTMLElement | null>;
}

export const useShake = (options: UseShakeOptions = {}): UseShakeReturn => {
  const {
    duration = 500,
    intensity = 10,
    frequency = 20,
    easing = 'ease-in-out'
  } = options;

  const shakeRef = useRef<HTMLElement>(null);
  const animationRef = useRef<Animation | null>(null);

  const shake = useCallback((element?: HTMLElement | null) => {
    const targetElement = element || shakeRef.current;
    
    if (!targetElement) return;

    // Dừng animation hiện tại nếu có
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    // Tạo keyframes cho hiệu ứng rung lắc
    const keyframes = [
      { transform: 'translateX(0)' },
      { transform: `translateX(-${intensity}px)` },
      { transform: `translateX(${intensity}px)` },
      { transform: `translateX(-${intensity / 2}px)` },
      { transform: `translateX(${intensity / 2}px)` },
      { transform: `translateX(-${intensity / 4}px)` },
      { transform: `translateX(${intensity / 4}px)` },
      { transform: 'translateX(0)' }
    ];

    // Tạo timing options
    const timing: KeyframeAnimationOptions = {
      duration,
      easing,
      iterations: 1,
      fill: 'forwards'
    };

    // Tạo và chạy animation
    animationRef.current = targetElement.animate(keyframes, timing);

    // Cleanup khi animation kết thúc
    animationRef.current.onfinish = () => {
      animationRef.current = null;
    };
  }, [duration, intensity, easing]);

  return {
    shake,
    shakeRef
  };
};

// Hook đơn giản hơn với preset
export const useSimpleShake = (): UseShakeReturn => {
  return useShake({
    duration: 400,
    intensity: 8,
    easing: 'ease-in-out'
  });
};

// Hook cho hiệu ứng rung lắc mạnh
export const useStrongShake = (): UseShakeReturn => {
  return useShake({
    duration: 600,
    intensity: 15,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  });
};

// Hook cho hiệu ứng rung lắc nhẹ
export const useGentleShake = (): UseShakeReturn => {
  return useShake({
    duration: 300,
    intensity: 5,
    easing: 'ease-out'
  });
};
