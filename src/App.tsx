import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Experience } from '@/components/Experience'
import { Sns } from '@/components/Sns'
import { MenuButton } from '@/components/MenuButton'
import { Loader } from '@react-three/drei'

const App = () => {
  return (
    <>
      <Loader />
      <MenuButton />
      <Sns />
      <Canvas shadows camera={{ position: [0, 0, 4] }} dpr={[1, 2]}>
        <OrbitControls />
        <Experience />
      </Canvas>
    </>
  )
}

export default App
