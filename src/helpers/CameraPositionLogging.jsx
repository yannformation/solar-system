import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"


function CameraPositionLogging ({ event }) {
    const { camera } = useThree()
    const cameraRef = useRef()

    useEffect(() => {
        const LogCameraPosition = () => {
            const { x, y, z } = cameraRef.current.position
            const roundX = Math.round(x * 100) / 100
            const roundY = Math.round(y * 100) / 100
            const roundZ = Math.round(z * 100) / 100
            console.log(`camera position: x: ${roundX}, y: ${roundY}, z: ${roundZ}`);
        }

        cameraRef.current = camera
        window.addEventListener(event, LogCameraPosition)
        
        return () => {
            window.removeEventListener(event, LogCameraPosition)
            
        }
    }, [])

    return null
}

export default CameraPositionLogging