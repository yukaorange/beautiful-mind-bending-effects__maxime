import {
  Sky,
  useFBO,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
  useTexture,
} from '@react-three/drei'
import { useFrame, createPortal } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as THREE from 'three'

import vertexShader from '@/shaders/vertexshader.glsl'
import fragmentShader from '@/shaders/fragmentshader.glsl'
import { attach } from '@react-three/fiber/dist/declarations/src/core/utils'

type Material = THREE.MeshBasicMaterial | THREE.MeshPhysicalMaterial | undefined

type Cylinder = THREE.Mesh<
  THREE.BufferGeometry,
  THREE.Material | THREE.Material[]
> | null

export const Experience = (): JSX.Element => {
  const torus = useRef<THREE.Mesh>(null)
  const box = useRef<THREE.Mesh>(null)
  const cylinder1 = useRef<Cylinder>(null)
  const cylinder2 = useRef<Cylinder>(null)

  const renderTarget1 = useFBO()
  const renderTarget2 = useFBO()

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: null,
      },
      uResolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight,
        ).multiplyScalar(Math.min(window.devicePixelRatio, 2)),
      },
      uAspect: {
        value: window.innerWidth / window.innerHeight,
      },
    }
  }, [])

  const updateUniforms = () => {
    const resolution = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight,
    ).multiplyScalar(Math.min(window.devicePixelRatio, 2))

    uniforms.uResolution.value = resolution

    if (cylinder1.current && Array.isArray(cylinder1.current.material)) {
      cylinder1.current.material.forEach((material) => {
        if (material.type === 'ShaderMaterial') {
          ;(material as THREE.ShaderMaterial).uniforms.uResolution.value =
            resolution
        }
      })
    }

    if (cylinder2.current && Array.isArray(cylinder2.current.material)) {
      cylinder2.current.material.forEach((material) => {
        if (material.type === 'ShaderMaterial') {
          ;(material as THREE.ShaderMaterial).uniforms.uResolution.value =
            resolution
        }
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', updateUniforms)
    return () => window.removeEventListener('resize', updateUniforms)
  }, [])

  useFrame((state) => {
    const { gl, clock, scene, camera } = state

    camera.position.x = Math.sin(clock.getElapsedTime()) * 15
    camera.position.z = Math.cos(clock.getElapsedTime()) * 15
    // camera.position.x = Math.sin(Math.PI / 2) * 15
    // camera.position.z = Math.cos(Math.PI / 2) * 15

    const resolution = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight,
    ).multiplyScalar(Math.min(window.devicePixelRatio, 2))

    if (cylinder1.current && Array.isArray(cylinder1.current.material)) {
      cylinder1.current.material.forEach((material) => {
        material.type == 'shaderMaterial'
          ? ((material as THREE.ShaderMaterial).uniforms.uResolution.value =
              new THREE.Vector2(
                window.innerWidth,
                window.innerHeight,
              ).multiplyScalar(Math.min(window.devicePixelRatio, 2)))
          : null
      })
    }

    if (cylinder2.current && Array.isArray(cylinder2.current.material)) {
      cylinder2.current.material.forEach((material) => {
        material.type == 'shaderMaterial'
          ? ((material as THREE.ShaderMaterial).uniforms.uResolution.value =
              new THREE.Vector2(
                window.innerWidth,
                window.innerHeight,
              ).multiplyScalar(Math.min(window.devicePixelRatio, 2)))
          : null
      })
    }

    torus.current && (torus.current.visible = false)
    box.current && (box.current.visible = true)

    gl.setRenderTarget(renderTarget1)
    gl.render(scene, camera)

    torus.current && (torus.current.visible = true)
    box.current && (box.current.visible = false)

    gl.setRenderTarget(renderTarget2)
    gl.render(scene, camera)

    gl.setRenderTarget(null)

    // const newPositionZ = Math.sin(clock.elapsedTime)
    const newPositionZ = 0

    box.current && (box.current.position.z = newPositionZ)
    torus.current && (torus.current.position.z = newPositionZ)
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <directionalLight args={[5, 5]} intensity={1} />
      <ambientLight intensity={0.5} />
      {/* cylinder */}
      <mesh
        ref={cylinder1}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -4]}
      >
        <cylinderGeometry args={[5, 5, 8, 32]} />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            ...uniforms,
            uTexture: {
              value: renderTarget1.texture,
            },
          }}
          attach="material-0"
        />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            ...uniforms,
            uTexture: {
              value: renderTarget1.texture,
            },
          }}
          attach="material-1"
        />
        <meshStandardMaterial
          attach="material-2"
          color="green"
          transparent
          opacity={0}
        />
      </mesh>
      {/* cylinder */}
      <mesh
        ref={cylinder2}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 4]}
      >
        <cylinderGeometry args={[5, 5, 8, 32]} />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            ...uniforms,
            uTexture: {
              value: renderTarget2.texture,
            },
          }}
          attach="material-0"
        />
        <meshStandardMaterial
          attach="material-1"
          color="green"
          transparent
          opacity={0}
        />
        <shaderMaterial
          key={uuidv4()}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            ...uniforms,
            uTexture: {
              value: renderTarget2.texture,
            },
          }}
          attach="material-2"
        />
      </mesh>
      {/* torus */}
      <mesh>
        <torusGeometry args={[5, 0.02, 100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* torusknot */}
      <mesh ref={torus} position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.75, 0.3, 100, 16]} />
        <meshPhysicalMaterial
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          color="#73B9ED"
        />
      </mesh>
      {/* box */}
      <mesh ref={box} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshPhysicalMaterial
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          color="#73B9ED"
        />
      </mesh>
    </>
  )
}
