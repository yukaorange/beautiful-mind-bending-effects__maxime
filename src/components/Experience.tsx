import {
  Sky,
  useFBO,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei'
import { useFrame, createPortal } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useRef, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as THREE from 'three'

import vertexShader from '@/shaders/vertexshader.glsl'
import fragmentShader from '@/shaders/fragmentshader.glsl'

type Material = THREE.MeshBasicMaterial | THREE.MeshPhysicalMaterial | undefined

export const Experience = (): JSX.Element => {
  const mesh1 = useRef<THREE.Mesh>(null)
  const mesh2 = useRef<THREE.Mesh>(null)
  const mesh3 = useRef<THREE.Mesh>(null)
  const mesh4 = useRef<THREE.Mesh>(null)

  const lens = useRef<THREE.Mesh>(null)

  const renderTarget = useFBO()

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

  useFrame((state) => {
    const { gl, clock, scene, camera, pointer } = state

    const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 2])

    if (lens.current) {
      lens.current.position.x = THREE.MathUtils.lerp(
        lens.current.position.x,
        (pointer.x * viewport.width) / 2,
        0.1,
      )

      lens.current.position.y = THREE.MathUtils.lerp(
        lens.current.position.y,
        (pointer.y * viewport.height) / 2,
        0.1,
      )
    }

    let oldMaterialMesh3
    let oldMaterialMesh4

    if (mesh3.current) {
      oldMaterialMesh3 = mesh3.current.material
    }

    if (mesh4.current) {
      oldMaterialMesh4 = mesh4.current.material
    }

    mesh1.current && (mesh1.current.visible = false)

    mesh2.current && (mesh2.current.visible = true)

    if (mesh3.current) {
      mesh3.current.material = new THREE.MeshBasicMaterial()

      const material3 = mesh3.current.material as THREE.MeshBasicMaterial

      material3.color = new THREE.Color('#000000')

      material3.wireframe = true
    }

    if (mesh4.current) {
      mesh4.current.material = new THREE.MeshBasicMaterial()

      const material4 = mesh4.current.material as THREE.MeshBasicMaterial

      material4.color = new THREE.Color('#000000')

      material4.wireframe = true
    }

    gl.setRenderTarget(renderTarget)

    gl.render(scene, camera)

    if (lens.current) {
      const lensMaterial = lens.current.material as THREE.ShaderMaterial

      lensMaterial.uniforms.uTexture.value = renderTarget.texture

      lensMaterial.uniforms.uResolution.value = new THREE.Vector2(
        window.innerWidth,
        window.innerHeight,
      ).multiplyScalar(Math.min(window.devicePixelRatio, 2))
    }

    mesh1.current && (mesh1.current.visible = true)
    mesh2.current && (mesh2.current.visible = false)

    if (mesh3.current && oldMaterialMesh3) {
      mesh3.current.material = oldMaterialMesh3

      const material3 = mesh3.current.material as THREE.MeshBasicMaterial

      material3.wireframe = false
    }

    if (mesh4.current && oldMaterialMesh4) {
      mesh4.current.material = oldMaterialMesh4

      const material4 = mesh4.current.material as THREE.MeshBasicMaterial

      material4.wireframe = false
    }

    if (mesh1.current) {
      mesh1.current.rotation.x = Math.cos(clock.elapsedTime / 2)
      mesh1.current.rotation.y = Math.sin(clock.elapsedTime / 2)
      mesh1.current.rotation.z = Math.sin(clock.elapsedTime / 2)
    }

    if (mesh2.current) {
      mesh2.current.rotation.x = Math.cos(clock.elapsedTime / 2)
      mesh2.current.rotation.y = Math.sin(clock.elapsedTime / 2)
      mesh2.current.rotation.z = Math.sin(clock.elapsedTime / 2)
    }

    gl.setRenderTarget(null)
  })

  return (
    <>
      <Sky sunPosition={[10, 10, 0]} />
      <Environment preset="sunset" />
      <directionalLight args={[10, 10]} intensity={1} />
      <ambientLight intensity={0.5} />
      <ContactShadows
        frames={1}
        scale={10}
        position={[0, -2, 0]}
        blur={4}
        opacity={0.2}
      />
      <mesh ref={lens} scale={0.5} position={[0, 0, 2.5]}>
        <sphereGeometry args={[1, 128]} />
        <shaderMaterial
          key={uuidv4()}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
          wireframe={false}
        />
      </mesh>
      <group>
        <mesh ref={mesh2}>
          <torusGeometry args={[1, 0.25, 16, 100]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh1}>
          <dodecahedronGeometry args={[1]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh3} position={[-3, 1, -2]}>
          <icosahedronGeometry args={[1, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
        <mesh ref={mesh4} position={[3, -1, -2]}>
          <icosahedronGeometry args={[1, 8]} />
          <meshPhysicalMaterial
            roughness={0}
            clearcoat={1}
            clearcoatRoughness={0}
            color="#73B9ED"
          />
        </mesh>
      </group>
    </>
  )
}
