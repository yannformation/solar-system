import {  useGLTF } from "@react-three/drei"
import React, { useMemo, useRef, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from 'three'

const ISS = React.memo(() => {
    const issRef = useRef()
    const clockRef = useRef(new THREE.Clock())
    const memorizedISS = useMemo(() => {
        return useGLTF('/ISSModel/ISS_stationary.gltf')
    })
    const xAxis =2
    const updateIssPosition = useCallback(() => {
        //orbit rotation
        issRef.current.position.x = Math.sin(clockRef.current.getElapsedTime() *0.6) * xAxis
        issRef.current.position.z = Math.cos(clockRef.current.getElapsedTime() *0.6) * xAxis

    },[])
    useFrame (() => {
        updateIssPosition()
    })


    return(
        <mesh>
            <primitive
            ref = {issRef}
            object={memorizedISS.scene} 
            position={[xAxis, 0, 0]} 
            scale={0.005} 
            />
        </mesh>
    )

})

export default ISS