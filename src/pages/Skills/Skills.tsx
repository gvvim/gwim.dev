import React from "react";
import "./Skills.css";
import Orbit from "../../components/Orbit/Orbit";
import gitIcon from '../../assets/icons/git.svg'
import reactIcon from "../../assets/icons/react.svg";
import angularIcon from "../../assets/icons/angular.svg";
import typescriptIcon from "../../assets/icons/typescript.svg";
import csharpIcon from "../../assets/icons/csharp.svg";
import javaIcon from "../../assets/icons/java.svg";
import pythonIcon from "../../assets/icons/python.svg";
import unityIcon from "../../assets/icons/unity.svg";
import godotIcon from "../../assets/icons/godot.svg";
import blenderIcon from "../../assets/icons/blender.svg";
import figmaIcon from "../../assets/icons/figma.svg";
import photoshopIcon from "../../assets/icons/photoshop.svg";
import audacityIcon from "../../assets/icons/audacity.svg";

const Skills: React.FC = () => {
  return (
    <Orbit radius={450} duration={80} squash={0.5} depthScale={0.6}>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={reactIcon}/>React</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={angularIcon}/>Angular</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={typescriptIcon}/>Typescript</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={csharpIcon}/>C#</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={javaIcon}/>Java</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={pythonIcon}/>Python</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={gitIcon}/>Git</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={unityIcon}/>Unity</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={godotIcon}/>Godot</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={blenderIcon}/>Blender</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={figmaIcon}/>Figma</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={photoshopIcon}/>Photoshop</div></div>
        <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={audacityIcon}/>Audacity</div></div>
    </Orbit>
  );
};

export default Skills;