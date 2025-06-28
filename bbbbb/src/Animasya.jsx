// src/EngLangAnimation.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './style.module.css'; // Assuming you have a style.module.css file

// Renamed from EngLangAnimation to Animasya
const Animasya = ({ onAnimationComplete }) => {
  const animationContainerRef = useRef(null);
  const lettersRef = useRef([]);

  const startEngLangAnimation = () => {
    const animationContainer = animationContainerRef.current;
    const letters = lettersRef.current;

    if (!animationContainer || letters.length === 0) {
      console.warn("Animation container or letters not found. Skipping animation.");
      onAnimationComplete(); // Ensure callback is still called if animation can't start
      return;
    }

    // Clear any previous GSAP transforms/opacities to ensure a clean slate
    gsap.set(letters, { clearProps: "transform,opacity" });
    gsap.set(animationContainer, {
      clearProps: "transform,opacity",
      display: 'flex', // Ensure container is visible initially
      opacity: 1,
      x: "0%"
    });

    // Remove any Animate.css classes that might conflict (good practice)
    animationContainer.classList.remove('animate__animated', 'animate__fadeInDownBig', 'animate__lightSpeedOutRight');

    // Calculate final X positions for "EngLang" to be centered
    const calculateFinalXPositions = () => {
      let totalWidth = 0;
      letters.forEach(letter => {
        if (letter) totalWidth += letter.offsetWidth;
      });

      let currentXOffset = -totalWidth / 2;
      const positions = [];
      letters.forEach(letter => {
        if (letter) {
          positions.push(currentXOffset);
          currentXOffset += letter.offsetWidth;
        }
      });
      return positions;
    };

    const finalXPositions = calculateFinalXPositions();

    const tl = gsap.timeline({
      paused: false, // Ensure it plays immediately
      onComplete: () => {
        console.log("Animasya GSAP timeline completed!"); // Updated console log
        // Trigger the callback to notify the parent (App.js) that the animation is done
        onAnimationComplete();
      }
    });

    // --- Animation Sequence ---

    // 1. Letters fly in and assemble "EngLang"
    letters.forEach((letter, index) => {
      tl.fromTo(letter,
        {
          x: window.innerWidth / 2, // Start from right side of the screen
          opacity: 0,
          rotation: gsap.utils.random(30, 90) // Random initial rotation
        },
        {
          x: finalXPositions[index], // Move to calculated final centered position
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: index * 0.08 // Staggered entry for each letter
        }, 0 // Start all letters' entry animations at the beginning of the timeline
      );
    });

    // 2. Short "bounce" effect for the assembled "EngLang"
    tl.to(letters, {
      y: -20, // Move up slightly
      duration: 0.2,
      ease: "power2.out",
      yoyo: true, // Go back to original position
      repeat: 1, // Play once (up and down)
      stagger: 0.05 // Slightly staggered bounce
    }, "+=0.3"); // Start this after a short delay from the assembly

    // 3. "EngLang" disperses and moves off-screen to the right
    tl.to(letters, {
      opacity: 0,
      x: window.innerWidth / 2, // Move off-screen to the right
      rotation: gsap.utils.random(0, 360), // Random rotation as it leaves
      duration: 0.7,
      ease: "power1.in"
    }, "+=0.5"); // Starts 0.5s after the bounce finishes

    // 4. (Optional) A second "phrase" or re-entry of letters from the left
    tl.fromTo(letters,
      {
        x: -window.innerWidth / 2, // Start from left side of the screen
        y: -100, // Slightly above center
        opacity: 0,
        rotation: gsap.utils.random(-90, 90)
      },
      {
        x: (i) => -window.innerWidth / 4 + (i * 15), // Example target: slightly left of center, spread out
        y: (i) => 30 + (i * 10), // Example target: varied y positions
        rotation: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08
      }, "<0.2"); // Start this new sequence slightly before the previous one ends, creating overlap

    // 5. Final fade out and hide of the entire animation container
    tl.to(animationContainer, {
      opacity: 0,
      duration: 0.8,
      ease: "power1.in",
      display: 'none' // Hide completely after fading out
    }, "+=1"); // Starts 1 second after the previous part finishes
  };

  useEffect(() => {
    startEngLangAnimation();

    return () => {
      gsap.killTweensOf([lettersRef.current, animationContainerRef.current]);
    };
  }, [onAnimationComplete]);

  return (
    <div ref={animationContainerRef} className={styles.animationContainer}>
      {'EngLang'.split('').map((letter, index) => (
        <span
          key={index}
          ref={el => (lettersRef.current[index] = el)}
          className={styles.letter}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

// Renamed from EngLangAnimation to Animasya
export default Animasya;