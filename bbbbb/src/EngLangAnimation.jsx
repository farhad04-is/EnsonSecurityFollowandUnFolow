// src/EngLangAnimation.js
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './style.module.css'; // Assuming you have a style.module.css file

const EngLangAnimation = ({ onAnimationComplete }) => {
  const animationContainerRef = useRef(null);
  const lettersRef = useRef([]);

  // This function is no longer needed here as App.js will handle showing MainContent
  // const showMainContent = () => { /* ... */ };

  const startEngLangAnimation = () => {
    const animationContainer = animationContainerRef.current;
    const letters = lettersRef.current;

    if (!animationContainer || letters.length === 0) return;

    // Clear any previous GSAP transforms/opacities
    gsap.set(letters, { clearProps: "transform,opacity" });
    gsap.set(animationContainer, { clearProps: "transform,opacity", display: 'flex', opacity: 1, x: "0%" });

    // Remove any Animate.css classes that might conflict or cause issues
    animationContainer.classList.remove('animate__animated', 'animate__fadeInDownBig', 'animate__lightSpeedOutRight');

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
      // We don't need repeat here if it's a one-time intro animation
      // repeat: -1,
      // repeatDelay: 2,
      onComplete: () => {
        console.log("EngLangAnimation GSAP timeline completed!"); // Debugging
        // Trigger the callback to notify the parent (App.js)
        onAnimationComplete();
      }
    });

    letters.forEach((letter, index) => {
      tl.fromTo(letter,
        {
          x: window.innerWidth / 2,
          opacity: 0,
          rotation: gsap.utils.random(30, 90)
        },
        {
          x: finalXPositions[index],
          opacity: 1,
          rotation: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: index * 0.1
        }, 0 // Start all fromTo tweens at the same time (position 0 in timeline)
      );
    });

    // Original timeline steps (re-evaluated for clarity and one-time play)
    tl.to(letters, {
      x: (i) => finalXPositions[i], // This seems redundant if already set in fromTo
      duration: 0.5,
      ease: "power2.out"
    }, "+=0.5");

    letters.forEach((letter, index) => {
      tl.to(letter, {
        y: -50,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      }, `+=0.1`); // Adjusted staggered start for yoyo part
    });

    tl.to(letters, {
      opacity: 0,
      x: window.innerWidth / 2, // Move off-screen to the right
      rotation: gsap.utils.random(0, 360),
      duration: 0.7,
      ease: "power1.in"
    }, "+=0.5"); // Starts 0.5s after previous sequence finishes

    // This section seems to re-animate letters that are already gone,
    // might need adjustment based on desired visual effect.
    // If you want a second phrase, consider adding another element or phrase.
    // For now, I'll assume this is part of the "EngLang" transition.
    tl.fromTo(letters,
      {
        x: -window.innerWidth / 2, // Start from left for new sequence
        y: -100,
        opacity: 0,
        rotation: gsap.utils.random(-90, 90)
      },
      {
        x: (i) => -window.innerWidth / 3 + (i * 10), // Example target position
        y: (i) => 50 + (i * 15),
        rotation: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.08
      }, "<0.2"); // Start this new sequence slightly before previous one ends

    // Final fade out of the entire container (e.g., after the second phrase animation)
    tl.to(animationContainer, {
      opacity: 0,
      duration: 0.8,
      ease: "power1.in",
      display: 'none' // Hide completely after fading out
    }, "+=1"); // Starts 1 second after the previous part.

    // No need to call tl.play() since paused: false is set.
  };

  useEffect(() => {
    // We remove all the setTimeout logic from here.
    // The GSAP timeline's onComplete handles when the animation is done.
    startEngLangAnimation();

    return () => {
      // Clean up GSAP animations on component unmount
      gsap.killTweensOf([lettersRef.current, animationContainerRef.current]);
    };
  }, [onAnimationComplete]); // Re-run effect if onAnimationComplete callback changes (rarely)

  // `restartAnimation` function is also not needed here since App.js handles the state.
  // If you need to replay the animation within EngLangAnimation,
  // this would require a different state management or prop from App.js.

  return (
    // We removed the mainContentRef and its div from EngLangAnimation
    // as App.js now handles rendering MainContent separately.
    <div ref={animationContainerRef} className={`${styles.animationContainer}`}>
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

export default EngLangAnimation;