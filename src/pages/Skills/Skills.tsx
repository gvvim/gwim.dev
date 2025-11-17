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
    <div className="skills">
      <Orbit radius={350} duration={80} squash={0.5} depthScale={0.6}>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={reactIcon}/><p>React</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={angularIcon}/><p>Angular</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={typescriptIcon}/><p>Typescript</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={csharpIcon}/><p>C#</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={javaIcon}/><p>Java</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={pythonIcon}/><p>Python</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={gitIcon}/><p>Git</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={unityIcon}/><p>Unity</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={godotIcon}/><p>Godot</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={blenderIcon}/><p>Blender</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={figmaIcon}/><p>Figma</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={photoshopIcon}/><p>Photoshop</p></div></div>
          <div className="skill-shadow"><div className="skill"><img className="skill-icon" src={audacityIcon}/><p>Audacity</p></div></div>
      </Orbit>
    </div>
  );
};

export default Skills;