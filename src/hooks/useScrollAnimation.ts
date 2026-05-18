import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  animation?: 'fadeInUp' | 'fadeInRight' | 'fadeInLeft' | 'fadeIn' | 'scaleIn';
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  childSelector?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const {
      animation = 'fadeInUp',
      delay = 0,
      duration = 0.6,
      start = 'top 85%',
      childSelector,
    } = options;

    const targets = childSelector
      ? element.querySelectorAll(childSelector)
      : element;

    const animations: Record<string, gsap.TweenVars> = {
      fadeInUp: { opacity: 0, y: 30 },
      fadeInRight: { opacity: 0, x: 30 },
      fadeInLeft: { opacity: 0, x: -30 },
      fadeIn: { opacity: 0 },
      scaleIn: { opacity: 0, scale: 0.9 },
    };

    const fromVars = animations[animation];

    gsap.set(targets, fromVars);

    const tween = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      delay,
      stagger: childSelector ? (options.stagger || 0.1) : 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start,
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element) st.kill();
      });
    };
  }, [options.animation, options.delay, options.duration, options.start, options.stagger, options.childSelector]);

  return ref;
}
