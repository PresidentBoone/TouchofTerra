import { useEffect, useState } from 'react';

function StarsBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate random stars
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        size: Math.random() * 2 + 1 + 'px',
        animationDelay: Math.random() * 4 + 's',
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="stars">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
}

export default StarsBackground;
