import {  useHelper } from "@react-three/drei";
import { useRef } from "react";
import AnimatedStars from "./AnimatedStars";
import { Perf } from'r3f-perf';
import * as THREE from 'three';

import CameraPositionLogging from "./helpers/CameraPositionLogging";

import Earth from './scenes/earth/Earth';
import Sun from "./scenes/sun/Sun";

const MainContainer = () => {
    const directionalLightRef = useRef()
    const directionalLightRefTwo = useRef()
    useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, 'hotpink')
    useHelper(directionalLightRefTwo, THREE.DirectionalLightHelper, 1, 'hotpink')
    return(
    <>
        <Perf />
        <CameraPositionLogging event="mousedown" />
        
        <AnimatedStars />
        {/* <directionalLight
         ref={directionalLightRef}
         position={[0,0,10]}
         intensity={1}
        //  color={0x61dbfb}
         />
        <directionalLight ref={directionalLightRefTwo} position={[0,0,-10]} /> */}
        <ambientLight intensity={0.3} />
        <Sun />
        <Earth displacementScale={0.008} />
        
    </>
    )
    
}

export default MainContainer;