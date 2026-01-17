
import { Avatar } from './components/ui/Avatar'
import { Modal } from './components/ui/Modal'
import { useState } from 'react'
function App() {
 
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Avatar src="https://placehold.co/64x64" alt="A" />
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal">
        <p>Modal content</p>
      </Modal>
    </>
  ) 
}

export default App
