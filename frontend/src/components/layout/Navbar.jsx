import NavItems from "./NavItems"

function Navbar({menuOpen,closeMenu}) {
  return (
    <>
        <nav className='navbar'>
            <div className='md:bg-slate-100 w-full py-2 px-4'>
                <NavItems menuOpen={menuOpen} closeMenu={closeMenu}/>
            </div>
        </nav>
    </>
  )
}

export default Navbar