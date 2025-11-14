import { useState, useEffect, useRef, lazy } from "react";

import "./App.css";
import DateTimeLabel from "./components/DateTimeLabel/DateTimeLabel";
import Carousel from "./components/Carousel/Carousel";
import ProjectPreview from "./components/ProjectPreview/ProjectPreview";
import HireMe from "./pages/HireMe/HireMe";
import AboutMe from "./pages/AboutMe/AboutMe";
import Quote from "./components/Quote/Quote";
import decoratorUrl from "./assets/decorator.svg";
import avatarUrl from "./assets/avatar.svg";
import Skills from "./pages/Skills/Skills";
import { useGLTF } from "@react-three/drei";

// If we didn't lazy load the 3D elements, initial load time would go from <700ms to 3s!
const LazyBackground3D = lazy(() => import("./components/Background3D"));
const LazyModelPreview = lazy(() => import("./components/ModelPreview/ModelPreview"));

function App() {
  const [page, setPage] = useState(0);

  const maxPage = 6;

  useEffect(() => {
    useGLTF.preload("/models/knight.glb");
  }, []);

  // Separate subPage and subPageCount for each carousel page
  const [carouselState, setCarouselState] = useState<{
    [key: number]: { subPage: number; subPageCount: number };
  }>({
    2: { subPage: 0, subPageCount: 0 },
    3: { subPage: 0, subPageCount: 0 },
    4: { subPage: 0, subPageCount: 0 },
  });

  const pageRef = useRef(page);
  const carouselRef = useRef(carouselState);

  useEffect(() => { pageRef.current = page; }, [page]);
  useEffect(() => { carouselRef.current = carouselState; }, [carouselState]);

  useEffect(() => {
    let isThrottled = false;

    const handleWheel = (event: WheelEvent) => {
      if (isThrottled) return;
      isThrottled = true;
      setTimeout(() => (isThrottled = false), 100);
    
      const currentPage = pageRef.current;
    
      // If this page has a carousel
      if (carouselRef.current[currentPage]) {
        const { subPage, subPageCount } = carouselRef.current[currentPage];
    
        if (event.deltaY > 0) {
          // SCROLL DOWN
          if (subPage < subPageCount - 1) {
            // advance subpage
            setCarouselState((prev) => ({
              ...prev,
              [currentPage]: { ...prev[currentPage], subPage: subPage + 1 },
            }));
          } else {
            // reached end of subpages -> move to next main page and reset that page's subPage
            const nextPage = Math.min(currentPage + 1, maxPage);
    
            // reset subpage for nextPage (only affects nextPage entry)
            setCarouselState((prev) => ({
              ...prev,
              [nextPage]: {
                // preserve any other fields for that page, but force subPage to 0
                ...(prev[nextPage] ?? {}),
                subPage: 0,
              },
            }));
    
            setPage(nextPage);
          }
        } else if (event.deltaY < 0) {
          // SCROLL UP
          if (subPage > 0) {
            setCarouselState((prev) => ({
              ...prev,
              [currentPage]: { ...prev[currentPage], subPage: subPage - 1 },
            }));
          } else {
            // go to previous main page (no reset required)
            const prevPage = Math.max(currentPage - 1, 0);
            setPage(prevPage);
          }
        }
      } else {
        // Non-carousel page: normal page navigation
        if (event.deltaY > 0) {
          const nextPage = Math.min(currentPage + 1, maxPage);
    
          // Reset subpage on the destination page in case it has a carousel
          setCarouselState((prev) => ({
            ...prev,
            [nextPage]: {
              ...(prev[nextPage] ?? {}),
              subPage: 0,
            },
          }));
    
          setPage(nextPage);
        } else if (event.deltaY < 0) {
          setPage(Math.max(currentPage - 1, 0));
        }
      }
    };    

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [maxPage]);

  const updateCarousel = (pageNum: number, subPage: number) => {
    setCarouselState((prev) => ({
      ...prev,
      [pageNum]: { ...prev[pageNum], subPage },
    }));
  };

  const updateCarouselCount = (pageNum: number, count: number) => {
    setCarouselState((prev) => ({
      ...prev,
      [pageNum]: { ...prev[pageNum], subPageCount: count },
    }));
  };

  return (
    <>
      <LazyBackground3D page={page}/>
      <div className="sidebar">

        <div className="sidebar-top">
          <div className="clip-shadow">
            <img className="sidebar-top-avatar clip" src={avatarUrl} />
          </div>
          <div>
            <p>Danijel<br />Anđelković</p>
            <p>@gwim.dev</p>
          </div>
        </div>

        <div className="nav">
          <div className="nav-line">
            {[...Array(maxPage + 1)].map((_, i) => (
              <div
                key={i}
                className="nav-point"
                data-selected={page === i ? "true" : undefined}
              />
            ))}
          </div>
          <div className="nav-list">
            {["Home", "About me", "Technical art", "UI & Web", "Models", "Skills", "Hire me"].map(
              (label, i) => (
                <button
                  key={i}
                  className="nav-btn clip"
                  onClick={() => setPage(i)}
                  data-selected={page === i ? "true" : undefined}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="page" data-selected={page === 0 ? "true" : undefined}>
          <Quote />
          <div className="scroll-reminder">➤➤</div>
        </div>

        <div className="page" data-selected={page === 1 ? "true" : undefined}>
          <div className="page-title">
            <h1>About me</h1>
            <img src={decoratorUrl} />
          </div>
          <AboutMe />
        </div>

        <div className="page" data-selected={page === 2 ? "true" : undefined}>
          <div className="page-title">
            <h1>Technical art</h1>
            <img src={decoratorUrl} />
          </div>
          <Carousel
            currentIndex={carouselState[2].subPage}
            onIndexChange={(i) => updateCarousel(2, i)}
            autoPlay={false}
            onInit={(count) => updateCarouselCount(2, count)}
          >
            <ProjectPreview 
              title="Raytracing using Compute Shaders (Godot)" 
              imgUrl="https://github.com/gvvim/Godot4-Raytracing/raw/main/Screenshots/Screenshot%202023-08-10_Cornell.png"
              githubUrl="https://github.com/gvvim/Godot4-Raytracing"
            />
            <ProjectPreview 
              title="Smooth shading for marching cubes (Unity)" 
              imgUrl="https://camo.githubusercontent.com/cc3d975b42f77911552ed92e54a18a3a5ea9d2862d0a23f23d29a6ba353dc5e9/68747470733a2f2f692e696d6775722e636f6d2f707a4e566f45462e706e67"
              githubUrl="https://github.com/gvvim/Procedural-Terrain" 
            />
            <ProjectPreview 
              title="Rust and Ruin Status Effect System (Godot)" 
              imgUrl="/projects/rar_status.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=E8hLK4xq54o"
            />
            <ProjectPreview 
              title="R&R Player Customization / Codex (Godot)" 
              imgUrl="/projects/rar_codex.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=kg3xfEGTqac"
            />
            <ProjectPreview 
              title="R&R Biomes (Godot)" 
              imgUrl="/projects/rar_biomes.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=EMts0G4KKiA"
            />
            <ProjectPreview 
              title="R&R Active Ability VFX (Godot)" 
              imgUrl="/projects/rar_abilities.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=bicOy6Yxu9U"
            />
            <ProjectPreview 
              title="Platforming Mechanics (Godot)"
              imgUrl="/projects/platformer.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=L07R3wHSnXs"
            />
            <ProjectPreview 
              title="Procedural Animation System (Godot)"
              imgUrl="/projects/platformer_2.jpg"
              youtubeUrl="https://www.youtube.com/watch?v=RVDLgLMg498"
            />
          </Carousel>
        </div>

        <div className="page" data-selected={page === 3 ? "true" : undefined}>
          <div className="page-title">
            <h1>UI and Web</h1>
            <img src={decoratorUrl} />
          </div>
          <Carousel
            currentIndex={carouselState[3].subPage}
            onIndexChange={(i) => updateCarousel(3, i)}
            autoPlay={false}
            onInit={(count) => updateCarouselCount(3, count)}
          >
            <ProjectPreview 
              title="Gwim.dev (React/Three)"
              imgUrl="/projects/gwim_dev.jpg"
              githubUrl="https://github.com/gvvim/gwim.dev"
              demoUrl="https://gwim.dev/"
            />
            <ProjectPreview 
              title="Bite Gameworks website (Typescript/Vite/Gulp)"
              imgUrl="/projects/bite_gameworks_website.png"
              githubUrl="https://github.com/gvvim/bitegameworks"
              demoUrl="https://bitegameworks.net/"
            />
            <ProjectPreview 
              title="Rust and Ruin HUD (Godot)" 
              imgUrl="/projects/rar_hud.png"
              youtubeUrl="https://www.youtube.com/watch?v=5yKrbmaSkW4"
            />
            <ProjectPreview 
              title="Neural Net Playground (Angular/.NET/Pytorch)" 
              imgUrl="/projects/neural_net_playground.png"
              githubUrl="https://github.com/gvvim/neural-net-playground" 
              youtubeUrl="https://www.youtube.com/watch?v=heXn0A4PYLg"
            />
            <ProjectPreview 
              title="Fly Away game (PixiJS/GSAP)" 
              imgUrl="/projects/fly_away.jpg"
              demoUrl="https://www.youtube.com/watch?v=ge1O2jVy1YQ/"
            />
            <ProjectPreview 
              title="Obsidian.md Pomodoro widget (Typescript)" 
              imgUrl="https://github.com/gvvim/obsidian-pomodoro-widget/raw/main/doc/theme_examples.png" 
              githubUrl="https://github.com/gvvim/obsidian-pomodoro-widget"
            />
            <ProjectPreview 
              title="Island survival game (Javascript/Canvas)" 
              imgUrl="/projects/island_survival.png"
              githubUrl="https://github.com/gvvim/web-survival-game"
              demoUrl="https://gvvim.github.io/web-survival-game/"
            />
          </Carousel>
        </div>

        <div className="page" data-selected={page === 4 ? "true" : undefined}>
          <div className="page-title">
            <h1>3D Models</h1>
            <img src={decoratorUrl} />
          </div>
            <Carousel
              currentIndex={carouselState[4].subPage}
              onIndexChange={(i) => updateCarousel(4, i)}
              autoPlay={false}
              onInit={(count) => updateCarouselCount(4, count)}
            >
              <LazyModelPreview url="/models/knight_preview.glb" fallbackUrl="/fallback/model_0_capture.webp" sketchfabUrl="https://skfb.ly/pDvpq" useAlpha/>
              <LazyModelPreview url="/models/ryn.glb" fallbackUrl="/fallback/model_1_capture.webp" sketchfabUrl="https://skfb.ly/pDuVO" />
              <LazyModelPreview url="/models/stalker.glb" fallbackUrl="/fallback/model_2_capture.webp" sketchfabUrl="https://skfb.ly/pDuU8" />
              <LazyModelPreview url="/models/grunt.glb" fallbackUrl="/fallback/model_3_capture.webp" sketchfabUrl="https://skfb.ly/pDuTH" />
              <LazyModelPreview url="/models/scrapper.glb" fallbackUrl="/fallback/model_4_capture.webp" sketchfabUrl="https://skfb.ly/pDuSQ" />
              <LazyModelPreview url="/models/sniper.glb" fallbackUrl="/fallback/model_5_capture.webp" sketchfabUrl="https://skfb.ly/pDuUF" />
              <LazyModelPreview url="/models/drone.glb" fallbackUrl="/fallback/model_6_capture.webp" sketchfabUrl="https://skfb.ly/pDuTy" />
              <LazyModelPreview url="/models/buffer.glb" fallbackUrl="/fallback/model_7_capture.webp" sketchfabUrl="https://skfb.ly/pDuSI" />
              <LazyModelPreview url="/models/barrager.glb" fallbackUrl="/fallback/model_8_capture.webp" sketchfabUrl="https://skfb.ly/pDuRY" />
              <LazyModelPreview url="/models/exploder.glb" fallbackUrl="/fallback/model_9_capture.webp" sketchfabUrl="https://skfb.ly/pDuSy" />
            </Carousel>
        </div>

        <div className="page" data-selected={page === 5 ? "true" : undefined}>
          <div className="page-title">
            <h1>My skills</h1>
            <img src={decoratorUrl} />
          </div>
          <Skills />
        </div>

        <div className="page" data-selected={page === 6 ? "true" : undefined}>
          <div className="page-title">
            <h1>Hire me</h1>
            <img src={decoratorUrl} />
          </div>
          <HireMe autoRotate={page === 6}/>
        </div>
      </div>

      <DateTimeLabel />
    </>
  );
}

export default App;
