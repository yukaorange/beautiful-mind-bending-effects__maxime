import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Experience } from '@/components/Experience'
import { Sns } from '@/components/Sns'
import { MenuButton } from '@/components/MenuButton'
import { Loader } from '@react-three/drei'
import { Suspense } from 'react'

const App = () => {
  return (
    <>
      <Loader />
      <MenuButton />
      <Sns />
      <Canvas shadows camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <OrbitControls />
          <Experience />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App
