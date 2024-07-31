import React, { useEffect, useState } from "react";

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a delay to hide the loader after some time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      {loading ? (
        <div id="ftco-loader" className="show fullscreen">
          <svg className="circular" width="48px" height="48px">
            <circle
              className="path-bg"
              cx={24}
              cy={24}
              r={22}
              fill="none"
              strokeWidth={4}
              stroke="#eeeeee"
            />
            <circle
              className="path"
              cx={24}
              cy={24}
              r={22}
              fill="none"
              strokeWidth={4}
              strokeMiterlimit={10}
              stroke="#F96D00"
            />
          </svg>
        </div>
      ) : (
        <div className="content"> {/* Your main content here */} </div>
      )}
    </div>
  );
};

export default Loader;
