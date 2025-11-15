import React, { useEffect, useRef, useState } from "react";
import Globe from 'react-globe.gl';
import "./HireMe.css";
import earthDayTexture from '../../assets/2k_earth_day.webp'
import earthNightTexture from '../../assets/2k_earth_night.webp'
import earthBumpTexture from '../../assets/earthbump1k.webp'

interface HireMeProps {
  autoRotate?: boolean;
}

const HireMe: React.FC<HireMeProps> = ({ autoRotate = false }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;

  const globeRef = useRef<any>(null);

  const markers = [
    { lat: 44.01667, lng: 20.91667, name: "Kragujevac" },
    // { lat: 40.7128, lng: -74.006, name: "New York" },
    // { lat: 51.5074, lng: -0.1278, name: "London" },
    // { lat: 35.6895, lng: 139.6917, name: "Tokyo" },
  ];

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = autoRotate; // start paused
    controls.autoRotateSpeed = 0.8;
    controls.enableZoom = false;

    return;
  }, [autoRotate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !message) {
      setStatus("error");
      return;
    }

    const subject = encodeURIComponent(`Contact from gwim.dev visitor`);
    const body = encodeURIComponent(`Email: ${email}\n\n${message}`);
    const mailtoLink = `mailto:your@email.com?subject=${subject}&body=${body}`;

    window.location.href = mailtoLink;
    setStatus("success");

    setEmail("");
    setMessage("");
  };

  return (
    <div className="clip-shadow">
    <div className="hire-me clip bg">
        <form className="contact-form" onSubmit={handleSubmit}>
        <h2>Get in Touch</h2>
        {status === "error" && <p className="contact-error">Please fill in all fields.</p>}
        {status === "success" && <p className="contact-success">Opening your email client…</p>}
        <label htmlFor="email">Email</label>
        <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <label htmlFor="message">Message</label>
        <textarea
            placeholder="Your message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
        />
        <button type="submit">Send Message</button>
        </form>
        <div className="hire-me-about">
        <h2>Based in Serbia, Available Worldwide</h2>
        <p>Currently available on location in Kragujevac, but whether you're in Berlin, New York, or Belgrade, I'm ready to collaborate remotely and bring your ideas to life. Let's build something great together.</p>
        
        <div className="globe">
          <Globe
            ref={globeRef}
            globeImageUrl={isDay ? earthDayTexture : earthNightTexture}
            bumpImageUrl={earthBumpTexture}
            showAtmosphere={true}
            atmosphereColor="white"
            atmosphereAltitude={0.25}
            width={320}
            height={320}
            backgroundColor="#00000000"
            pointsData={markers}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.2}
            pointRadius={0.5}
            pointColor={() => "white"}
          />
          </div>
        </div>
    </div>
    </div>
  );
};

export default HireMe;