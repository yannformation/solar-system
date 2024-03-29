import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useCallback } from "react";
import * as THREE from 'three'

const Moon = React.memo(() => {
    const moonRef = useRef()
    const clockRef = useRef(new THREE.Clock())//crée une référence pour le clock

const [moonTexture] = useTexture(['/assets/moonMap.jpg'])
const xAxis =4
const updateMoonPosition = useCallback(() => {
    //orbit rotation
    moonRef.current.position.x = Math.sin(clockRef.current.getElapsedTime() *0.8) * xAxis
    moonRef.current.position.z = Math.cos(clockRef.current.getElapsedTime() *0.8) * xAxis
    //Axis rotation
    moonRef.current.rotation.y += 0.002

}, [])

useFrame (() => {
    updateMoonPosition()
})

return(
    <mesh castShadow receiveShadow ref={moonRef} position={[xAxis, 0, 0]}>
        {/* Radius, X-axis, Y-axis */}
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshPhongMaterial 
        map={moonTexture} 
        emissiveMap={moonTexture} 
        emissive={0xffffff} 
        emissiveIntensity={0.05} />
    </mesh>
)
})

export default Moon