import React, { useState, useEffect } from 'react';

function ScrollTop() {
  const [isVisible, setIsVisible] = useState(true);

  // const toggleVisibility = () => {
  //   if (true) {
  //     setIsVisible(true);
  //   } else {
  //     setIsVisible(false);
  //   }
  // };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // useEffect(() => {
  //   window.addEventListener('scroll', toggleVisibility);
  //   return () => {
  //     window.removeEventListener('scroll', toggleVisibility);
  //   };
  // }, []);

  return (
    <>
      <a
        href="#"
        id="scroll-top"
        className={`scroll-top d-flex align-items-center justify-content-center ${isVisible ? 'active' : ''}`}
        onClick={scrollToTop}
      >
        <i className="bi bi-arrow-up-short" />
      </a>
    </>
  );
}

export default ScrollTop;
