"use client"

import ProfileSidebar from '@/components/ProfileSidebar'
import Protected from '@/hooks/useProtected'
import { useState } from 'react'

const Profile = () => {
  const [scroll, setScroll] = useState(false)
  const [active, setActive] = useState(1)
  const [avatar, setAvatar] = useState(null)

  if(typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      if(window.scrollY > 85) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    })
  }

  return (
    <Protected>
      <div className="w-[85%] flex mx-auto">
        <div className={`sub-profile ${scroll ? "top-[120px]" : "top-[30px"}`}>
          <ProfileSidebar
            setActive={setActive}
            active={active}
            avatar={avatar}
          />
        </div>
      </div>
    </Protected>
  )
}

export default Profile
