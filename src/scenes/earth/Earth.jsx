import { useTexture } from "@react-three/drei";
import { useFrame,useThree } from "@react-three/fiber";//useThree pour permettre le suivi par la caméra
import React, { useRef, useEffect, useState, useCallback } from "react";
import Moon from "./Moon";
import ISS from "./ISS";

import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'//todo à faire immédiatement après l'installation de la librairie "tweenjs"

const Earth = React.memo(({ displacementScale }) => {
  const earthRef = useRef();
  // const earthPositionRef = useRef(new THREE.Vector3(8, 0, 0))//!commenté avant l'installation du package "Tween.js"
  const clockRef = useRef(new THREE.Clock())//Crée une référence pour le clock

  const { camera } = useThree()

  const [hovered, hover] = useState(false)//permettra d'afficher un pointer et mettre en surbrillance la terre lors du survol
  const [followingEarth, setFollowingEarth] = useState(false)//permettra d'animer la caméra au click pour suivre la terre

  const [cameraPosition, setCameraPosition] = useState(
    new THREE.Vector3(16.14, 8.32, 19.81))

 const [cameraTarget, setCameraTarget] =  useState(
  new THREE.Vector3(0, 0, 0)
 )
  

  const [earthTexture, 
    earthNormalMap, 
    earthSpecularMap, 
    earthDisplacementMap, 
    earthEmissiveMap
  ] = useTexture([
      "/assets/earthDay.jpg",
      "/assets/earthNormalMap.jpg",
      "/assets/earthSpecularMap.jpg",
      "/assets/earthDisplacementMap.jpg",
      "/assets/earthNight.jpg"
    ]);

    const updateEarthPosition = useCallback(() => {
      //calcul de la position de la terre basé sur son angle par rapport au soleil
      const angle = clockRef.current.getElapsedTime() * 0.5
      const distance = 14
      const x = Math.sin(angle) * distance
      const z = Math.cos(angle) * distance
      earthRef.current.position.set(x, 0, z)
      earthRef.current.rotation.y += 0.002
      // earthPositionRef.current = earthRef.current.position

    }, [])
    //pour permettre de basculer entre les états "suivre la terre" ou "pas suivre la terre"
    const toggleFollowingEarth = () => {
      setFollowingEarth((previousFollowingEarth) => !previousFollowingEarth)
    }


    //pour transformer la souris en pointer lors du survol
    useEffect(() => {
      document.body.style.cursor = hovered ? 'pointer' : 'auto'
    }, [hovered])

   const tweenLogic = useCallback(() => {
    TWEEN.update()

    const earthPositionRef = earthRef.current.position
    
    
    if(followingEarth) {
      //pour permettre à la caméra de suivre la terre sur son orbite
      const cameraTargetPosition = new THREE.Vector3(
        earthPositionRef.x +10,
        earthPositionRef.y +2,
        earthPositionRef.z +5
      )

      //Tween pour la position de la camera
      new TWEEN.Tween(cameraPosition)
      .to(cameraTargetPosition, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        setCameraPosition(cameraPosition)
      })
      .start()
      //tween pour le ciblage de la caméra
      new TWEEN.Tween(cameraTarget)
        .to (earthPositionRef, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          setCameraTarget(cameraTarget)
        })
        .start()

      // camera.lookAt(earthPositionRef)
      // camera.position.copy(cameraTargetPosition)//pour permettre à la caméra de suivre la terre sur son orbite
    } else{
      const originalCameraPosition = new THREE.Vector3(16.14, 8.32,19.81)
      const originalCameraTarget = new THREE.Vector3(0, 0, 0)
      //Tween pour la position originale de la caméra
      new TWEEN.Tween(cameraPosition)
      .to(originalCameraPosition, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        setCameraPosition(cameraPosition)
      })
      .start()

      //Tween pour la cible originale
      new TWEEN.Tween(cameraTarget)
      .to(originalCameraTarget, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        setCameraTarget(cameraTarget)
      })
      .start()
    }

      camera.lookAt(cameraTarget)
      camera.position.copy(cameraPosition)
      camera.updateProjectionMatrix()
   })

    //Mettre à jour la position de la terre et permettre le suivi par la caméra
    useFrame(() => {
      updateEarthPosition()
      tweenLogic()
     
  });   

  return (
    <group ref={earthRef}>
      <mesh castShadow receiveShadow
      onClick={toggleFollowingEarth} // déclenche au click(sur la terre) le suivi de la terre par la caméra, un second click(sur la terre) fera revenir la caméra à son état d'origine
      onPointerOver={() => hover(true)}//fonction fléchée appliquée directement concerné(la terre) pour le survol de la souris
      onPointerOut={() => hover(false)}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          displacementMap={earthDisplacementMap}
          displacementScale={displacementScale}
          emissiveMap={earthEmissiveMap}
          emissive={0xffffff}
          emissiveIntensity={hovered ? 20 :2}
        />
      </mesh>
      <ISS />
      <Moon />
    </group>
  );
});

export default Earth;

/*meshStandardMaterial n'accepte pas les specular map il faut donc changer pour quelque choses comme MeshPhongmaterial qui accepte les specular*/

//TODO POUR PERMETTRE UN SUIVI DYNAMIQUE DE LA TERRE IL FAUT INSTALLER LA LIBRAIRIE D'ANIMATION TWEEN.JS EN FAISANT "npm install @tweenjs/tween.js"
