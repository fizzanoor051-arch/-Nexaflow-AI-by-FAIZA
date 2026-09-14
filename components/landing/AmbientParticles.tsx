"use client";

type Particle = {
  left: number;
  top: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  glow: number;
};

const particles: Particle[] = [
  {
    left: 18.0861,
    top: 45.4908,
    size: 3.53095,
    opacity: 0.626813,
    duration: 19.0679,
    delay: -13.9152,
    driftX: -29.7431,
    driftY: -65.5666,
    glow: 11.0729,
  },
  {
    left: 62.8271,
    top: 11.3203,
    size: 1.84807,
    opacity: 0.51197,
    duration: 13.6387,
    delay: -16.7444,
    driftX: 79.6611,
    driftY: 17.6093,
    glow: 13.7098,
  },
  {
    left: 20.2246,
    top: 58.9605,
    size: 2.058,
    opacity: 0.442651,
    duration: 20.332,
    delay: -11.088,
    driftX: -59.1424,
    driftY: -52.3718,
    glow: 16.9544,
  },
  {
    left: 70.4683,
    top: 50.9918,
    size: 4.87116,
    opacity: 0.582195,
    duration: 10.4248,
    delay: -15.9287,
    driftX: 72.9875,
    driftY: -36.8494,
    glow: 7.5661,
  },
  {
    left: 75.0671,
    top: 4.84433,
    size: 3.31252,
    opacity: 0.21822,
    duration: 12.7764,
    delay: -10.1914,
    driftX: -53.463,
    driftY: 56.3371,
    glow: 10.0135,
  },
  {
    left: 29.0831,
    top: 54.2051,
    size: 4.47132,
    opacity: 0.586308,
    duration: 20.973,
    delay: -10.8767,
    driftX: -49.3978,
    driftY: -58.6674,
    glow: 16.6184,
  },
  {
    left: 81.8643,
    top: 20.5338,
    size: 4.99756,
    opacity: 0.677767,
    duration: 16.2474,
    delay: -17.8216,
    driftX: 74.0553,
    driftY: -34.9784,
    glow: 10.5501,
  },
  {
    left: 60.9448,
    top: 6.90479,
    size: 4.08035,
    opacity: 0.729967,
    duration: 21.6885,
    delay: -2.94544,
    driftX: 70.6051,
    driftY: 40.4825,
    glow: 16.9916,
  },
  {
    left: 18.3301,
    top: 76.7632,
    size: 2.22933,
    opacity: 0.630324,
    duration: 18.7042,
    delay: -13.541,
    driftX: -60.396,
    driftY: -51.3639,
    glow: 15.5695,
  },
  {
    left: 67.169,
    top: 32.6672,
    size: 4.93198,
    opacity: 0.212166,
    duration: 21.8692,
    delay: -12.9693,
    driftX: -75.0389,
    driftY: 33.0746,
    glow: 16.0822,
  },
  {
    left: 86.0231,
    top: 16.5093,
    size: 4.94802,
    opacity: 0.721867,
    duration: 11.334,
    delay: -11.7415,
    driftX: -75.6802,
    driftY: -31.7157,
    glow: 11.7431,
  },
  {
    left: 42.0798,
    top: 31.2913,
    size: 4.19487,
    opacity: 0.669754,
    duration: 21.9999,
    delay: -6.20988,
    driftX: 45.778,
    driftY: -60.4434,
    glow: 16.1933,
  },

  // Additional fixed particles
  {
    left: 8,
    top: 18,
    size: 2.2,
    opacity: 0.42,
    duration: 14,
    delay: -3,
    driftX: 38,
    driftY: 22,
    glow: 9,
  },
  {
    left: 34,
    top: 12,
    size: 1.8,
    opacity: 0.32,
    duration: 17,
    delay: -8,
    driftX: -32,
    driftY: 30,
    glow: 8,
  },
  {
    left: 48,
    top: 22,
    size: 2.7,
    opacity: 0.5,
    duration: 15,
    delay: -5,
    driftX: 42,
    driftY: -28,
    glow: 11,
  },
  {
    left: 92,
    top: 34,
    size: 2,
    opacity: 0.38,
    duration: 18,
    delay: -11,
    driftX: -36,
    driftY: 26,
    glow: 9,
  },
  {
    left: 12,
    top: 62,
    size: 3,
    opacity: 0.46,
    duration: 16,
    delay: -7,
    driftX: 30,
    driftY: -34,
    glow: 12,
  },
  {
    left: 52,
    top: 68,
    size: 2.1,
    opacity: 0.35,
    duration: 19,
    delay: -14,
    driftX: -44,
    driftY: -25,
    glow: 9,
  },
  {
    left: 76,
    top: 78,
    size: 2.5,
    opacity: 0.48,
    duration: 13,
    delay: -4,
    driftX: 34,
    driftY: 31,
    glow: 10,
  },
  {
    left: 94,
    top: 88,
    size: 1.7,
    opacity: 0.3,
    duration: 20,
    delay: -9,
    driftX: -28,
    driftY: -36,
    glow: 8,
  },
  {
    left: 25,
    top: 91,
    size: 2.8,
    opacity: 0.44,
    duration: 16,
    delay: -12,
    driftX: 40,
    driftY: -20,
    glow: 10,
  },
  {
    left: 58,
    top: 94,
    size: 2,
    opacity: 0.34,
    duration: 18,
    delay: -6,
    driftX: -35,
    driftY: 28,
    glow: 8,
  },
];

export default function AmbientParticles() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {particles.map((particle, index) => (
        <span
          key={index}
          className="nexa-particle absolute rounded-full bg-amber-300"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.glow}px rgba(252, 211, 77, 0.75)`,
            animation: `nexaParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            ["--particle-x" as string]: `${particle.driftX}px`,
            ["--particle-y" as string]: `${particle.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}