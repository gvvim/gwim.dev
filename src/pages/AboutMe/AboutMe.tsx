import React from "react";
import GitHubCalendar from 'react-github-calendar';

import "./AboutMe.css";
import photo from '../../assets/profile.webp'
import githubIcon from '../../assets/icons/github.svg'
import linkedinIcon from '../../assets/icons/linkedin.svg'
import sketchfabIcon from '../../assets/icons/sketchfab.svg'
import emailIcon from '../../assets/icons/email.svg'
import downloadIcon from '../../assets/icons/download.svg'
import starIcon from '../../assets/icons/star.svg'

const AboutMe: React.FC = () => {
  return (
    <div className="clip-shadow">
    <div className="about-me clip bg">
        {/* <Background /> */}
        <div className="photo-wrapper">
            <img  className="photo" src={photo} />
            <img className="star" src={starIcon} />
        </div>
        <div className="about">
            <h2>Danijel Anđelković</h2>
            <div className="about-text">
                As an adaptable and professional person I always get along and cooperate well with others.
                <br/>
                I like to learn how applications really work and what it takes to optimize them.
                <br/>
                In my free time I develop games and create 3D models.
            </div>
            <div className="git-calendar"><GitHubCalendar username="gvvim" /></div>
            <div className="about-bottom">

                <div className="about-links">
                    <a target="_blank" href="https://github.com/gvvim">
                        <div className="link-popup">Github</div>
                        <img className="icon" src={githubIcon}></img>
                    </a>

                    <a target="_blank" href="https://www.linkedin.com/in/bitegw">
                        <div className="link-popup">Linkedin</div>
                        <img className="icon" src={linkedinIcon}></img>
                    </a>

                    <a target="_blank" href="https://sketchfab.com/gwim">
                        <div className="link-popup">Sketchfab</div>
                        <img className="icon" src={sketchfabIcon}></img>
                    </a>

                    <a target="_blank" href="mailto:adanijel99@gmail.com">
                        <div className="link-popup">Email me</div>
                        <img className="icon" src={emailIcon}></img>
                    </a>
                </div>

                <div className="download-btn">
                    <div className="link-popup">Press to download</div>
                    <p>Resume</p>
                    <img src={downloadIcon}></img>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
};

export default AboutMe;