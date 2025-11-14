// import { useEffect, useState } from "react";
import "./ProjectPreview.css";
import githubIcon from '../../assets/icons/github.svg'
import youtubeIcon from '../../assets/icons/youtube.svg'
import demoIcon from '../../assets/icons/demo.svg'

interface ProjectPreviewProps {
    title?: string;
    imgUrl?: string;
    githubUrl?: string;
    youtubeUrl?: string;
    demoUrl?: string;
  }

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ title, imgUrl = "", githubUrl, youtubeUrl, demoUrl }) => {
  return (
    <div className="clip-shadow">
    <div className="project clip">
        <img src={imgUrl} />
        <div className="project-info">
            <h2>{title}</h2>
            <div className="project-links">
                {githubUrl && <a href={githubUrl} target="_blank" className="project-link">
                    <div className="link-popup">Source</div>
                    <img src={githubIcon} />
                </a>}
                {youtubeUrl && <a href={youtubeUrl} target="_blank" className="project-link">
                    <div className="link-popup">Demo</div>
                    <img src={youtubeIcon} />
                </a>}
                {demoUrl && <a href={demoUrl} target="_blank" className="project-link">
                    <div className="link-popup">Try it</div>
                    <img src={demoIcon} />
                </a>}
            </div>
        </div>
    </div>
    </div>
  );
}

export default ProjectPreview;