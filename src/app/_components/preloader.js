'use client'

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from '@gsap/react';

export default function UPreloader({ children }) {
    gsap.registerPlugin(useGSAP);

    const comp = useRef(null);
    const [showContent, setShowContent] = useState(false);

    useGSAP(() => {
        // Scroll to top
        window.scrollTo(0, 0);
        const t1 = gsap.timeline({
            paused: false
        });

        t1.from(["#logo"], {
            opacity: 100,
            duration: 0.1,
            onComplete: () => {
                document.getElementById("logo").style.opacity = "1";
            }
        }).to(["#title-1", "#title-2", "#title-3", "#title-4"], {
            opacity: 100,
            y: "+=30",
            stagger: 0.1,
            duration: 0.3,
        }).to("#intro-slider", {
            delay: 0.5,
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                setShowContent(true);
            }
        });
    }, {scope: comp});

    return (
        <main ref={comp} className="w-full h-[calc(100vh-120px)] dark bg-default-900 overflow-y-scroll overflow-x-hidden flex flex-col items-center">
            {/* Preloader */}
            <div id="intro-slider"
                 className="flex flex-col justify-center items-center h-screen p-5 fixed inset-0 w-full tracking-tight dark bg-black-paper bg-paper bg-repeat z-50"
                 style={{ display: showContent ? 'none' : 'flex' }}>
                <Image className="w-full flex justify-center items-center max-w-md" width="448" height="189" id="logo"
                       src={"/images/logo.svg"} alt={"UBound"} />
                <div className="flex flex-row gap-2 ml-6">
                    <h1 className="text-4xl opacity-0" id="title-1">TELL</h1>
                    <h1 className="text-4xl opacity-0" id="title-2">US</h1>
                    <h1 className="text-4xl opacity-0" id="title-3">YOUR</h1>
                    <h1 className="text-4xl opacity-0" id="title-4">STORY</h1>
                </div>
            </div>
            <div id="home-content"
                 className={`flex flex-col items-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
                {children}
            </div>
        </main>
    );
}